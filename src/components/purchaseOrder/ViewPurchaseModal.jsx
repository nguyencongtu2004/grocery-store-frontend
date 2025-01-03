import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Tooltip,
} from "@nextui-org/react";
import { Calendar, Package, DollarSign, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";

export default function ViewPurchaseModal({ isOpen, onClose, purchaseOrder }) {
  if (!purchaseOrder) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalAmount = (detail) => {
    return (detail.importPrice || 0) * (detail.quantity || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      scrollBehavior="inside"
      classNames={{
        body: "p-5",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-white dark:bg-[#19172c] rounded-lg",
        closeButton: "hover:bg-white/5 active:bg-white/10"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Purchase Order Details</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            {/* Supplier Information Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100">
              <CardBody className="p-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Supplier</p>
                      <p className="font-medium text-lg">
                        {purchaseOrder.provider?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">
                        {formatDate(purchaseOrder.orderDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Products List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product List
              </h3>
              
              {purchaseOrder.purchaseDetail?.map((detail, index) => (
                <Card key={detail._id || index} className="w-full">
                  <CardBody className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-md font-medium">Product {index + 1}</h4>
                        {detail.expireDate && (
                          <Tooltip 
                            content="Expiration Date"
                            color="warning"
                          >
                            <div className="flex items-center gap-1 text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                              <AlertCircle className="w-4 h-4" />
                              {formatDate(detail.expireDate)}
                            </div>
                          </Tooltip>
                        )}
                      </div>

                      {/* Product Images Grid */}
                      {detail.images && detail.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {detail.images.map((image, imageIndex) => (
                            <div
                              key={`image-${imageIndex}`}
                              className="relative aspect-square group overflow-hidden rounded-lg"
                            >
                              <img
                                src={image}
                                alt={`{detail.name || 'Product'} - Image {imageIndex + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src = "/api/placeholder/400/400";
                                  e.target.onerror = null;
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Product Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Product Name</p>
                          <p className="font-medium">{detail.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Category</p>
                          <p className="font-medium">{detail.category?.name || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Import Price</p>
                          <p className="font-medium">{(detail.importPrice)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-medium">{detail.quantity || 0} units</p>
                        </div>
                        <div className="lg:col-span-2">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="font-medium text-blue-600">
                            {(calculateTotalAmount(detail))}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Grand Total Section */}
            <Card className="bg-blue-500 text-white">
              <CardBody className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-lg">Grand Total</span>
                  </div>
                  <span className="text-1xl font-bold">
                    {(purchaseOrder.totalPrice)}
                  </span>
                </div>
              </CardBody>
            </Card>
          </div>
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
    provider: PropTypes.shape({
      name: PropTypes.string,
    }),
    orderDate: PropTypes.string,
    totalPrice: PropTypes.number,
    purchaseDetail: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
        category: PropTypes.shape({
          name: PropTypes.string,
        }),
        importPrice: PropTypes.number,
        quantity: PropTypes.number,
        expireDate: PropTypes.string,
      })
    ),
  }),
};