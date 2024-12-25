import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchProduct } from "../requests/product";
import { Link, Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddProductModal from "../components/product/AddProductModal";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["product", page, itemsPerPage],
    queryFn: ({ signal }) => fetchProduct({ signal, page, itemsPerPage }),
  });
  
  
  const products = data?.data?.data || [];
  console.log(products);

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
      align: "center"
    },
    {
      key: "images",
      label: "IMAGES",
      render: (product) => <Link href={product.images}>{product.images}</Link>,
    },
    {
      key: "name",
      label: "NAME",
      render: (product) => <Link href={product.images}>{product.name}</Link>,
    },
    {
      key: "category",
      label: "CATEGORY",
      render: (product) => <p className="capitalize">{product.category?.id}</p>,
    },
   
    {
      key: "createdDate",
      label: "CREATEDDATE",
      render: (product) => <p className="truncate max-w-xs"></p>,
    },
    {
      key: "expiredDate",
      label: "EXPRIREDDATE",
      render: (product) => <p className="truncate max-w-xs"></p>,
    },
    {
      key: "actions",
      label: "",
      render: (product) => (
        <ActionCell
          onView={() => handleProductDetail(product)}
          onEdit={() => handleEditProduct(product)}
          onDelete={() => handleDeleteProduct(product._id)}
        />
      ),
      align: "center"
    },
  ];

  function handleProductDetail(product) {
    alert(`View product detail: ${product.name}`);
  }

  function handleEditProduct(product) {
    alert(`Edit product: ${product.name}`);
  }

  function handleDeleteProduct(productId) {
    alert(`Delete product with ID: ${productId}`);
  }

  function handleAddProduct() {
    setIsAddModalOpen(true);
  }
  console.log({products})
  return (
    <div className="space-y-4">
      <PageTitle
        title="Product Management"
        description="Manage products of your store"
        buttonTitle="Add new product"
        onButonClick={handleAddProduct}
        isLoading={isLoading}
      />
      <DataTable
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No products found"
        bottomContent={
          totalPages > 1 ? (
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
          ) : null
        }
      />
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

