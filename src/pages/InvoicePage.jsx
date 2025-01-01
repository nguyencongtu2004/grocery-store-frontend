import { Pagination } from "@nextui-org/react";
import { Eye, Filter } from "lucide-react";
import { ActionCell, DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "../requests/invoice";
import { useEffect, useState } from "react";
import AddInvoiceModal from "../components/invoice/AddInvoiceModal";
import InvoiceDetailModal from "../components/invoice/InvoiceDetailModal";

export default function InvoicePage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ sortBy: "price", order: "asc" });
  const [pendingFilter, setPendingFilter] = useState({ sortBy: "price", order: "asc" });
  const itemsPerPage = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoices", page, itemsPerPage, searchTerm, filter],
    queryFn: ({ signal }) =>
      invoiceService.getInvoices({ signal, page, itemsPerPage, searchTerm, filter }),
  });

  const invoices = data?.data?.data || [];
  console.log(invoices);

  useEffect(() => {
    if (data?.data?.pagination) {
      setTotalPages(data.data.pagination.totalPages);
    }
  }, [data]);

  const columns = [
    {
      key: "index",
      label: "Index",
      render: (_, __, index) => <p className="text-sm text-gray-600">{(page - 1) * itemsPerPage + index + 1}</p>,
      align: "center",
    },
    {
      key: "productImage",
      label: "Product Image",
      render: (invoice) => {
        return invoice?.invoiceDetails?.map((detail, index) => (
          <img
            key={index}
            src={detail.product?.images?.[0] || "/placeholder-image.png"}
            alt="Product"
            className="w-10 h-10 object-cover rounded shadow-sm"
          />
        ));
      },
      align: "center",
    },
    {
      key: "productName",
      label: "Product Name",
      render: (invoice) => {
        return invoice?.invoiceDetails?.map((detail) => detail.product?.name || "").join(", ");
      },
      align: "left",
    },
    {
      key: "productPrice",
      label: "Selling Price",
      render: (invoice) => {
        return (
          invoice?.invoiceDetails?.map((detail, idx) => (
            <p key={idx}>
              {(detail?.product?.sellingPrice || 0).toLocaleString()} VND
            </p>
          )) || <p>N/A</p>
        );
      },
      align: "right",
    },
    {
      key: "quantity",
      label: "Quantity",
      render: (invoice) => {
        return (
          invoice?.invoiceDetails?.map((detail, idx) => (
            <p key={idx}>{detail?.quantity ?? 0}</p>
          )) || <p>N/A</p>
        );
      },
      align: "center",
    },
    {
      key: "totalPrice",
      label: "Total Price",
      render: (invoice) => {
        const totalPrice = invoice.totalPrice;
        return <p className="font-semibold text-blue-600">{(totalPrice || 0).toLocaleString()}</p>;
      },
      align: "center",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (invoice) => {
        const date = new Date(invoice.createdAt);
        return <p className="text-sm text-gray-600">{date.toLocaleString()}</p>;
      },
      align: "center",
    },
    {
      key: "customerName",
      label: "Customer Name",
      render: (invoice) => {
        const customer = invoice.customer;
        return <p className="text-sm text-gray-700">{customer ? customer.name : "Unknown"}</p>;
      },
      align: "center",
    },
    {
      key: "actions",
      label: "Actions",
      render: (invoice) => (
        <div className="flex justify-center">
          <Eye
            size={24}
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedInvoice(invoice);
              setIsDetailModalOpen(true);
            }}
          />
        </div>
      ),
      align: "center",
    },
  ];

  function handleAddInvoice() {
    setIsAddModalOpen(true);
  }

  function handleApplyFilter() {
    setFilter(pendingFilter);
  }

  return (
    <>
      <PageTitle
        title="Invoice Management"
        description="List of invoices and information management."
        buttonTitle="Add New Invoice"
        onButonClick={handleAddInvoice}
        isLoading={false}
      />
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <select
              value={pendingFilter.sortBy}
              onChange={(e) => setPendingFilter({ ...pendingFilter, sortBy: e.target.value })}
              className="border px-4 py-2 rounded">
              <option value="price">Price</option>
              <option value="createdAt">Created At</option>
            </select>
            <select
              value={pendingFilter.order}
              onChange={(e) => setPendingFilter({ ...pendingFilter, order: e.target.value })}
              className="border px-4 py-2 rounded">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <Filter
              size={24}
              className="cursor-pointer text-blue-500 hover:text-blue-700"
              onClick={handleApplyFilter}
            />
          </div>
        </div>
        {isError && <p className="text-red-500">Failed to load invoices. Please try again.</p>}
        <DataTable
          data={invoices}
          columns={columns}
          isLoading={isLoading}
          emptyContent="No invoices found."
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full justify-center mt-4">
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
        <AddInvoiceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
        <InvoiceDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          invoice={selectedInvoice}
        />
      </div>
    </>
  );
}
