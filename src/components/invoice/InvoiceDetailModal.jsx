import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import PropTypes from "prop-types";

export default function InvoiceDetailModal({ isOpen, onClose, invoice }) {
  if (!invoice || !Array.isArray(invoice.invoiceDetails)) return null;

  const { customer, invoiceDetails, createdAt, totalPrice } = invoice;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Invoice Details</h2>
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <div>
              <Input
                label="Customer"
                value={customer?.name || "N/A"}
                readOnly
              />
            </div>
            <div>
              <Input
                label="Created At"
                value={new Date(createdAt).toLocaleString()}
                readOnly
              />
            </div>
            {invoiceDetails.map((detail, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center"
              >
                <Input
                  label="Product"
                  value={detail.product?.name || "Unknown"}
                  readOnly
                />
                <Input
                  label="Quantity"
                  value={detail.quantity}
                  readOnly
                />
                <Input
                  label="Selling Price"
                  value={(detail.product?.sellingPrice || 0).toLocaleString() + " VND"}
                  readOnly
                />
                <Input
                  label="Total Price"
                  value={
                    ((detail.product?.sellingPrice || 0) * detail.quantity).toLocaleString() + " VND"
                  }
                  readOnly
                />
              </div>
            ))}
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <Input
                label="Grand Total"
                value={totalPrice.toLocaleString() + " VND"}
                readOnly
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onClick={onClose}>
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
