import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Accordion, AccordionItem } from "@nextui-org/react";
import { Image as ImageIcon } from "lucide-react";
import PropTypes from "prop-types";

export default function ViewPurchaseModal({ isOpen, onClose, purchaseOrder }) {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('vi-VN') : "N/A";
  };

  const formatCurrency = (amount) => {
    return amount
      ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amount)
      : "N/A";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Purchase Order Details</h2>
        </ModalHeader>

        <ModalBody>
          {purchaseOrder ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Provider</p>
                  <p className="font-medium">{purchaseOrder.provider || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">{formatDate(purchaseOrder.orderDate)}</p>
                </div>
              </div>

              <div className="space-y-4">
                {(purchaseOrder.products || []).map((product, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <Accordion>
                      <AccordionItem
                        title={
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Product {index + 1}</span>
                            <span className="text-sm text-gray-500">{product.productName || "N/A"}</span>
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
                                    alt={`Image ${imgIndex + 1}`}
                                    className="w-20 h-20 object-cover rounded"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-2">
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                    <span className="text-sm text-gray-500">Image {imgIndex + 1}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Product Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Product Name</p>
                              <p className="font-medium">{product.productName || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Category</p>
                              <p className="font-medium">{product.category || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Import Price</p>
                              <p className="font-medium">{formatCurrency(product.importPrice)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Stock Quantity</p>
                              <p className="font-medium">{product.stockQuantity || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Selling Price</p>
                              <p className="font-medium">{formatCurrency(product.sellingPrice)}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500">Expiration Date</p>
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
          ) : (
            <p className="text-center text-gray-500">No purchase order details available.</p>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose}>
            Close
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
    provider: PropTypes.string,
    orderDate: PropTypes.string,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        images: PropTypes.arrayOf(PropTypes.string),
        productName: PropTypes.string,
        category: PropTypes.string,
        importPrice: PropTypes.number,
        stockQuantity: PropTypes.number,
        sellingPrice: PropTypes.number,
        expireDate: PropTypes.string,
      })
    ),
  }),
};
