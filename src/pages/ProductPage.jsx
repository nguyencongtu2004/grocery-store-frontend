import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchProduct, deleteProduct } from "../requests/product";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import ViewProductModal from "../components/product/ViewProductModal";
import EditProductModal from "../components/product/EditProductModal";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["product", page, itemsPerPage],
    queryFn: ({ signal }) => fetchProduct({ signal, page, itemsPerPage }),
  });

  const products = data?.data?.data || [];

  useEffect(() => {
    if (data?.data?.pagination) {
      setTotalPages(data.data.pagination.totalPages);
    }
  }, [data]);

  const columns = [
    {
      key: "_id",
      label: "STT",
      render: (_, index) => (page - 1) * itemsPerPage + index + 1,
      align: "center",
    },
    {
      key: "images",
      label: "IMAGES",
      render: (product) => (
        <img
          src={product.images?.[0] || "/placeholder-image.png"}
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
      key: "quantity",
      label: "QUANTITY",
      render: (product) => <p>{product.quantity || "N/A"}</p>,
      align: "right",
    },
    {
      key: "purchaseDate",
      label: "PURCHASE DATE",
      render: (product) => <p>{product.purchaseDate || "N/A"}</p>,
      align: "center",
    },
    {
      key: "createdDate",
      label: "CREATED DATE",
      render: (product) => <p>{product.createdDate || "N/A"}</p>,
      align: "center",
    },
    {
      key: "expiredDate",
      label: "EXPIRED DATE",
      render: (product) => <p>{product.expiredDate || "N/A"}</p>,
      align: "center",
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (product) => (
        <ActionCell
          onView={() => handleViewProduct(product)}
          onEdit={() => handleEditProduct(product)}
          onDelete={() => handleDeleteProduct(product._id)}
        />
      ),
      align: "left",
    },
  ];
  

  function handleViewProduct(product) {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  }

  function handleEditProduct(product) {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  }

  async function handleDeleteProduct(productId) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        alert("Product deleted successfully");
        refetch();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  }

  function handleSaveProduct(updatedProduct) {
    console.log("Updated product:", updatedProduct);
    setIsEditModalOpen(false);
    refetch(); // Refresh the product list
  }

  return (
    <div className="space-y-4">
      <PageTitle
        title="Product Management"
        description="Manage products of your store"
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
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
