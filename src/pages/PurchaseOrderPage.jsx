/* import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { purchaseServices } from "../requests/purchaseOrder";
import AddPurchaseModal from "../components/purchaseOrder/AddPurchaseModal";
import ViewPurchaseModal from "../components/purchaseOrder/ViewPurchaseModal";
import EditPurchaseModal from "../components/purchaseOrder/EditPurchaseModal";

export default function PurchaseOrderPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const itemsPerPage = 10;
  const { data, isLoading } = useQuery({
    queryKey: ["purchase-orders", page, itemsPerPage],
    queryFn: ({ signal }) => purchaseServices.getPurchaseOrder({ signal, page, itemsPerPage }),
  });

  const purchaseOrder = data?.data || [];

  const converDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString("en-GB");
    return formattedDate;
  };

  function handleAddPurchaseOrder() {
    setIsAddModalOpen(true);
  }

  function handleViewPurchaseDetail(purchase) {
    setSelectedPurchase(purchase);
    setIsViewModalOpen(true);
  }

  function handleEditPurchase(purchase) {
    setSelectedPurchase(purchase);
    setIsEditModalOpen(true);
  }

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
      render: (product) => product?.purchaseDetail?.images ? (
        <span className="text-blue-500 hover:underline cursor-pointer">
          {product.images}
        </span>
      ) : "-",
    },
    {
      key: "name",
      label: "NAME",
      render: (product) => product?.name || "-",
    },
    {
      key: "sellingPrice",
      label: "SELLINGPRICE",
      render: (product) => product?.purchaseDetail?.id || "-",
    },
    {
      key: "totalPrice",
      label: "TOTALPRICE",
      render: (product) => product?.totalPrice || "-",
    },
    {
      key: "orderDate",
      label: "ORDERDATE",
      render: (product) => product?.orderDate ? (
        <p className="truncate max-w-xs">{converDate(product.orderDate)}</p>
      ) : "-",
    },
    {
      key: "provider",
      label: "PROVIDER",
      render: (product) => product?.provider?.name || "-",
    },
    {
      key: "actions",
      label: "",
      render: (product) => (
        <ActionCell
          onView={() => handleViewPurchaseDetail(product)}
          onEdit={() => handleEditPurchase(product)}
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
        onButonClick={handleAddPurchaseOrder}
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
        
        < AddPurchaseModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        <ViewPurchaseModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          purchaseOrder={selectedPurchase}
        />

        <EditPurchaseModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          purchaseOrder={selectedPurchase}
          onUpdate={async (updatedData) => {
            try {
              await purchaseServices.updatePurchaseOrder(selectedPurchase._id, updatedData);
              console.log("Purchase order updated successfully");
              setIsEditModalOpen(false);
            } catch (error) {
              console.error(error.message || "Failed to update purchase order");
            }
          }}
        />
        
      </div>
    </>
  );
} */




  export default function PurchaseOrderPage() {
    return (
      <div>
        <h1>Warehouse report</h1>
      </div>
    );
  }