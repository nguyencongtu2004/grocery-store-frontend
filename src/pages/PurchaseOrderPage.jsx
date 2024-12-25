import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { purchaseServices } from "../requests/purchaseOrder";
import { Link } from "lucide-react";

export default function PurchaseOrderPage() {
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 10;
    const { data, isLoading } = useQuery({
      queryKey: ["purchase-orders", page, itemsPerPage],
      queryFn: ({ signal }) => purchaseServices.getPurchaseOrder({ signal, page, itemsPerPage }),
    });
    const purchaseOrder = data?.data || []

  const converDate = (date)=>{
    const newDate = new Date (date)
    const formattedDate = newDate.toLocaleDateString("en-GB")
    return formattedDate
  }
  console.log(purchaseOrder)
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
      render: (product) => <Link href={product?.purchaseDetail?.images}>{product.images}</Link>,
    },
    {
      key: "name",
      label: "NAME",
      render: (product) => <Link href={product?.purchaseDetail?.images}>{product.name}</Link>,
    },
    {
      key: "sellingPrice",
      label: "SELLINGPRICE",
      render: (product) => <p className="capitalize">{product?.purchaseDetail?.id}</p>,
    },
    {
      key: "totalPrice",
      label: "TOTALPRICE",
      render: (product) => <p className="capitalize">{product?.totalPrice}</p>,
    },
    {
      key: "orderDate",
      label: "ORDERDATE",
      render: (product) => <p className="truncate max-w-xs">{ converDate(product?.orderDate)  }</p>,
    },
    {
      key: "provider",
      label: "PROVIDER",
      render: (product) => <p className="truncate max-w-xs">{product?.provider?.name}</p>,
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
    
  return (
    <>
      <PageTitle
        title="PurchaseOrder"
        description="Manage PurchaseOrder of your store"
        buttonTitle="Add new purchaseOrder"
        onButonClick={() => alert("Add new purchaseOrder")}
        isLoading={false}
      />
      <div>
      <DataTable
        data={purchaseOrder}
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
      {/* <AddProductModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
            /> */}
      </div>
    </>
  );
}