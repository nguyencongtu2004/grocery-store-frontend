import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { Image as ImageIcon } from "lucide-react";

export default function ViewPurchaseModal({ isOpen, onClose, purchaseOrder }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Chi tiết phiếu nhập hàng</h2>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Nhà cung cấp</p>
                <p className="font-medium">{purchaseOrder?.provider}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Ngày nhập hàng</p>
                <p className="font-medium">{formatDate(purchaseOrder?.orderDate)}</p>
              </div>
            </div>

            <div className="space-y-4">
              {purchaseOrder?.products.map((product, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <Accordion>
                    <AccordionItem 
                      title={
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Sản phẩm {index + 1}</span>
                          <span className="text-sm text-gray-500">{product.productName}</span>
                        </div>
                      }
                    >
                      <div className="space-y-4 pt-2">
                        {/* Product Images */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Array.from({ length: 4 }).map((_, imgIndex) => (
                            <div
                              key={`image-${imgIndex}`}
                              className="border rounded-md p-4 flex items-center justify-center"
                            >
                              {product.images?.[imgIndex] ? (
                                <img
                                  src={product.images[imgIndex]}
                                  alt={`Hình ảnh ${imgIndex + 1}`}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-2">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                  <span className="text-sm text-gray-500">Hình ảnh {imgIndex + 1}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Tên sản phẩm</p>
                            <p className="font-medium">{product.productName}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Danh mục</p>
                            <p className="font-medium">{product.category}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Giá nhập hàng</p>
                            <p className="font-medium">{formatCurrency(product.importPrice)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Số lượng nhập</p>
                            <p className="font-medium">{product.stockQuantity}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Giá bán</p>
                            <p className="font-medium">{formatCurrency(product.sellingPrice)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Ngày hết hạn</p>
                            <p className="font-medium">{formatDate(product.expireDate)}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Đóng
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ViewPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
  }).isRequired
};