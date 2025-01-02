import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "../../requests/category";
import { toast } from "react-hot-toast";
import PropTypes from "prop-types";

export default function EditCategoryModal({ isOpen, onOpenChange, category }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
    }
  }, [category]);

  const queryClient = useQueryClient();

  const { mutate: editCategory, isLoading } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["category"]);
      toast.success("Category updated successfully");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    editCategory({ id: category._id, name, description });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Edit Category</ModalHeader>
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
                Update Category
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}

EditCategoryModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  category: PropTypes.object,
};

