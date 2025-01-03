import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchAllProducts } from "../requests/product";
import { fetchAllPurchaseOrders } from "../requests/purchaseOrder";
import { Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import ViewProductModal from "../components/product/ViewProductModal";
import EditProductModal from "../components/product/EditProductModal";
import { Search, ArrowUpDown } from 'lucide-react';

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // none, asc, desc
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;

  const { data: productData, isLoading, refetch } = useQuery({
    queryKey: ["product"],
    queryFn: ({ signal }) => fetchAllProducts({ signal }),
  });

  const { data: purchaseOrderData } = useQuery({
    queryKey: ["purchaseOrders"],
    queryFn: ({ signal }) => fetchAllPurchaseOrders({ signal }),
  });

  const rawProducts = productData?.data?.data || [];
  const purchaseOrders = purchaseOrderData?.data || [];

  const processedProducts = useMemo(() => {
    return rawProducts.map((product) => {
      const relatedDetails = purchaseOrders.flatMap(order =>
        order.purchaseDetail?.filter(detail => detail.name === product.name) || []
      );

      const importDate = purchaseOrders.reduce((latest, order) => {
        const orderDate = order.orderDate ? new Date(order.orderDate) : null;
        return !latest || (orderDate && orderDate > new Date(latest)) ? orderDate : latest;
      }, null);

      const expiredDate = relatedDetails.reduce((earliest, detail) => {
        const expireDate = detail.expireDate ? new Date(detail.expireDate) : null;
        return !earliest || (expireDate && expireDate < new Date(earliest)) ? expireDate : earliest;
      }, null);

      return {
        ...product,
        importDate: importDate ? new Date(importDate).toLocaleDateString() : "N/A",
        expiredDate: expiredDate ? new Date(expiredDate).toLocaleDateString() : "N/A",
      };
    });
  }, [rawProducts, purchaseOrders]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = processedProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    if (sortOrder !== "none") {
      result.sort((a, b) => {
        const priceA = Number(a.sellingPrice) || 0;
        const priceB = Number(b.sellingPrice) || 0;
        return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return result;
  }, [processedProducts, searchTerm, sortOrder]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, page, itemsPerPage]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortOrder]);

  const columns = [
    {
      key: "index",
      label: "INDEX",
      render: (index) => (page - 1) * itemsPerPage + (processedProducts.indexOf(index) + 1),
      align: "center",
    },
    {
      key: "images",
      label: "IMAGES",
      render: (product) => (
        <img
          src={product.images?.[0] || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
          alt={product.name}
          className="w-10 h-10 object-cover rounded"
        />
      ),
      align: "center",
    },
    {
      key: "name",
      label: "NAME",
      render: (product) => <p>{product.name}</p>,
    },
    {
      key: "category",
      label: "CATEGORY",
      render: (product) => <p>{product.category?.name || "Uncategorized"}</p>,
    },
    {
      key: "Price",
      label: "PRICE",
      render: (product) => <p>{product.sellingPrice || "N/A"}</p>,
      align: "center",
    },
    {
      key: "stockQuantity",
      label: "STOCK QUANTITY",
      render: (product) => <p>{product.stockQuantity || "N/A"}</p>,
      align: "center",
    },
    {
      key: "importDate",
      label: "IMPORT DATE",
      render: (product) => <p>{product.importDate}</p>,
      align: "center",
    },
    {
      key: "expiredDate",
      label: "EXPIRED DATE",
      render: (product) => <p>{product.expiredDate}</p>,
      align: "center",
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (product) => (
        <ActionCell
          onView={() => handleViewProduct(product)}
          onEdit={() => handleEditProduct(product)}
        />
      ),
      align: "left",
    },
  ];

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  function handleViewProduct(product) {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  }

  function handleEditProduct(product) {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  }

  function handleSaveProduct(updatedProduct) {
    setIsEditModalOpen(false);
    refetch();
  }

  return (
    <div className="space-y-4">
      <PageTitle
        title="Product Management"
        description="Manage products of your store"
        isLoading={isLoading}
      />
      <div className="flex justify-between items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
          />
        </div>
        
        <Dropdown>
          <DropdownTrigger>
            <Button 
              variant="flat" 
              className="capitalize"
              startIcon={<ArrowUpDown className="h-4 w-4" />}
            >
              {sortOrder === "none" ? "Sort by price" : 
               sortOrder === "asc" ? "Price: Low to High" : 
               "Price: High to Low"}
            </Button>
          </DropdownTrigger>
          <DropdownMenu 
            aria-label="Sort options"
            onAction={(key) => setSortOrder(key)}
          >
            <DropdownItem key="none">Sort by price</DropdownItem>
            <DropdownItem key="asc">Price: Low to High</DropdownItem>
            <DropdownItem key="desc">Price: High to Low</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      
      <DataTable
        data={paginatedProducts}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No products found."
        bottomContent={
          totalPages > 1 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            </div>
          )
        }
      />
      
      <ViewProductModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        product={selectedProduct}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}