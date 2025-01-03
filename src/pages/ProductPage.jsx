import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchProduct } from "../requests/product";
import { Image, Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import ViewProductModal from "../components/product/ViewProductModal";
import SearchInput from "../components/SearchInput";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["product", page, itemsPerPage, debouncedKeyword],
    queryFn: ({ signal }) => fetchProduct({ signal, page, itemsPerPage, keyword: debouncedKeyword }),
  });

  const products = data?.data?.data || [];

  useEffect(() => {
    if (data?.data?.pagination) {
      setTotalPages(data.data.pagination.totalPages);
    }
  }, [data]);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const columns = [
    {
      key: "_id",
      label: "STT",
      render: (product) => (page - 1) * itemsPerPage + (products.indexOf(product) + 1),
      align: "center",
    },
    {
      key: "images",
      label: "IMAGES",
      render: (product) => (
        <Image
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
      key: "sellingPrice",
      label: "SELLING PRICE",
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
      render: (product) => <p>{new Date(product.importDate).toLocaleDateString() || "N/A"}</p>,
      align: "center",
    },
    {
      key: "expireDate",
      label: "EXPIRE DATE",
      render: (product) => <p>{new Date(product.expireDate).toLocaleDateString() || "N/A"}</p>,
      align: "center",
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (product) => (
        <ActionCell
          onView={() => handleViewProduct(product)}
        />
      ),
      align: "left",
    },
  ];

  function handleViewProduct(product) {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  }

  function handleSearch() {
    setDebouncedKeyword(searchKeyword);
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <PageTitle
        title="Product Management"
        description="Manage products of your store"
        isLoading={isLoading}
      />
      <SearchInput
        value={searchKeyword}
        onValueChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="Search products by name..."
        isLoading={isLoading}
      />
      <DataTable
        data={products}
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
                onChange={(newPage) => setPage(newPage)}
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
    </div>
  );
}
