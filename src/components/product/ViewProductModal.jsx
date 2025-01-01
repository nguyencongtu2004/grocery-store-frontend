import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Image as ImageIcon } from "lucide-react";
import PropTypes from "prop-types";

export default function ViewProductModal({ isOpen, onClose, product }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">View Product</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {product?.images?.map((image, index) => (
              <div
                key={`image-${index}`}
                className="border rounded-lg p-4 flex items-center justify-center h-24"
              >
                {image ? (
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-blue-500 flex items-center">
                    <ImageIcon size={24} />
                    <span className="ml-2 text-blue-500">Image {index + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Product Name"
              value={product?.name || "N/A"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Category"
              value={product?.category?.name || "Uncategorized"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Stock Quantity"
              value={product?.stockQuantity || "0"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Price"
              value={product?.price || "N/A"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Order Date"
              value={product?.orderDate || "N/A"}
              readOnly
              variant="bordered"
            />
            <Input
              label="Expiration Date"
              value={product?.expiredDate || "N/A"}
              readOnly
              variant="bordered"
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ViewProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
};
  