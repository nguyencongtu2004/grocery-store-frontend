import { Image, Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPurchaseOrders, importPurchaseOrderExcel } from "../requests/purchaseOrder";
import AddPurchaseModal from "../components/purchaseOrder/AddPurchaseModal";
import ViewPurchaseModal from "../components/purchaseOrder/ViewPurchaseModal";
import EditPurchaseModal from "../components/purchaseOrder/EditPurchaseModal";
import { toast } from "react-hot-toast";
import { formatDateTime, formatPrice } from "../ultis/ultis";

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
      toast.error("Failed to fetch purchase orders", error);
    },
  });

  const purchaseOrder = data?.data || [];

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

  function handleImportPurchaseOrder() {
    const sendExcelFile = async (file) => {
      const formData = new FormData();
      formData.append('files', file);
      try {
        const response = await importPurchaseOrderExcel({ formData });
        if (response.status === 200) {
          toast.success('Import purchase order successful');
          refetch(); // Refresh the purchase order list
        }
      } catch (error) {
        toast.error('Import failed: ' + error.message);
      }
    };

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        sendExcelFile(file);
      }
    };
    input.click();
  }

  const columns = [
    {
      key: "_id",
      label: "INDEX",
      render: (product) => (page - 1) * itemsPerPage + (purchaseOrder.indexOf(product) + 1),
      align: "center"
    },
    // {
    //   key: "productImage",
    //   label: "IMAGE",
    //   render: (product) => (
    //     product?.purchaseDetail?.map((detail, index) => (
    //       <Image
    //         key={index}
    //         src={detail?.images?.[0] || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
    //         alt="Product"
    //         className="w-10 h-10 object-cover rounded shadow-sm"
    //       />
    //     ))
    //   ),
    //   align: "center",
    // },
    // {
    //   key: "productName",
    //   label: "PRODUCT NAME",
    //   render: (product) => (
    //     <div className="flex flex-col">
    //       {product?.purchaseDetail?.map((detail, index) => (
    //         <p key={index} className="text-sm text-gray-700">
    //           {detail?.name || "Unnamed Product"}
    //         </p>
    //       ))}
    //     </div>
    //   ),
    //   align: "left",
    // },
    {
      key: "importPrice",
      label: "IMPORT PRICE",
      render: (product) => (
        product?.purchaseDetail?.map((detail, idx) => (
          <p key={idx}>{detail?.importPrice ? formatPrice(detail?.importPrice) : "N/A"}</p>
        )) || <p>N/A</p>
      ),
      align: "center",
    },
    // {
    //   key: "expireDate",
    //   label: "EXPIRE DATE",
    //   render: (product) => (
    //     product?.purchaseDetail?.map((detail, idx) => (
    //       <p key={idx}>{detail?.expireDate ? formatDateTime(new Date(detail.expireDate)) : 'N/A'}</p>
    //     )) || <p>N/A</p>
    //   ),
    //   align: "center",
    // },
    {
      key: "totalPrice",
      label: "TOTAL PRICE",
      render: (product) => product?.totalPrice ? formatPrice(product?.totalPrice) : "N/A",
      align: "center",
    },
    {
      key: "orderDate",
      label: "ORDER DATE",
      render: (product) => product?.orderDate ? (
        <p className="truncate max-w-xs">{product.orderDate ? formatDateTime(product.orderDate) : "N/A"}</p>
      ) : "-",
    },
    {
      key: "provider",
      label: "PROVIDER",
      render: (product) => product?.provider?.name || "-",
    },
    {
      key: "actions",
      label: "ACTIONS",
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
        title="Purchase Order"
        description="Manage purchase order of your store"
        buttonTitle="Add new purchase order"
        onButonClick={handleAddPurchaseOrder}
        secondButtonTitle="Import with Excel"
        onSecondButonClick={handleImportPurchaseOrder}
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
          onSuccess={() => {
            setIsEditModalOpen(false);
            refetch(); // Refresh data after editing a purchase
          }}
        />
      </div>
    </>
  );
}