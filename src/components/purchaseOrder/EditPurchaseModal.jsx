import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react";
import { Trash, Image as ImageIcon, ChevronDown, Calculator } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { fetchProviders } from "../../requests/provider";
import { fetchCategories } from "../../requests/category";
import { updatePurchaseOrder } from "../../requests/purchaseOrder";
import { toast } from "react-hot-toast";

export default function EditPurchaseModal({ isOpen, onClose, onSuccess, purchaseOrder }) {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [productLines, setProductLines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isOpen) return;
      try {
        const [providersRes, categoriesRes] = await Promise.all([
          fetchProviders({}),
          fetchCategories({})
        ]);
        setProviders(providersRes?.data || []);
        setCategories(categoriesRes?.data?.categories || []);

        // Initialize form with purchase order data if available
        if (purchaseOrder) {
          setSelectedProvider(purchaseOrder.provider);
          setProductLines(purchaseOrder.purchaseDetail.map(detail => ({
            id: detail._id,
            name: detail.name,
            category: detail.category,
            categoryId: detail.category?._id,
            importPrice: detail.importPrice?.toString(),
            stockQuantity: detail.stockQuantity?.toString(),
            sellingPrice: detail.sellingPrice?.toString(),
            expireDate: detail.expireDate?.split('T')[0],
            images: detail.images || [], // Existing image URLs
            imageFiles: [], // New image files to upload
            deleteImages: [], // Image URLs to delete
            profit: detail.sellingPrice - detail.importPrice,
            profitMargin: ((detail.sellingPrice - detail.importPrice) / detail.importPrice * 100) || 0
          })));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      }
    };
    fetchInitialData();
  }, [isOpen, purchaseOrder]);

  const calculateProfit = useCallback((line) => {
    const importPrice = Number(line.importPrice) || 0;
    const sellingPrice = Number(line.sellingPrice) || 0;
    const profit = sellingPrice - importPrice;
    const profitMargin = importPrice ? (profit / importPrice) * 100 : 0;
    return { profit, profitMargin };
  }, []);

  const handleImageUpload = async (productIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate each file
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File size cannot exceed 5MB");
        return;
      }
    }

    try {
      const imageUrls = files.map(file => URL.createObjectURL(file));
      const updatedLines = [...productLines];
      const currentLine = updatedLines[productIndex];

      // Combine existing images with new ones
      currentLine.images = [...currentLine.images, ...imageUrls];
      currentLine.imageFiles = [...(currentLine.imageFiles || []), ...files];

      setProductLines(updatedLines);
    } catch (error) {
      console.error("Error handling images:", error);
      toast.error("Failed to process images");
    }
  };

  const handleCategorySelect = (index, categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    if (!category) return;

    const updatedLines = [...productLines];
    updatedLines[index].category = { _id: category._id };
    updatedLines[index].categoryId = category._id;
    setProductLines(updatedLines);
    setErrors(prev => ({ ...prev, [`category-${index}`]: null }));
  };

  const addProductLine = () => {
    setProductLines([...productLines, {
      name: "",
      category: "",
      categoryId: "",
      importPrice: "",
      stockQuantity: "",
      sellingPrice: "",
      expireDate: "",
      images: [],
      imageFiles: [],
      deleteImages: [],
      profit: 0,
      profitMargin: 0
    }]);
  };

  const deleteProductLine = (index) => {
    if (productLines.length > 1) {
      const newLines = [...productLines];
      newLines.splice(index, 1);
      setProductLines(newLines);

      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.endsWith(`-${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    } else {
      toast.error("At least one product is required");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedLines = [...productLines];
    updatedLines[index][field] = value;

    if (field === 'importPrice' || field === 'sellingPrice') {
      const { profit, profitMargin } = calculateProfit({
        ...updatedLines[index],
        [field]: value
      });
      updatedLines[index].profit = profit;
      updatedLines[index].profitMargin = profitMargin;
    }

    setProductLines(updatedLines);
    setErrors(prev => ({ ...prev, [`${field}-${index}`]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!selectedProvider) {
      newErrors.provider = "Please select a supplier";
      isValid = false;
    }

    productLines.forEach((line, index) => {
      if (!line.name) {
        newErrors[`name-${index}`] = "Product name is required";
        isValid = false;
      }
      if (!line.categoryId) {
        newErrors[`category-${index}`] = "Category is required";
        isValid = false;
      }
      if (!line.importPrice || Number(line.importPrice) <= 0) {
        newErrors[`importPrice-${index}`] = "Import price must be greater than 0";
        isValid = false;
      }
      if (!line.stockQuantity || Number(line.stockQuantity) <= 0) {
        newErrors[`stockQuantity-${index}`] = "Quantity must be greater than 0";
        isValid = false;
      }
      if (!line.sellingPrice || Number(line.sellingPrice) <= 0) {
        newErrors[`sellingPrice-${index}`] = "Selling price must be greater than 0";
        isValid = false;
      }
      if (Number(line.sellingPrice) <= Number(line.importPrice)) {
        newErrors[`sellingPrice-${index}`] = "Selling price must be higher than import price";
        isValid = false;
      }
      if (!line.expireDate) {
        newErrors[`expireDate-${index}`] = "Expiration date is required";
        isValid = false;
      } else {
        const expireDate = new Date(line.expireDate);
        const today = new Date();
        if (expireDate <= today) {
          newErrors[`expireDate-${index}`] = "Expiration date must be in the future";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please check your input");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();

      // Thêm thông tin cơ bản của phiếu nhập
      formData.append("id", purchaseOrder._id);
      formData.append("provider", selectedProvider._id);
      formData.append("orderDate", e.target.orderDate.value);
      formData.append("totalPurchaseDetail", productLines.length || 0);

      // Thêm chi tiết sản phẩm
      productLines.forEach((line, index) => {
        if (line.id) {
          formData.append(`purchaseDetail[${index}][id]`, line.id);
        }
        formData.append(`purchaseDetail[${index}][name]`, line.name.trim());
        formData.append(`purchaseDetail[${index}][sellingPrice]`, line.sellingPrice);
        formData.append(`purchaseDetail[${index}][stockQuantity]`, line.stockQuantity);
        formData.append(`purchaseDetail[${index}][category][_id]`, line.category._id);
        formData.append(`purchaseDetail[${index}][category][name]`, line.category.name);
        formData.append(`purchaseDetail[${index}][importPrice]`, line.importPrice);
        formData.append(`purchaseDetail[${index}][expireDate]`, line.expireDate);

        // Thêm danh sách ảnh cần xóa nếu có
        if (line.deleteImages && line.deleteImages.length > 0) {
          formData.append(`purchaseDetail[${index}][deleteImages]`, JSON.stringify(line.deleteImages));
        }

        // Thêm files ảnh mới nếu có
        if (line.imageFiles && line.imageFiles.length > 0) {
          line.imageFiles.forEach((file) => {
            formData.append(`purchaseDetail[${index}][files]`, file);
          });
        }
      });

      const response = await updatePurchaseOrder({ id: purchaseOrder._id, formData });
      if (response.status === 201) {
        toast.success("Purchase order updated successfully");
        onSuccess?.();
        onClose();
      } else {
        toast.error("Failed to update purchase order");
      }
    } catch (error) {
      console.error("Error updating purchase order:", error);
      toast.error("Failed to update purchase order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSuggestedPrice = (index) => {
    const line = productLines[index];
    if (!line.importPrice) {
      toast.error("Please enter import price first");
      return;
    }

    const importPrice = Number(line.importPrice);
    const suggestedPrice = Math.ceil(importPrice * 1.3 / 1000) * 1000; // 30% markup rounded to thousands
    handleInputChange(index, "sellingPrice", suggestedPrice.toString());
  };

  const handleDeleteImage = (productIndex, imgIndex) => {
    const updatedLines = [...productLines];
    const currentLine = updatedLines[productIndex];

    // Add image URL to deleteImages array if it's not a blob URL
    const imageUrl = currentLine.images[imgIndex];
    if (!imageUrl.startsWith('blob:')) {
      currentLine.deleteImages = [
        ...(currentLine.deleteImages || []),
        imageUrl
      ];
    }

    // Remove image and file
    currentLine.images = currentLine.images.filter((_, idx) => idx !== imgIndex);
    if (currentLine.imageFiles) {
      currentLine.imageFiles = currentLine.imageFiles.filter((_, idx) => idx !== imgIndex);
    }

    setProductLines(updatedLines);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      placement="center"
      classNames={{
        body: "p-5",
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "border-[#292f46] bg-white dark:bg-[#19172c] rounded-lg",
        closeButton: "hover:bg-white/5 active:bg-white/10"
      }}
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Edit Purchase Order</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Input
                      label="Supplier"
                      placeholder="Select supplier"
                      variant="bordered"
                      value={selectedProvider?.name || ""}
                      readOnly
                      endContent={<ChevronDown className="text-small" />}
                      color={errors.provider ? "danger" : "default"}
                      errorMessage={errors.provider}
                      className="w-full"
                    />
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Provider selection"
                    selectionMode="single"
                    className="max-h-64 overflow-y-auto"
                    selectedKeys={selectedProvider ? [selectedProvider._id] : []}
                    onSelectionChange={(keys) => {
                      const selectedId = Array.from(keys)[0];
                      setSelectedProvider(providers.find(p => p._id === selectedId));
                      setErrors(prev => ({ ...prev, provider: null }));
                    }}
                  >
                    {providers.map((provider) => (
                      <DropdownItem key={provider._id} className="capitalize">
                        {provider.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>

              <Input
                name="orderDate"
                label="Order Date"
                type="date"
                variant="bordered"
                defaultValue={purchaseOrder?.orderDate?.split('T')[0]}
                required
              />

              {productLines.map((line, productIndex) => (
                <div
                  key={line.id || productIndex}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      Product {productIndex + 1}
                      {line.profit > 0 && (
                        <Tooltip content={`Profit: $${line.profit.toLocaleString()} (${line.profitMargin.toFixed(1)}%)`}>
                          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            +{line.profitMargin.toFixed(1)}%
                          </span>
                        </Tooltip>
                      )}
                    </h3>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      onPress={() => deleteProductLine(productIndex)}
                    >
                      <Trash size={20} />
                    </Button>
                  </div>

                  {/* Product form fields - similar to AddPurchaseModal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Product Name"
                      placeholder="Enter product name"
                      variant="bordered"
                      value={line.name}
                      onChange={(e) => handleInputChange(productIndex, "name", e.target.value)}
                      color={errors[`name-${productIndex}`] ? "danger" : "default"}
                      errorMessage={errors[`name-${productIndex}`]}
                      className="w-full"
                    />

                    <Dropdown>
                      <DropdownTrigger>
                        <Input
                          label="Category"
                          placeholder="Select category"
                          variant="bordered"
                          value={categories.find(c => c._id === line.categoryId)?.name || ""}
                          readOnly
                          endContent={<ChevronDown className="text-small" />}
                          color={errors[`category-${productIndex}`] ? "danger" : "default"}
                          errorMessage={errors[`category-${productIndex}`]}
                        />
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Category selection"
                        selectionMode="single"
                        className="max-h-64 overflow-y-auto"
                        selectedKeys={line.categoryId ? [line.categoryId] : []}
                        onSelectionChange={(keys) => {
                          const selectedId = Array.from(keys)[0];
                          handleCategorySelect(productIndex, selectedId);
                        }}
                      >
                        {categories.map((category) => (
                          <DropdownItem key={category._id} className="capitalize">
                            {category.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>

                    <div className="flex gap-2 items-end">
                      <Input
                        label="Import Price ($)"
                        type="number"
                        placeholder="Enter import price"
                        variant="bordered"
                        value={line.importPrice}
                        onChange={(e) => handleInputChange(productIndex, "importPrice", e.target.value)}
                        color={errors[`importPrice-${productIndex}`] ? "danger" : "default"}
                        errorMessage={errors[`importPrice-${productIndex}`]}
                        className="flex-1"
                      />
                      <Tooltip content="Calculate suggested selling price (30% markup)">
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => calculateSuggestedPrice(productIndex)}
                        >
                          <Calculator size={20} />
                        </Button>
                      </Tooltip>
                    </div>

                    <Input
                      label="Stock Quantity"
                      type="number"
                      placeholder="Enter quantity"
                      variant="bordered"
                      value={line.stockQuantity}
                      onChange={(e) => handleInputChange(productIndex, "stockQuantity", e.target.value)}
                      color={errors[`stockQuantity-${productIndex}`] ? "danger" : "default"}
                      errorMessage={errors[`stockQuantity-${productIndex}`]}
                    />

                    <Input
                      label="Selling Price ($)"
                      type="number"
                      placeholder="Enter selling price"
                      variant="bordered"
                      value={line.sellingPrice}
                      onChange={(e) => handleInputChange(productIndex, "sellingPrice", e.target.value)}
                      color={errors[`sellingPrice-${productIndex}`] ? "danger" : "default"}
                      errorMessage={errors[`sellingPrice-${productIndex}`]}
                    />

                    <Input
                      label="Expiration Date"
                      type="date"
                      variant="bordered"
                      value={line.expireDate}
                      onChange={(e) => handleInputChange(productIndex, "expireDate", e.target.value)}
                      color={errors[`expireDate-${productIndex}`] ? "danger" : "default"}
                      errorMessage={errors[`expireDate-${productIndex}`]}
                    />

                    <div className="flex items-center gap-2 col-span-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        id={`image-upload-${productIndex}`}
                        onChange={(e) => handleImageUpload(productIndex, e)}
                      />
                      <Button
                        as="label"
                        htmlFor={`image-upload-${productIndex}`}
                        variant="flat"
                        startContent={<ImageIcon size={20} />}
                        className="cursor-pointer"
                      >
                        {line.images?.length ? 'Add More Images' : 'Upload Images'}
                      </Button>
                      {line.images?.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {line.images.map((image, imgIndex) => (
                            <div key={imgIndex} className="h-20 w-20 relative group">
                              <img
                                src={image}
                                alt={`Product ${productIndex + 1} - Image ${imgIndex + 1}`}
                                className="h-full w-full object-cover rounded"
                              />
                              <Button
                                isIconOnly
                                color="danger"
                                variant="flat"
                                size="sm"
                                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDeleteImage(productIndex, imgIndex)}
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="flat"
                onPress={addProductLine}
                className="w-full"
              >
                Add Another Product
              </Button>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Update Purchase Order
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

EditPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  purchaseOrder: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    provider: PropTypes.object.isRequired,
    orderDate: PropTypes.string.isRequired,
    purchaseDetail: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string.isRequired,
        category: PropTypes.object.isRequired,
        importPrice: PropTypes.number.isRequired,
        stockQuantity: PropTypes.number.isRequired,
        sellingPrice: PropTypes.number.isRequired,
        expireDate: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(PropTypes.string)
      })
    ).isRequired
  }).isRequired
};