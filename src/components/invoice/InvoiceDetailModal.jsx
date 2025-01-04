import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Image, Link } from "@nextui-org/react";
import PropTypes from "prop-types";
import { exportInvoicePDF } from "../../requests/invoice";
import { formatDateTime, formatPrice } from "../../ultis/ultis";

export default function InvoiceDetailModal({ isOpen, onClose, invoice }) {
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
          console.error('Không thể mở tab mới. Hãy kiểm tra cài đặt popup của trình duyệt.');
        }

        // Xóa URL tạm sau một thời gian
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        console.error('Response không phải là file PDF');
      }
    } catch (error) {
      console.error('Lỗi khi xuất PDF:', error);
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
              {/* Customer Info */}
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

              {/* Invoice Summary */}
              <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-blue-700">Invoice Summary</h3>
                <div className="mt-2 space-y-1">
                  <p>
                    <strong>Date:</strong> {formatDateTime(new Date(invoice.createdAt))}
                  </p>
                  <p>
                    <strong>Total Price: </strong>
                    <span className="text-blue-600 font-medium">
                      {formatPrice(invoice.totalPrice || 0)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Product List */}
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
          ) : (
            <p className="text-gray-500 text-center py-6">No details available</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleExport(invoice._id)} color="success" auto>
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
