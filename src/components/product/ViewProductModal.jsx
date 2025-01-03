import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Image as ImageIcon } from "lucide-react";
import PropTypes from "prop-types";

export default function ViewProductModal({ isOpen, onClose, product }) {
  // Tạo mảng 4 vị trí cho ảnh
  const imageSlots = Array(4).fill(null).map((_, index) => product?.images?.[index] || null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">View Product</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {imageSlots.map((image, index) => (
              <div
                key={`image-${index}`}
                className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {image ? (
                  <img
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <ImageIcon size={32} className="text-gray-300" />
                    <span className="text-sm font-medium">Image {index + 1}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Product Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {product?.name || "N/A"}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {product?.category?.name || "Uncategorized"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {product?.stockQuantity || "0"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {product?.sellingPrice ? `${product.sellingPrice.toLocaleString()} VND` : "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Import Date</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                {product?.importDate || "N/A"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Expiration Date</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-red-600">
                {product?.expiredDate || "N/A"}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            variant="light"
            onClick={onClose}
            className="font-medium"
          >
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