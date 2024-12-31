import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { ImageIcon } from "lucide-react";
import PropTypes from "prop-types";

export default function EditProductModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    sellingPrice: product?.sellingPrice || "",
    stockQuantity: product?.stockQuantity || "",
    category: product?.category || "",
    expirationDate: product?.expirationDate || "",
    images: product?.images || ["", "", "", ""],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Edit Product</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {(formData.images || ["", "", "", ""]).map((image, index) => (
                <div
                  key={index}
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
                label={<span className="text-gray-700">Product Name</span>}
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                variant="bordered"
                required
              />
              <Input
                label={<span className="text-gray-700">Category</span>}
                placeholder="Enter category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                variant="bordered"
                required
              />
              <Input
                type="number"
                label={<span className="text-gray-700">Selling Price</span>}
                placeholder="Enter selling price"
                value={formData.sellingPrice}
                onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                variant="bordered"
                required
              />
              <Input
                type="number"
                label={<span className="text-gray-700">Stock Quantity</span>}
                placeholder="Enter stock quantity"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                variant="bordered"
                required
              />
            </div>
            <div className="mt-4">
              <Input
                label={<span className="text-gray-700">Expiration Date</span>}
                type="date"
                placeholder="Enter expiration date"
                value={formData.expirationDate}
                onChange={(e) => handleInputChange("expirationDate", e.target.value)}
                variant="bordered"
                fullWidth
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

EditProductModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};
