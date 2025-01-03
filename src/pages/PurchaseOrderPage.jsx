import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPurchaseOrders } from "../requests/purchaseOrder";
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
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["purchase-orders", page, itemsPerPage],
    queryFn: ({ signal }) => fetchAllPurchaseOrders({ signal, page, itemsPerPage }),
    onSuccess: (data) => {
      setTotalPages(data?.totalPages || 1); // Dynamically set totalPages
    },
    onError: (error) => {
      toast.error("Failed to fetch purchase orders");
    },
  });

  const purchaseOrder = data?.data || [];
  console.log(purchaseOrder);

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
      label: "INDEX",
      render: (product) => (page - 1) * itemsPerPage + (purchaseOrder.indexOf(product) + 1),
      align: "center"
    },
    {
      key: "productImage",
      label: "PRODUCT IMAGE",
      render: (product) => (
        product?.productDetail?.map((detail, index) => (
          <img
            key={index}
            src={detail?.images?.[0] || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
            alt="Product"
            className="w-10 h-10 object-cover rounded shadow-sm"
          />
        ))
      ),
      align: "center",
    },
    {
      key: "productName",
      label: "PRODUCT NAME",
      render: (product) => (
        <div className="flex flex-col">
          {product?.purchaseDetail?.map((detail, index) => (
            <p key={index} className="text-sm text-gray-700">
              {detail?.name || "Unnamed Product"}
            </p>
          ))}
        </div>
      ),
      align: "left",
    },
    {
      key: "importPrice",
      label: "IMPORTPRICE",
      render: (product) => (
        product?.purchaseDetail?.map((detail, idx) => (
          <p key={idx}>{(detail?.importPrice || 0).toLocaleString()}</p>
        )) || <p>N/A</p>
      ),
      align: "center",
    },
    {
      key: "totalPrice",
      label: "TOTALPRICE",
      render: (product) => product?.totalPrice || "-",
      align: "center",
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
        
        <AddPurchaseModal
          isOpen={isAddModalOpen}
          
          onClose={() =>
            setIsAddModalOpen(false)}

          onSuccess={() => {
            setIsAddModalOpen(false);
            refetch(); // Refresh data after adding a purchase
          }}
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
              setIsEditModalOpen(false);
              refetch(); // Refresh data after updating a purchase
            } catch (error) {
              toast.error("Failed to update purchase order");
            }
          }}
        />

      </div>
    </>
  );
}