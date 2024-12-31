import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Trash, Image as ImageIcon } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function AddPurchaseModal({ isOpen, onClose }) {
  const [productLines, setProductLines] = useState([{
    images: [null, null, null, null],
    productName: "",
    category: "",
    importPrice: "",
    stockQuantity: "",
    sellingPrice: "",
    expireDate: ""
  }]);

  const handleImageChange = (productIndex, imageIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      const newProductLines = [...productLines];
      newProductLines[productIndex].images[imageIndex] = file;
      setProductLines(newProductLines);
    }
  };

  const addProductLine = () => {
    setProductLines([...productLines, {
      images: [null, null, null, null],
      productName: "",
      category: "",
      importPrice: "",
      stockQuantity: "",
      sellingPrice: "",
      expireDate: ""
    }]);
  };

  const deleteProductLine = (index) => {
    const updatedLines = productLines.filter((_, i) => i !== index);
    setProductLines(updatedLines);
  };

  const handleInputChange = (index, field, value) => {
    const updatedLines = [...productLines];
    updatedLines[index][field] = value;
    setProductLines(updatedLines);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const purchaseData = {
      provider: formData.get("provider"),
      orderDate: formData.get("orderDate"),
      products: productLines.map(line => ({
        images: line.images.filter(Boolean).map(img => URL.createObjectURL(img)),
        productName: line.productName,
        category: line.category,
        importPrice: Number(line.importPrice),
        stockQuantity: Number(line.stockQuantity),
        sellingPrice: Number(line.sellingPrice),
        expireDate: line.expireDate
      }))
    };
    console.log("New Purchase Order Data:", purchaseData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Thêm phiếu nhập hàng</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <Input
                autoFocus
                name="provider"
                label="Nhà cung cấp"
                placeholder="Ví dụ: Nam Ngư"
                variant="bordered"
                required
              />
              <Input
                name="orderDate"
                label="Ngày nhập hàng"
                type="date"
                variant="bordered"
                required
              />
              
              {productLines.map((line, productIndex) => (
                <div key={productIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Sản phẩm {productIndex + 1}:</h3>
                    {productIndex > 0 && (
                      <Trash
                        size={24}
                        onClick={() => deleteProductLine(productIndex)}
                        className="cursor-pointer text-red-500 hover:text-red-700"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {line.images.map((image, imageIndex) => (
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
                              src={URL.createObjectURL(image)}
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
                      name={`productName-${productIndex}`}
                      label="Tên sản phẩm"
                      placeholder="Ví dụ: Nước tương"
                      variant="bordered"
                      value={line.productName}
                      onChange={(e) => handleInputChange(productIndex, "productName", e.target.value)}
                      required
                    />
                    <Input
                      name={`category-${productIndex}`}
                      label="Danh mục"
                      placeholder="Ví dụ: Gia vị"
                      variant="bordered"
                      value={line.category}
                      onChange={(e) => handleInputChange(productIndex, "category", e.target.value)}
                      required
                    />
                    <Input
                      name={`importPrice-${productIndex}`}
                      label="Giá nhập hàng"
                      type="number"
                      placeholder="Ví dụ: 15000"
                      variant="bordered"
                      value={line.importPrice}
                      onChange={(e) => handleInputChange(productIndex, "importPrice", e.target.value)}
                      required
                    />
                    <Input
                      name={`stockQuantity-${productIndex}`}
                      label="Số lượng nhập"
                      type="number"
                      placeholder="Ví dụ: 150"
                      variant="bordered"
                      value={line.stockQuantity}
                      onChange={(e) => handleInputChange(productIndex, "stockQuantity", e.target.value)}
                      required
                    />
                    <Input
                      name={`sellingPrice-${productIndex}`}
                      label="Giá bán"
                      type="number"
                      placeholder="Ví dụ: 18000"
                      variant="bordered"
                      value={line.sellingPrice}
                      onChange={(e) => handleInputChange(productIndex, "sellingPrice", e.target.value)}
                      required
                    />
                    <Input
                      name={`expireDate-${productIndex}`}
                      label="Ngày hết hạn"
                      type="date"
                      variant="bordered"
                      value={line.expireDate}
                      onChange={(e) => handleInputChange(productIndex, "expireDate", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}

              <Button
                className="mx-auto flex items-center justify-center gap-2 border border-dashed border-blue-400 py-1 rounded-md hover:bg-blue-50"
                color="default"
                variant="light"
                onClick={addProductLine}
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
              Thêm phiếu nhập hàng
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

AddPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

