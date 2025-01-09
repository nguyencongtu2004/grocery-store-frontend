import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Link, Tooltip } from "@nextui-org/react";
import { HelpCircle, Printer, QrCode } from "lucide-react";
import PropTypes from "prop-types";
import { createQr, exportInvoicePDF } from "../../requests/invoice";
import { formatDateTime, formatPrice } from "../../ultis/ultis";
import toast from "react-hot-toast";

export default function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  const calculateDiscountAmount = (totalPrice, discount) => {
    if (!discount) return 0;
    const discountAmount = (totalPrice * discount.discountInPercent) / 100;
    return Math.min(discountAmount, discount.maxDiscountValue);
  };

  const discountAmount = calculateDiscountAmount(invoice?.totalPrice, invoice?.discount);
  const finalPrice = (invoice?.totalPrice || 0);
  const priceBeforeDiscount = (invoice?.totalPrice || 0) + discountAmount;

  async function handleExport(id) {
    try {
      const response = await exportInvoicePDF({ id });

      if (response.headers['content-type'] === 'application/pdf') {
        // Tạo Blob từ dữ liệu
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Tạo URL từ Blob
        const url = URL.createObjectURL(blob);

        // Mở file PDF trong tab mới
        const newWindow = window.open(url, '_blank');

        if (newWindow) {
          // Chờ file PDF được load xong
          newWindow.onload = () => {
            // Gọi hộp thoại in
            newWindow.print();
          };
        } else {
          toast.error('Cannot open new tab. Please check your browser popup settings.');
        }

        // Xóa URL tạm sau một thời gian
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        toast.error('Failed to export PDF. Please try again later.');
      }
    } catch (error) {
      toast.error('Failed to export PDF. Please try again later. ' + error.message);
    }
  }

  async function handleCreateQr(id) {
    if (invoice?.paymentData) {
      // window.open(invoice.paymentData.payUrl, '_blank');
      onClose(invoice.paymentData.payUrl);
      return;
    }
    try {
      const response = await createQr({ id });
      if (response.status === 200) {
        toast.success('Create QR code successfully');
        const qrCodeUrl = response.data.data.payUrl;
        onClose(qrCodeUrl);
        // window.open(qrCodeUrl, '_blank');
      } else {
        toast.error('Failed to create QR code: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error creating QR code: ' + error.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" placement="center" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold text-gray-800">Invoice Details</h2>
        </ModalHeader>
        <ModalBody>
          {invoice ? (
            <div className="space-y-8">
              {/* Customer Info section remains the same */}
              <div className="bg-gray-50 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Customer Information</h3>
                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Name:</strong> {invoice.customer?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> <Link isExternal href={`mailto:${invoice.customer?.email}`}>{invoice.customer?.email || "N/A"}</Link>
                  </p>
                  <p>
                    <strong>Phone:</strong> {invoice.customer?.phone || "N/A"}
                  </p>
                </div>
              </div>

              {/* Updated Invoice Summary with Discount */}
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700">Invoice Summary</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <strong>Date:</strong> {formatDateTime(new Date(invoice.createdAt))}
                  </p>
                  <p>
                    <strong>Subtotal: </strong>
                    <span className="text-gray-600">
                      {formatPrice(priceBeforeDiscount)}
                    </span>
                  </p>

                  {invoice.discount && (
                    <div className="flex items-center gap-2">
                      <strong>Discount:</strong>
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-sm">
                        {invoice.discount.discountInPercent}% OFF
                      </span>
                      <Tooltip
                        content={`Maximum discount: ${formatPrice(invoice.discount.maxDiscountValue)}`}
                      >
                        <HelpCircle className="w-4 h-4 text-gray-400" />
                      </Tooltip>
                      <span className="text-green-600">
                        -{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <p className="flex items-center">
                      <strong>Final Price: </strong>
                      <span className="text-blue-600 font-medium ml-2">
                        {formatPrice(finalPrice)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700">Products</h3>
                  <div className="mt-4 border-t border-gray-200">
                    {invoice.invoiceDetails?.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {invoice.invoiceDetails.map((detail, index) => (
                          <li key={index} className="py-3 flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <Image
                                src={detail.product?.images?.[0] || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                                alt="Product"
                                className="w-16 h-16 object-cover rounded-lg shadow-sm"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{detail.product?.name || "N/A"}</p>
                                <p className="text-sm text-gray-500">Quantity: {detail.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                {formatPrice(detail.product?.sellingPrice || 0)}
                              </p>
                              <p className="font-semibold text-gray-700">
                                Total:{" "}
                                {formatPrice((detail.quantity * (detail.product?.sellingPrice || 0)))}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 mt-4">No products found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No details available</p>
          )}
        </ModalBody>
        <ModalFooter>
          {
            <Button onClick={() => handleCreateQr(invoice._id)} color="default" auto>
              <QrCode size={16} />
              Pay with QR
            </Button>}
          <Button onClick={() => handleExport(invoice._id)} color="default" auto>
            <Printer size={16} />
            Print Invoice
          </Button>
          <Button onClick={onClose} color="primary" auto>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

InvoiceDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  invoice: PropTypes.object,
};