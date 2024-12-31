import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";

export default function AddInvoiceModal({ isOpen, onClose }) {
  const [productLines, setProductLines] = useState([
    { category: "", product: "", quantity: 1 },
  ]);

  const addProductLine = () => {
    setProductLines([...productLines, { category: "", product: "", quantity: 1 }]);
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
    const invoiceData = {
      customer: formData.get("customer"),
      products: productLines,
    };
    console.log("New Invoice Data:", invoiceData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" placement="center">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Add Invoice</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <Input
                autoFocus
                name="customer"
                label="Customer"
                placeholder="John Doe"
                variant="bordered"
                required
              />
              {productLines.map((line, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center"
                >
                  <Input
                    name={`category-${index}`}
                    label="Category"
                    placeholder="Spices"
                    variant="bordered"
                    value={line.category}
                    onChange={(e) =>
                      handleInputChange(index, "category", e.target.value)
                    }
                    required
                  />
                  <Input
                    name={`product-${index}`}
                    label="Product"
                    placeholder="Fish Sauce"
                    variant="bordered"
                    value={line.product}
                    onChange={(e) =>
                      handleInputChange(index, "product", e.target.value)
                    }
                    required
                  />
                  <Input
                    name={`quantity-${index}`}
                    label="Quantity"
                    placeholder="2"
                    variant="bordered"
                    type="number"
                    value={line.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    required
                  />
                  <Trash
                    size={24}
                    onClick={() => deleteProductLine(index)}
                    style={{ cursor: "pointer", color: "red" }}
                  />
                </div>
              ))}
              <Button
                className="mx-auto flex items-center justify-center gap-2 border border-dashed border-blue-400 py-1 rounded-md hover:bg-blue-50"
                color="default"
                variant="light"
                onClick={addProductLine}
              >
                <span className="text-blue-500 font-bold text-sm">+</span>
                <span className="text-blue-600 text-sm">Add Product</span>
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Add Invoice
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

AddInvoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
