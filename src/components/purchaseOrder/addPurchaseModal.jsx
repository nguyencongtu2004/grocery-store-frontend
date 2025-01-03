import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Tooltip } from "@nextui-org/react";
import { Trash, Image as ImageIcon, ChevronDown, HelpCircle, Calculator } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
import { fetchProviders } from "../../requests/provider";
import { fetchCategories } from "../../requests/category";
import { createPurchaseOrder } from "../../requests/purchaseOrder";
import { toast } from "react-hot-toast";

export default function AddPurchaseModal({ isOpen, onClose, onSuccess }) {
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [productLines, setProductLines] = useState([{
    name: "",
    category: "",
    categoryId: "",
    importPrice: "",
    stockQuantity: "",
    sellingPrice: "",
    expireDate: "",
    images: [],
    profit: 0,
    profitMargin: 0
  }]);
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
        resetForm();
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Không thể tải dữ liệu ban đầu");
      }
    };
    fetchInitialData();
  }, [isOpen]);

  const resetForm = () => {
    setSelectedProvider(null);
    setProductLines([{
      name: "",
      category: "",
      categoryId: "",
      importPrice: "",
      stockQuantity: "",
      sellingPrice: "",
      expireDate: "",
      images: [],
      profit: 0,
      profitMargin: 0
    }]);
    setErrors({});
  };

  const calculateProfit = useCallback((line) => {
    const importPrice = Number(line.importPrice) || 0;
    const sellingPrice = Number(line.sellingPrice) || 0;
    const profit = sellingPrice - importPrice;
    const profitMargin = importPrice ? (profit / importPrice) * 100 : 0;
    return { profit, profitMargin };
  }, []);

  const handleImageUpload = async (productIndex, e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Kích thước file không được vượt quá 5MB");
        return;
      }
      
      try {
        const imageUrl = URL.createObjectURL(file);
        const updatedLines = [...productLines];
        updatedLines[productIndex].images = [imageUrl];
        setProductLines(updatedLines);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Không thể tải lên hình ảnh");
      }
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
      profit: 0,
      profitMargin: 0
    }]);
  };

  const deleteProductLine = (index) => {
    if (productLines.length > 1) {
      setProductLines(productLines.filter((_, i) => i !== index));
      // Cập nhật errors object
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.endsWith(`-${index}`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    } else {
      toast.error("Phải có ít nhất một sản phẩm");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedLines = [...productLines];
    updatedLines[index][field] = value;

    // Tự động tính toán lợi nhuận khi giá thay đổi
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
      newErrors.provider = "Vui lòng chọn nhà cung cấp";
      isValid = false;
    }

    productLines.forEach((line, index) => {
      if (!line.name) {
        newErrors[`name-${index}`] = "Vui lòng nhập tên sản phẩm";
        isValid = false;
      }
      if (!line.categoryId) {
        newErrors[`category-${index}`] = "Vui lòng chọn danh mục";
        isValid = false;
      }
      if (!line.importPrice || Number(line.importPrice) <= 0) {
        newErrors[`importPrice-${index}`] = "Giá nhập phải lớn hơn 0";
        isValid = false;
      }
      if (!line.stockQuantity || Number(line.stockQuantity) <= 0) {
        newErrors[`stockQuantity-${index}`] = "Số lượng phải lớn hơn 0";
        isValid = false;
      }
      if (!line.sellingPrice || Number(line.sellingPrice) <= 0) {
        newErrors[`sellingPrice-${index}`] = "Giá bán phải lớn hơn 0";
        isValid = false;
      }
      if (Number(line.sellingPrice) <= Number(line.importPrice)) {
        newErrors[`sellingPrice-${index}`] = "Giá bán phải cao hơn giá nhập";
        isValid = false;
      }
      if (!line.expireDate) {
        newErrors[`expireDate-${index}`] = "Vui lòng chọn ngày hết hạn";
        isValid = false;
      } else {
        const expireDate = new Date(line.expireDate);
        const today = new Date();
        if (expireDate <= today) {
          newErrors[`expireDate-${index}`] = "Ngày hết hạn phải lớn hơn ngày hiện tại";
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
      toast.error("Vui lòng kiểm tra lại thông tin nhập");
      return;
    }
  
    try {
      setIsSubmitting(true);
      const formData = new FormData(e.target);
      const purchaseData = {
        provider: selectedProvider._id,
        orderDate: formData.get("orderDate"),
        purchaseDetail: productLines.map((line) => ({
          name: line.name.trim(),
          sellingPrice: Number(line.sellingPrice),
          stockQuantity: Number(line.stockQuantity),
          category: {
            _id: line.category._id,
          },
          images: line.images,
          importPrice: Number(line.importPrice),
          expireDate: line.expireDate,
        })),
      };
  
      const response = await createPurchaseOrder({ data: purchaseData });
      if (response.status == "success") {
        toast.success("Tạo phiếu nhập hàng thành công");
        onSuccess?.(); // Trigger success callback
        onClose(); // Close the modal
      } else {
        toast.error("Failed to create purchase order");
      }
    } catch (error) {
      console.error("Error creating purchase order:", error);
      toast.error("Có lỗi xảy ra khi tạo phiếu nhập hàng");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const calculateSuggestedPrice = (index) => {
    const line = productLines[index];
    if (!line.importPrice) {
      toast.error("Vui lòng nhập giá nhập trước");
      return;
    }

    const importPrice = Number(line.importPrice);
    const suggestedPrice = Math.ceil(importPrice * 1.3 / 1000) * 1000; // Markup 30% và làm tròn lên đến nghìn
    handleInputChange(index, "sellingPrice", suggestedPrice.toString());
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
            <h2 className="text-xl font-bold">Thêm phiếu nhập hàng</h2>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Input
                      label="Nhà cung cấp"
                      placeholder="Chọn nhà cung cấp"
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
                label="Ngày nhập hàng"
                type="date"
                variant="bordered"
                required
              />

              {productLines.map((line, productIndex) => (
                <div 
                  key={productIndex} 
                  className="border rounded-lg p-4 space-y-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      Sản phẩm {productIndex + 1}
                      {line.profit > 0 && (
                        <Tooltip content={`Lợi nhuận: ${line.profit.toLocaleString()}đ (${line.profitMargin.toFixed(1)}%)`}>
                          <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            +{line.profitMargin.toFixed(1)}%
                          </span>
                        </Tooltip>
                      )}
                    </h3>
                    {productIndex > 0 && (
                      <Tooltip content="Xóa sản phẩm">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          onPress={() => deleteProductLine(productIndex)}
                        >
                          <Trash size={20} />
                        </Button>
                      </Tooltip>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Tên sản phẩm"
                      placeholder="Nhập tên sản phẩm"
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
                          label="Danh mục"
                          placeholder="Chọn danh mục"
                          variant="bordered"
                          value={categories.find(c => c._id === line.categoryId)?.name || ""}
                          readOnly
                          endContent={<ChevronDown className="text-small" />}
                          color={errors[`category-${productIndex}`] ? "danger" : "default"}
                          errorMessage={errors[`category-${productIndex}`]}
                        />
                      </DropdownTrigger><DropdownMenu
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
                          <DropdownItem key={category._id}>
                            {category.name}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>

                    <div className="flex gap-2 items-end">
                      <Input
                        label="Giá nhập"
                        type="number"
                        placeholder="Nhập giá nhập"
                        variant="bordered"
                        value={line.importPrice}
                        onChange={(e) => handleInputChange(productIndex, "importPrice", e.target.value)}
                        color={errors[`importPrice-${productIndex}`] ? "danger" : "default"}
                        errorMessage={errors[`importPrice-${productIndex}`]}
                        className="w-full"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">₫</span>
                          </div>
                        }
                      />
                    </div>

                    <Input
                      label="Số lượng"
                      type="number"
                      placeholder="Nhập số lượng"
                      variant="bordered"
                      value={line.stockQuantity}
                      onChange={(e) => handleInputChange(productIndex, "stockQuantity", e.target.value)}
                      color={errors[`stockQuantity-${productIndex}`] ? "danger" : "default"}
                      errorMessage={errors[`stockQuantity-${productIndex}`]}
                      className="w-full"
                    />

                    <div className="flex gap-2 items-end">
                      <Input
                        label="Giá bán"
                        type="number"
                        placeholder="Nhập giá bán"
                        variant="bordered"
                        value={line.sellingPrice}
                        onChange={(e) => handleInputChange(productIndex, "sellingPrice", e.target.value)}
                        color={errors[`sellingPrice-${productIndex}`] ? "danger" : "default"}
                        errorMessage={errors[`sellingPrice-${productIndex}`]}
                        className="w-full"
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">₫</span>
                          </div>
                        }
                      />
                      <Tooltip content="Tính giá bán đề xuất (Markup 30%)">
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
                      label="Ngày hết hạn"
                      type="date"
                      variant="bordered"
                      value={line.expireDate}
                      onChange={(e) => handleInputChange(productIndex, "expireDate", e.target.value)}
                      color={errors[`expireDate-${productIndex}`] ? "danger" : "default"}
                      errorMessage={errors[`expireDate-${productIndex}`]}
                      min={new Date().toISOString().split('T')[0]}
                    />

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Hình ảnh sản phẩm
                        <Tooltip content="Kích thước tối đa: 5MB">
                          <HelpCircle className="inline ml-1" size={16} />
                        </Tooltip>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(productIndex, e)}
                        className="hidden"
                        id={`image-${productIndex}`}
                      />
                      <label
                        htmlFor={`image-${productIndex}`}
                        className="cursor-pointer flex items-center justify-center border-2 border-dashed rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {line.images[0] ? (
                          <div className="relative group">
                            <img
                              src={line.images[0]}
                              alt="Product"
                              className="w-32 h-32 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded">
                              <ImageIcon className="w-8 h-8 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-500">Chọn hình ảnh</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                className="mx-auto flex items-center justify-center gap-2 border border-dashed border-blue-400 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                color="default"
                variant="light"
                onClick={addProductLine}
              >
                <span className="text-blue-500 font-bold text-lg">+</span>
                <span className="text-blue-600">Thêm sản phẩm</span>
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button color="primary" type="submit" isLoading={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Thêm phiếu nhập hàng"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}

AddPurchaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
};