import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Mail, User, Briefcase, Phone, MapPin } from 'lucide-react';
import PropTypes from 'prop-types';

export default function EmployeeDetailModal({ isOpen, onClose, employee }) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Employee Details</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User size={20} className="text-gray-500" />
              <div>
                <p className="font-semibold">Name</p>
                <p>{employee.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={20} className="text-gray-500" />
              <div>
                <p className="font-semibold">Email</p>
                <p>{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Briefcase size={20} className="text-gray-500" />
              <div>
                <p className="font-semibold">Role</p>
                <p className="capitalize">{employee.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone size={20} className="text-gray-500" />
              <div>
                <p className="font-semibold">Phone</p>
                <p>{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin size={20} className="text-gray-500" />
              <div>
                <p className="font-semibold">Address</p>
                <p>{employee.address}</p>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
            variant="light" 
            onPress={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

EmployeeDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired
};
