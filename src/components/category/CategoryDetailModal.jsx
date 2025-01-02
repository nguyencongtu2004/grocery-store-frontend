import { useQuery } from "@tanstack/react-query";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";
import { fetchCategoryById } from "../../requests/category";
import PropTypes from "prop-types";

export default function CategoryDetailModal({ isOpen, onOpenChange, categoryId }) {
  const { data, isLoading } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategoryById({ id: categoryId }),
    enabled: !!categoryId,
  });
  
  const category = data?.data;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Category Details</ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center">
                  <Spinner size="lg" />
                </div>
              ) : category ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Name</h3>
                    <p>{category.name}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p>{category.description || "Not provided"}</p>
                  </div>
                </div>
              ) : (
                <p>No category data available</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

CategoryDetailModal.propTypes = {
  isOpen: PropTypes.bool,
  onOpenChange: PropTypes.func,
  categoryId: PropTypes.string,
};

