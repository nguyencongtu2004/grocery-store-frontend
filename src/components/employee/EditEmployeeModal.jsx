import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Mail, Lock, User, Briefcase, Phone, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';
import { updateEmployee } from "../../requests/employee";
import { queryClient } from "../../requests";
import toast from "react-hot-toast";
import { useState } from 'react';

export default function EditEmployeeModal({ isOpen, onClose, employee }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    try {
      formData.append('id', employee._id);

      const response = await updateEmployee({ formData });

      if (response.status === 200) {
        queryClient.invalidateQueries('employees');
        onClose();
        toast.success('Update employee successfully');
      } else {
        toast.error('Failed to update employee: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error updating employee: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Edit Employee</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <Input
                type="file"
                name="files"
                label="Profile Image"
                accept="image/*"
                description="Select employee profile image"
              />
              <Input
                autoFocus
                name="email"
                label="Email"
                defaultValue={employee.email}
                placeholder="nguyencongtu@gmail.com"
                variant="bordered"
                startContent={<Mail size={18} />}
                required
              />
              <Input
                name="password"
                label="Password"
                placeholder="Leave blank if no change"
                type="password"
                variant="bordered"
                startContent={<Lock size={18} />}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Name"
                  defaultValue={employee.name}
                  placeholder="Công Tú"
                  variant="bordered"
                  startContent={<User size={18} />}
                  required
                />
                <Select
                  name="role"
                  label="Role"
                  placeholder="Select role"
                  variant="bordered"
                  startContent={<Briefcase size={18} />}
                  defaultSelectedKeys={[employee.role]}
                  required
                >
                  <SelectItem key="sale">Sale</SelectItem>
                  <SelectItem key="warehouse">Warehouse</SelectItem>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="phone"
                  label="Phone"
                  defaultValue={employee.phone}
                  placeholder="0123456789"
                  variant="bordered"
                  startContent={<Phone size={18} />}
                  required
                />
                <Input
                  name="address"
                  label="Address"
                  defaultValue={employee.address}
                  placeholder="123, đường 456"
                  variant="bordered"
                  startContent={<MapPin size={18} />}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Close
            </Button>
            <Button color="primary" type="submit" isLoading={isLoading}>
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

EditEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired
};
