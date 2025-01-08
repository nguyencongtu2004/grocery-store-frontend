import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import PropTypes from 'prop-types';
import { queryClient } from "../../requests";
import { useState } from "react";
import { deleteDiscount } from "../../requests/discount";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ isOpen, onClose, discount }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await deleteDiscount({ id: discount._id });

      if (response.status === 200) {
        queryClient.invalidateQueries('discounts');
        onClose();
        toast.success('Delete discount successfully');
      } else {
        toast.error('Failed to delete discount: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error deleting discount: ' + error.message);
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
          <p>Are you sure you want to delete the discount <strong>{discount.code}</strong>?</p>
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
  discount: PropTypes.object.isRequired
};

