import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Mail, Lock, User, Briefcase, Phone, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';
import { createEmployee } from "../../requests/employee";
import { queryClient } from "../../requests";
import toast from "react-hot-toast";

export default function AddEmployeeModal({ isOpen, onClose }) {
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await createEmployee({
      email: formData.get('email'),
      password: formData.get('password'),
      name: formData.get('name'),
      role: formData.get('role'),
      phone: formData.get('phone'),
      address: formData.get('address')
    });

    if (response.status === 201) {
      queryClient.invalidateQueries('employees');
      onClose();
      toast.success('Add employee successfully');
    } else {
      toast.error('Failed to add employee: ' + response.data.message);
    }

    onClose();
  };

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
            <h2 className="text-xl font-bold">Add Employee</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <Input
                autoFocus
                name="email"
                label="Email"
                placeholder="nguyencongtu@gmail.com"
                variant="bordered"
                startContent={<Mail size={18} />}
                required
              />
              <Input
                name="password"
                label="Password"
                placeholder="123456"
                type="password"
                variant="bordered"
                startContent={<Lock size={18} />}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="name"
                  label="Name"
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
                  defaultSelectedKeys={["sale"]}
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
                  placeholder="0123456789"
                  variant="bordered"
                  startContent={<Phone size={18} />}
                  required
                />
                <Input
                  name="address"
                  label="Address"
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
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Employee
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

AddEmployeeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};