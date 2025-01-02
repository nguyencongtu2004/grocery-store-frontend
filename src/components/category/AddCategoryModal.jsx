import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "../../requests/category";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export default function AddCategoryModal({ isOpen, onOpenChange }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const { mutate: addCategory, isLoading } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["category"]);
      toast.success("Category added successfully");
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add category");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory({ name, description });
  };

  const resetForm = () => {
    setName("");
    setDescription("");
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Add New Category</ModalHeader>
            <ModalBody>
              <Input
                label="Name"
                placeholder="Enter category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Textarea
                label="Description"
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" type="submit" isLoading={isLoading}>
                Add Category
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

AddCategoryModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
};

