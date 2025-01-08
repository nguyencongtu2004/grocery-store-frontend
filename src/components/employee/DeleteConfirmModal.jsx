import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import PropTypes from 'prop-types';
import { deleteEmployee } from "../../requests/employee";
import { queryClient } from "../../requests";
import { useState } from "react";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ isOpen, onClose, employee }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await deleteEmployee({ id: employee._id });

      if (response.status === 200) {
        queryClient.invalidateQueries('employees');
        onClose();
        toast.success('Delete employee successfully');
      } else {
        toast.error('Failed to delete employee: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error deleting employee: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold">Confirm Delete</h2>
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to delete the employee <strong>{employee.name}</strong>?</p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="default" 
            variant="light" 
            onPress={onClose}
          >
            Cancel
          </Button>
          <Button 
            color="danger" 
            onPress={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired
};
