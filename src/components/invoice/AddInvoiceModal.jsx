import { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { Trash, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "../../requests/invoice";
import { fetchCustomers } from "../../requests/customer";
import { fetchProduct } from "../../requests/product";
import PropTypes from "prop-types";

export default function AddInvoiceModal({ isOpen, onClose }) {
  const [productLines, setProductLines] = useState([{
    category: "",
    categoryId: "",
    product: "",
    productId: "",
    quantity: 1
  }]);

  const [customers, setCustomers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const customerRef = useRef(null);
  const queryClient = useQueryClient();

  const extractArrayData = (response, path) => {
    if (!response) return [];
    if (Array.isArray(response)) return response;

    const pathParts = path.split('.');
    let data = response;

    for (const part of pathParts) {
      data = data?.[part];
      if (Array.isArray(data)) return data;
      if (!data) return [];
    }

    return [];
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isOpen) return;

      try {
        const [customersRes, productsRes] = await Promise.all([
          fetchCustomers({ page: 1, itemsPerPage: 100 }),
          fetchProduct({}),
        ]);

        const customersList = extractArrayData(customersRes, 'data');
        const productsList = extractArrayData(productsRes, 'data.data') ||
          extractArrayData(productsRes, 'data') ||
          [];

        setCustomers(customersList);
        setAllProducts(productsList);

        // Reset form
        setProductLines([{
          category: "",
          categoryId: "",
          product: "",
          productId: "",
          quantity: 1
        }]);
        setSelectedCustomer(null);
        setCustomerQuery("");
        setActiveSearchIndex(null);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (customerRef.current && !customerRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Customer search handling
  useEffect(() => {
    if (customerQuery.trim() === "") {
      setFilteredCustomers([]);
      setSelectedCustomer(null);
      return;
    }

    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(customerQuery.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setShowCustomerDropdown(true);
  }, [customerQuery, customers]);

  // Product search handling
  const handleProductSearch = (index, query) => {
    const updatedLines = [...productLines];
    updatedLines[index].product = query;
    updatedLines[index].productId = "";
    updatedLines[index].category = "";
    updatedLines[index].categoryId = "";
    setProductLines(updatedLines);

    if (query.trim() === "") {
      setFilteredProducts([]);
      return;
    }

    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setActiveSearchIndex(index);
  };

  const handleProductSelect = (index, product) => {
    const updatedLines = [...productLines];
    updatedLines[index] = {
      ...updatedLines[index],
      product: product.name,
      productId: product._id,
      category: product.category?.name || "",
      categoryId: product.category?._id || "",
    };
    setProductLines(updatedLines);
    setFilteredProducts([]);
    setActiveSearchIndex(null);
  };

  const addProductLine = () => {
    setProductLines([
      ...productLines,
      { category: "", categoryId: "", product: "", productId: "", quantity: 1 }
    ]);
  };

  const deleteProductLine = (index) => {
    if (productLines.length > 1) {
      setProductLines(productLines.filter((_, i) => i !== index));
    }
  };

  const { mutate: addInvoice, isLoading: isAdding } = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries(["invoices"]);
      onClose();
      console.log("Invoice added successfully");
    },
    onError: (error) => {
      console.error("Error adding invoice:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const invalidLines = productLines.some(line => !line.productId || line.quantity < 1);
    if (invalidLines) {
      alert("Please fill in all product lines correctly");
      return;
    }

    const requestData = {
      customer: selectedCustomer?._id || null,  // This will be null when no customer is selected
      invoiceDetails: productLines.map((line) => ({
        product: line.productId,
        quantity: parseInt(line.quantity, 10),
      })),
    };

    addInvoice({ data: requestData });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>New Invoice</ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              {/* Customer Search with Autocomplete */}
              <div className="relative" ref={customerRef}>
                <Input
                  startContent={<Search size={18} />}
                  label="Search Customer (Optional)"
                  placeholder="Start typing customer name..."
                  value={customerQuery}
                  onChange={(e) => {
                    setCustomerQuery(e.target.value);
                    if (e.target.value.trim() === "") {
                      setSelectedCustomer(null);
                    }
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  className="w-full"
                />
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer._id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerQuery(customer.name);
                          setShowCustomerDropdown(false);
                        }}
                      >
                        {customer.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Customer Display */}
              {selectedCustomer && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Selected Customer: <span className="font-semibold">{selectedCustomer.name}</span>
                  </p>
                </div>
              )}

              {/* Product Lines */}
              {productLines.map((line, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg relative">
                  <div className="flex-grow">
                    <Input
                      startContent={<Search size={18} />}
                      label="Search Product"
                      placeholder="Start typing product name..."
                      value={line.product}
                      onChange={(e) => handleProductSearch(index, e.target.value)}
                      className="w-full"
                    />
                    {activeSearchIndex === index && filteredProducts.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                        {filteredProducts.map((product) => (
                          <div
                            key={product._id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleProductSelect(index, product)}
                          >
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                              Category: {product.category?.name || 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {line.category && (
                    <div className="text-sm text-gray-500 min-w-[120px]">
                      Category: {line.category}
                    </div>
                  )}

                  <Input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => {
                      const updatedLines = [...productLines];
                      updatedLines[index].quantity = e.target.value;
                      setProductLines(updatedLines);
                    }}
                    label="Qty"
                    className="w-24"
                  />

                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onClick={() => deleteProductLine(index)}
                    disabled={productLines.length === 1}
                    className="mt-5"
                  >
                    <Trash size={20} />
                  </Button>
                </div>
              ))}

              <Button
                variant="bordered"
                onClick={addProductLine}
                className="w-full"
              >
                Add Product Line
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isAdding}>
              Create Invoice
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