import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import PropTypes from 'prop-types';
import { queryClient } from "../../requests";
import { useState } from "react";
import { deleteCategory } from "../../requests/category";
import toast from "react-hot-toast";

export default function DeleteConfirmModal({ isOpen, onClose, category }) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const response = await deleteCategory({ id: category._id });

      if (response.status === 200) {
        queryClient.invalidateQueries('categories');
        toast.success('Delete category successfully')
        onClose();
      } else {
        toast.error('Failed to delete category: ' + response.data.message)
      }
    } catch (error) {
      toast.error('Error deleting category: ' + error.message);
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
          <p>Are you sure you want to delete the category <strong>{category.name}</strong>?</p>
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
  category: PropTypes.object.isRequired
};

