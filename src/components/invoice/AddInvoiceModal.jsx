import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Trash } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { invoiceService, customerService, productService } from "../../requests/invoice";
import { categoryService } from "../../requests/category";

export default function AddInvoiceModal({ isOpen, onClose }) {
  const [productLines, setProductLines] = useState([{ category: "", product: "", quantity: 1 }]);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([[]]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);

  const { mutate, isLoading } = useMutation({
    mutationFn: invoiceService.createInvoice,
    onSuccess: () => {
      alert("Invoice created successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating invoice:", error);
      alert("Failed to create invoice. Please try again.");
    },
  });

  const fetchCustomerSuggestions = async (value) => {
    try {
      const response = await customerService.searchCustomers(value);
      setCustomerSuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching customer suggestions:", error);
      setCustomerSuggestions([]);
    }
  };  

  const fetchCategorySuggestions = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategorySuggestions(response.data || []);
    } catch (error) {
      console.error("Error fetching category suggestions:", error);
      setCategorySuggestions([]);
    }
  };

  const fetchProductSuggestions = async (index, categoryId, value) => {
    if (!categoryId) return;
    try {
      const response = await productService.searchProducts(value, categoryId);
      const updatedSuggestions = [...productSuggestions];
      updatedSuggestions[index] = Array.isArray(response.data) ? response.data : [];
      setProductSuggestions(updatedSuggestions);
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
      const updatedSuggestions = [...productSuggestions];
      updatedSuggestions[index] = [];
      setProductSuggestions(updatedSuggestions);
    }
  };

  const addProductLine = () => {
    setProductLines([...productLines, { category: "", product: "", quantity: 1 }]);
    setProductSuggestions([...productSuggestions, []]);
  };

  const deleteProductLine = (index) => {
    const updatedLines = productLines.filter((_, i) => i !== index);
    const updatedSuggestions = productSuggestions.filter((_, i) => i !== index);
    setProductLines(updatedLines);
    setProductSuggestions(updatedSuggestions);
  };

  const handleInputChange = (index, field, value) => {
    const updatedLines = [...productLines];
    updatedLines[index][field] = value;
    setProductLines(updatedLines);
  };

  const validateInvoiceData = (data) => {
    if (!data.customer) return false;
    for (const detail of data.invoiceDetails) {
      if (!detail.category || !detail.product || detail.quantity <= 0) return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoiceData = {
      customer: e.target.customer.value,
      invoiceDetails: productLines.map((line) => ({
        category: line.category,
        product: line.product,
        quantity: parseInt(line.quantity, 10),
      })),
    };

    if (!validateInvoiceData(invoiceData)) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    mutate(invoiceData);
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
                placeholder="Search customer by name"
                variant="bordered"
                onChange={(e) => fetchCustomerSuggestions(e.target.value)}
                list="customer-suggestions"
                required
              />
              <datalist id="customer-suggestions">
                {customerSuggestions.map((suggestion) => (
                  <option key={suggestion._id} value={suggestion.name} />
                ))}
              </datalist>
              {productLines.map((line, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center">
                  <Input
                    name={`category-${index}`}
                    label="Category"
                    placeholder="Select category"
                    variant="bordered"
                    value={line.category}
                    onFocus={fetchCategorySuggestions}
                    onChange={(e) => handleInputChange(index, "category", e.target.value)}
                    list={`category-suggestions-${index}`}
                    required
                  />
                  <datalist id={`category-suggestions-${index}`}>
                    {categorySuggestions.map((category) => (
                      <option key={category._id} value={category.name} />
                    ))}
                  </datalist>
                  <Input
                    name={`product-${index}`}
                    label="Product"
                    placeholder="Search product"
                    variant="bordered"
                    value={line.product}
                    onChange={(e) => fetchProductSuggestions(index, line.category, e.target.value)}
                    list={`product-suggestions-${index}`}
                    required
                  />
                  <datalist id={`product-suggestions-${index}`}>
                    {Array.isArray(productSuggestions[index]) &&
                      productSuggestions[index].map((product) => (
                        <option key={product._id} value={product.name} />
                      ))}
                  </datalist>
                  <Input
                    name={`quantity-${index}`}
                    label="Quantity"
                    placeholder="2"
                    variant="bordered"
                    type="number"
                    value={line.quantity}
                    onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
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
            <Button color="primary" type="submit" isLoading={isLoading}>
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
