import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Trash, Search } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "../../requests/invoice";
import { fetchCustomers } from "../../requests/customer";
import { fetchProduct } from "../../requests/product";
import PropTypes from "prop-types";
import toast from 'react-hot-toast';
import Column from "../layout/Column";
import { useQuery } from "@tanstack/react-query";
import { fetchAllDiscount } from '../../requests/discount';

export default function AddInvoiceModal({ isOpen, onClose }) {
  const { data: voucherData} = useQuery({
    queryKey: ["discount", 1, 100, ""],
    queryFn: ({ signal }) => fetchAllDiscount({
      signal,
      page: 1,
      itemsPerPage: 100,
      keyword: ""
    }),
  });
  const discounts = voucherData?.data.data || [];
  console.log('discounts', discounts);

  const [productLines, setProductLines] = useState([{
    category: "",
    categoryId: "",
    product: "",
    productId: "",
    quantity: 1
  }]);

  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerQuery, setCustomerQuery] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(null);
  const customerRef = useRef(null);
  const customerSearchTimer = useRef(null);
  const productSearchTimer = useRef(null);
  const queryClient = useQueryClient();
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  // Debounced search functions
  const debouncedCustomerSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setFilteredCustomers([]);
      return;
    }
    try {
      const response = await fetchCustomers({
        keyword: query,
        page: 1,
        itemsPerPage: 10
      });
      const customers = response?.data || [];
      setFilteredCustomers(customers);
    } catch (error) {
      console.error("Error searching customers:", error);
      toast.error("Error searching customers");
    }
  }, []);

  const debouncedProductSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }
    try {
      const response = await fetchProduct({
        keyword: query,
        page: 1,
        itemsPerPage: 10
      });
      const products = response?.data?.data || response?.data || [];
      setFilteredProducts(products);
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Error searching products");
    }
  }, []);

  useEffect(() => {
    const resetForm = () => {
      if (!isOpen) return;

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
      setFilteredCustomers([]);
      setFilteredProducts([]);
      setSelectedDiscount(null);
    };

    resetForm();
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
    if (customerSearchTimer.current) {
      clearTimeout(customerSearchTimer.current);
    }
    customerSearchTimer.current = setTimeout(() => {
      debouncedCustomerSearch(customerQuery);
    }, 300);

    return () => {
      if (customerSearchTimer.current) {
        clearTimeout(customerSearchTimer.current);
      }
    };
  }, [customerQuery, debouncedCustomerSearch]);

  // Product search handling
  const handleProductSearch = (index, query) => {
    const updatedLines = [...productLines];
    updatedLines[index].product = query;
    updatedLines[index].productId = "";
    updatedLines[index].category = "";
    updatedLines[index].categoryId = "";
    setProductLines(updatedLines);
    setActiveSearchIndex(index);

    if (productSearchTimer.current) {
      clearTimeout(productSearchTimer.current);
    }
    productSearchTimer.current = setTimeout(() => {
      debouncedProductSearch(query);
    }, 300);
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
      toast.success("Invoice added successfully");
    },
    onError: (error) => {
      toast.error("Error adding invoice:", error.message);
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
      customer: selectedCustomer?._id || null,
      discountId: selectedDiscount || null,
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
      placement="center"
      scrollBehavior="outside"
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
                  placeholder="Search by customer's name, phone number, or address..."
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
                  <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
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
                        <Column>
                          <div className="font-medium">{customer.name}</div>
                          {customer.phone && <div className="text-sm text-gray-500">
                            Phone: {customer.phone}
                          </div>}
                          {customer.address && <div className="text-sm text-gray-500">
                            Address: {customer.address}
                          </div>}
                        </Column>
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

              {/* Discount Selection */}
              <Select
                label="Select Voucher (Optional)"
                placeholder="Choose a voucher"
                selectedKeys={selectedDiscount ? [selectedDiscount] : []}
                onChange={(e) => {
                  console.log(e.target.value);
                  setSelectedDiscount(e.target.value)}}
                renderValue={(items) => {
                  const selectedVoucher = discounts.find(d => d._id === selectedDiscount);
                  return selectedVoucher ? (
                    <div className="flex flex-col">
                      <span>{selectedVoucher.name} ({selectedVoucher.code})</span>
                    </div>
                  ) : null;
                }}
                className="w-full"
              >
                {discounts.map((discount) => {
                  const isExpired = new Date(discount.expireDate) < new Date();
                  const isUsageLimitReached = discount.usageLimit !== 0 && discount.used >= discount.usageLimit;
                  const isDisabled = isExpired || isUsageLimitReached;
                  
                  return (
                    <SelectItem 
                      key={discount._id} 
                      value={discount._id}
                      isDisabled={isDisabled}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{discount.name} ({discount.code})</span>
                        <span className="text-small text-default-500">
                          {discount.discountInPercent}% off - Min order: {discount.minOrderValue.toLocaleString()}đ
                        </span>
                        {isExpired && (
                          <span className="text-small text-danger">Expired</span>
                        )}
                        {isUsageLimitReached && (
                          <span className="text-small text-danger">Usage limit reached</span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </Select>

              {/* Product Lines */}
              {productLines.map((line, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg relative">
                  <div className="flex-grow">
                    <Input
                      startContent={<Search size={18} />}
                      label="Search Product"
                      placeholder="Search by product name..."
                      value={line.product}
                      onChange={(e) => handleProductSearch(index, e.target.value)}
                      className="w-full"
                    />
                    {activeSearchIndex === index && filteredProducts.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
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