import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Trash, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export default function EditPurchaseModal({ isOpen, onClose, purchaseOrder, onUpdate }) {
  const [formData, setFormData] = useState({
    provider: "",
    orderDate: "",
    products: []
  });

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        provider: purchaseOrder.provider || "",
        orderDate: purchaseOrder.orderDate || "",
        products: purchaseOrder.products.map(product => ({
          ...product,
          images: [...(product.images || [null, null, null, null])].slice(0, 4),
        }))
      });
    }
  }, [purchaseOrder]);

  const handleImageChange = (productIndex, imageIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      
      const newProducts = [...formData.products];
      newProducts[productIndex].images[imageIndex] = file;
      setFormData({ ...formData, products: newProducts });
    }
  };

  const handleInputChange = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const addProductLine = () => {
    setFormData({
      ...formData,
      products: [
        ...formData.products,
        {
          images: [null, null, null, null],
          productName: "",
          category: "",
          importPrice: "",
          stockQuantity: "",
          sellingPrice: "",
          expireDate: ""
        }
      ]
    });
  };

  const deleteProductLine = (index) => {
    const newProducts = formData.products.filter((_, i) => i !== index);
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      products: formData.products.map(product => ({
        ...product,
        importPrice: Number(product.importPrice),
        stockQuantity: Number(product.stockQuantity),
        sellingPrice: Number(product.sellingPrice),
        images: product.images
          .map(img => img instanceof File ? URL.createObjectURL(img) : img)
          .filter(Boolean)
      }))
    };
    onUpdate(updatedData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Sửa phiếu nhập hàng</h2>
          </ModalHeader>
          
          <ModalBody>
            <div className="grid gap-4">
              <Input
                autoFocus
                label="Nhà cung cấp"
                placeholder="Ví dụ: Nam Ngư"
                variant="bordered"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                required
              />
              <Input
                label="Ngày nhập hàng"
                type="date"
                variant="bordered"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                required
              />
              
              {formData.products.map((product, productIndex) => (
                <div key={productIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Sản phẩm {productIndex + 1}</h3>
                    {formData.products.length > 1 && (
                      <Button
                        isIconOnly
                        color="danger"
                        variant="light"
                        onPress={() => deleteProductLine(productIndex)}
                      >
                        <Trash size={20} />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {product.images.map((image, imageIndex) => (
                      <div
                        key={`image-${imageIndex}`}
                        className="border-dashed border rounded-md p-4 flex flex-col items-center gap-2"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(productIndex, imageIndex, e)}
                          className="hidden"
                          id={`image-${productIndex}-${imageIndex}`}
                        />
                        <label
                          htmlFor={`image-${productIndex}-${imageIndex}`}
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          {image ? (
                            <img
                              src={image instanceof File ? URL.createObjectURL(image) : image}
                              alt={`Preview ${imageIndex + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                              <span className="text-sm text-gray-500">Hình ảnh {imageIndex + 1}</span>
                            </>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tên sản phẩm"
                      placeholder="Ví dụ: Nước tương"
                      variant="bordered"
                      value={product.productName}
                      onChange={(e) => handleInputChange(productIndex, "productName", e.target.value)}
                      required
                    />
                    <Input
                      label="Danh mục"
                      placeholder="Ví dụ: Gia vị"
                      variant="bordered"
                      value={product.category}
                      onChange={(e) => handleInputChange(productIndex, "category", e.target.value)}
                      required
                    />
                    <Input
                      label="Giá nhập hàng"
                      type="number"
                      placeholder="Ví dụ: 15000"
                      variant="bordered"
                      value={product.importPrice}
                      onChange={(e) => handleInputChange(productIndex, "importPrice", e.target.value)}
                      required
                    />
                    <Input
                      label="Số lượng nhập"
                      type="number"
                      placeholder="Ví dụ: 150"
                      variant="bordered"
                      value={product.stockQuantity}
                      onChange={(e) => handleInputChange(productIndex, "stockQuantity", e.target.value)}
                      required
                    />
                    <Input
                      label="Giá bán"
                      type="number"
                      placeholder="Ví dụ: 18000"
                      variant="bordered"
                      value={product.sellingPrice}
                      onChange={(e) => handleInputChange(productIndex, "sellingPrice", e.target.value)}
                      required
                    />
                    <Input
                      label="Ngày hết hạn"
                      type="date"
                      variant="bordered"
                      value={product.expireDate}
                      onChange={(e) => handleInputChange(productIndex, "expireDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}

              <Button
                className="mx-auto flex items-center gap-2 border border-dashed border-blue-400 py-1 rounded-md hover:bg-blue-50"
                color="default"
                variant="light"
                onPress={addProductLine}
              >
                <span className="text-blue-500 font-bold text-sm">+</span>
                <span className="text-blue-600 text-sm">Thêm sản phẩm</span>
              </Button>
            </div>
          </ModalBody>
          
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" type="submit">
              Sửa phiếu nhập hàng
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

EditPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  purchaseOrder: PropTypes.shape({
    provider: PropTypes.string.isRequired,
    orderDate: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string),
        productName: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        importPrice: PropTypes.number.isRequired,
        stockQuantity: PropTypes.number.isRequired,
        sellingPrice: PropTypes.number.isRequired,
        expireDate: PropTypes.string.isRequired
      })
    ).isRequired
  })
};