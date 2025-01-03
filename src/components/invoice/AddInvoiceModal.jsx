import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { Trash, ChevronDown } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInvoice } from "../../requests/invoice";
import { fetchCustomers } from "../../requests/customer";
import { fetchProduct } from "../../requests/product";
import { fetchCategories } from "../../requests/category";
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
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
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
        const [customersRes, categoriesRes] = await Promise.all([
          fetchCustomers({ page: 1, itemsPerPage: 100 }),
          fetchCategories({}),
        ]);

        const customersList = extractArrayData(customersRes, 'data');
        const categoriesList = extractArrayData(categoriesRes?.data, 'categories');

        setCustomers(customersList);
        setCategories(categoriesList);

        setProductLines([{
          category: "",
          categoryId: "",
          product: "",
          productId: "",
          quantity: 1
        }]);
        setSelectedCustomer(null);
        setProductsByCategory({});
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [isOpen]);

  const fetchProductsByCategory = async (categoryId) => {
    if (!categoryId) return;

    try {
      const response = await fetchProduct({ categoryId });
      const productsList = extractArrayData(response, 'data.data') ||
        extractArrayData(response, 'data') ||
        [];
      console.log(productsList);
      
      setProductsByCategory(prev => ({
        ...prev,
        [categoryId]: productsList
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsByCategory(prev => ({
        ...prev,
        [categoryId]: []
      }));
    }
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

  const handleCategorySelect = async (index, categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return;

    const updatedLines = [...productLines];
    updatedLines[index].category = category.name;
    updatedLines[index].categoryId = category._id;
    updatedLines[index].product = "";
    updatedLines[index].productId = "";
    setProductLines(updatedLines);

    if (!productsByCategory[categoryId]) {
      await fetchProductsByCategory(categoryId);
    }
  };

  const handleProductSelect = (index, productId) => {
    const currentLine = productLines[index];
    const productsForCategory = productsByCategory[currentLine.categoryId] || [];
    const product = productsForCategory.find(p => p._id === productId);

    if (!product) return;

    const updatedLines = [...productLines];
    updatedLines[index].product = product.name;
    updatedLines[index].productId = product._id;
    setProductLines(updatedLines);
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

    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    const invalidLines = productLines.some(line => !line.productId || line.quantity < 1);
    if (invalidLines) {
      alert("Please fill in all product lines correctly");
      return;
    }

    const requestData = {
      customer: selectedCustomer._id,
      invoiceDetails: productLines.map((line) => ({
        product: line.productId,
        quantity: parseInt(line.quantity, 10),
      })),
    };

    console.log(requestData);

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
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    className="w-full justify-between"
                    endContent={<ChevronDown className="text-small" />}
                  >
                    {selectedCustomer ? selectedCustomer.name : "Select customer"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Customer selection"
                  selectionMode="single"
                  className="max-h-64 overflow-y-auto"
                  selectedKeys={selectedCustomer ? [selectedCustomer._id] : []}
                  onSelectionChange={(keys) => {
                    const selectedId = Array.from(keys)[0];
                    setSelectedCustomer(customers.find(c => c._id === selectedId));
                  }}
                >
                  {customers.map((customer) => (
                    <DropdownItem key={customer._id}>
                      {customer.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              {productLines.map((line, index) => (
                <div key={index} className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 items-start">
                  <div className="space-y-4">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full justify-between"
                          endContent={<ChevronDown className="text-small" />}
                        >
                          {line.category || "Select category"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Category selection"
                        selectionMode="single"
                        className="max-h-64 overflow-y-auto"
                        selectedKeys={line.categoryId ? [line.categoryId] : []}
                        onSelectionChange={(keys) => {
                          const selectedId = Array.from(keys)[0];
                          handleCategorySelect(index, selectedId);
                        }}
                      >
                        {categories.map((category) => (
                          <DropdownItem key={category._id}>
                            {category.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>

                    <Dropdown isDisabled={!line.categoryId}>
                      <DropdownTrigger>
                        <Button
                          variant="bordered"
                          className="w-full justify-between"
                          endContent={<ChevronDown className="text-small" />}
                          disabled={!line.categoryId}
                        >
                          {line.product || "Select product"}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Product selection"
                        selectionMode="single"
                        className="max-h-64 overflow-y-auto"
                        selectedKeys={line.productId ? [line.productId] : []}
                        onSelectionChange={(keys) => {
                          const selectedId = Array.from(keys)[0];
                          handleProductSelect(index, selectedId);
                        }}
                      >
                        {(productsByCategory[line.categoryId] || []).map((product) => (
                          <DropdownItem key={product._id}>
                            {product.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  <Input
                    type="number"
                    min="1"
                    value={line.quantity}
                    onChange={(e) => {
                      const updatedLines = [...productLines];
                      updatedLines[index].quantity = e.target.value;
                      setProductLines(updatedLines);
                    }}
                    placeholder="Quantity"
                  />

                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onClick={() => deleteProductLine(index)}
                    disabled={productLines.length === 1}
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