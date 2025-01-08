import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import PropTypes from "prop-types";
import { updateProduct } from "../../requests/product";
import toast from "react-hot-toast";

export default function EditProductModal({ isOpen, onClose, product, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    sellingPrice: "",
    stockQuantity: "",
    category: "",
    images: Array(4).fill(null),
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sellingPrice: product.sellingPrice || "",
        stockQuantity: product.stockQuantity || "",
        category: product.category?._id || "",
        images: [...(product.images || []), ...Array(4).fill(null)].slice(0, 4),
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (index, file) => {
    if (!file) return;

    // Kiểm tra file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files.');
      return;
    }

    // Kiểm tra file size (giới hạn 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB.');
      return;
    }

    // Tạo URL preview cho file
    const imageUrl = URL.createObjectURL(file);
    const updatedImages = [...formData.images];
    updatedImages[index] = {
      file,
      preview: imageUrl,
      name: file.name
    };
    setFormData(prev => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    if (updatedImages[index]?.preview) {
      URL.revokeObjectURL(updatedImages[index].preview);
    }
    updatedImages[index] = null;
    setFormData(prev => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('sellingPrice', formData.sellingPrice);
      formDataToSend.append('stockQuantity', formData.stockQuantity);
      formDataToSend.append('category', formData.category);
      
      // Append các file ảnh
      formData.images.forEach((image, index) => {
        if (image?.file) {
          formDataToSend.append(`image${index}`, image.file);
        }
      });

      await updateProduct(product._id, formDataToSend);
      onSave(formData);
      onClose();
      toast.success("Product updated successfully!");
    } catch (error) {
      toast.error("Failed to update product:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Edit Product</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {formData.images.map((image, index) => (
                <div
                  key={`image-${index}`}
                  className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 relative group"
                >
                  {image ? (
                    <div className="relative h-full">
                      <img
                        src={image.preview}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          isIconOnly
                          color="danger"
                          size="sm"
                          className="bg-white bg-opacity-75 hover:bg-opacity-100"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                        {image.name}
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-full cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(index, e.target.files[0])}
                      />
                      <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-2 text-gray-400 group-hover:bg-gray-100 transition-colors duration-200">
                        <Upload size={32} className="text-gray-300" />
                        <span className="text-sm font-medium">Upload Image</span>
                        <span className="text-xs text-gray-400">Click to browse</span>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Product Name</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <input
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Selling Price</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter selling price"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange("sellingPrice", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter stock quantity"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
                  required
                />
              </div>
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