import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceService, customerService, productService } from "../../requests/invoice";

export default function AddInvoiceModal({ isOpen, onClose }) {
  const [customer, setCustomer] = useState("");
  const [productLines, setProductLines] = useState([{ product: "", quantity: 1 }]);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: invoiceService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      onClose();
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
    },
  });

  const handleCustomerSearch = async (value) => {
    setCustomer(value);
    try {
      const response = await customerService.searchCustomers({ keyword: value });
      setCustomerSuggestions(response.data);
    } catch (error) {
      console.error("Error searching customers:", error);
      setCustomerSuggestions([]);
    }
  };

  const handleProductSearch = async (index, value) => {
    try {
      const response = await productService.searchProducts({ keyword: value });
      const updatedSuggestions = [...productSuggestions];
      updatedSuggestions[index] = response.data;
      setProductSuggestions(updatedSuggestions);
    } catch (error) {
      console.error("Error searching products:", error);
      const updatedSuggestions = [...productSuggestions];
      updatedSuggestions[index] = [];
      setProductSuggestions(updatedSuggestions);
    }
  };

  const handleAddProductLine = () => {
    setProductLines([...productLines, { product: "", quantity: 1 }]);
  };

  const handleDeleteProductLine = (index) => {
    const updatedLines = productLines.filter((_, i) => i !== index);
    setProductLines(updatedLines);
  };

  const handleSubmit = () => {
    mutate({
      customer,
      invoiceDetails: productLines,
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Add New Invoice</ModalHeader>
            <ModalBody>
              <Input
                label="Customer"
                placeholder="Search customer by name or ID"
                value={customer}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                required
              />
              {customerSuggestions.length > 0 && (
                <ul className="border border-gray-300 rounded p-2 max-h-32 overflow-y-auto">
                  {customerSuggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setCustomer(suggestion._id);
                        setCustomerSuggestions([]);
                      }}
                    >
                      {suggestion.name} ({suggestion.email})
                    </li>
                  ))}
                </ul>
              )}
              {productLines.map((line, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-4 items-center">
                  <Input
                    label="Product"
                    placeholder="Search product by name or ID"
                    value={line.product}
                    onChange={(e) => handleProductSearch(index, e.target.value)}
                    required
                  />
                  {productSuggestions[index] && productSuggestions[index].length > 0 && (
                    <ul className="border border-gray-300 rounded p-2 max-h-32 overflow-y-auto">
                      {productSuggestions[index].map((suggestion) => (
                        <li
                          key={suggestion._id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            const updatedLines = [...productLines];
                            updatedLines[index].product = suggestion._id;
                            setProductLines(updatedLines);
                          }}
                        >
                          {suggestion.name} ({suggestion.price} VND)
                        </li>
                      ))}
                    </ul>
                  )}
                  <Input
                    label="Quantity"
                    placeholder="1"
                    type="number"
                    value={line.quantity}
                    onChange={(e) => {
                      const updatedLines = [...productLines];
                      updatedLines[index].quantity = Number(e.target.value);
                      setProductLines(updatedLines);
                    }}
                    required
                  />
                  <Trash
                    size={24}
                    color="red"
                    className="cursor-pointer"
                    onClick={() => handleDeleteProductLine(index)}
                  />
                </div>
              ))}
              <Button color="default" onPress={handleAddProductLine}>
                Add Product Line
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleSubmit} isLoading={isLoading}>
                Add Invoice
              </Button>
              <Button color="danger" variant="light" onPress={onCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

AddInvoiceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
