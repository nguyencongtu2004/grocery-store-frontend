import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { productService } from "../requests/product";
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
    queryKey: ["products", page, itemsPerPage],
    queryFn: ({ signal }) => productService.getProducts({ signal, page, itemsPerPage }),
  });

  const products = data?.products || [];

  useEffect(() => {
    if (data?.totalItems) {
      setTotalPages(Math.ceil(data.totalItems / itemsPerPage));
    }
  }, [data]);

  const columns = [
    {
      key: "index",
      label: "Index",
      render: (_, __, index) => (page - 1) * itemsPerPage + index + 1,
      align: "center",
    },
    {
      key: "image",
      label: "Image",
      render: (product) => (
        <img
          src={product.image || "/placeholder-image.png"}
          alt={product.name}
          className="w-10 h-10 object-cover rounded"
        />
      ),
      align: "center",
    },
    {
      key: "name",
      label: "Name",
      render: (product) => <p>{product.name}</p>,
    },
    {
      key: "category",
      label: "Category",
      render: (product) => <p>{product.category || "Uncategorized"}</p>,
    },
    {
      key: "price",
      label: "Price",
      render: (product) => <p>{product.price?.toLocaleString()} VND</p>,
      align: "right",
    },
    {
      key: "actions",
      label: "Actions",
      render: (product) => (
        <ActionCell
          onView={() => handleViewProduct(product)}
          onEdit={() => handleEditProduct(product)}
          onDelete={() => handleDeleteProduct(product)}
        />
      ),
      align: "center",
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

  function handleSaveProduct(updatedProduct) {
    console.log("Saving updated product:", updatedProduct);
    setIsEditModalOpen(false);
    refetch(); // Refresh product list
  }

  function handleDeleteProduct(product) {
    if (window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      productService.deleteProduct(product._id).then(() => {
        alert("Product deleted successfully");
        refetch();
      });
    }
  }

  return (
    <div className="space-y-4">
      <PageTitle
        title="Product Management"
        description="Manage your products effectively."
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
        onEdit={() => {
          setIsViewModalOpen(false);
          setIsEditModalOpen(true);
        }}
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
