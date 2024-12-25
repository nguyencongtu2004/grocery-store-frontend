import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useQuery } from "@tanstack/react-query";
import { invoiceService } from "../requests/invoice";
import { useEffect, useState } from "react";
import AddInvoiceModal from "../components/invoice/AddInvoiceModal";
import { Search, Filter } from 'lucide-react'; // Import icons from Lucide

export default function InvoicePage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState(null);
  const [searchPrice, setSearchPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // State to toggle filter panel visibility

  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page, itemsPerPage, priceFilter, searchPrice, searchQuery],
    queryFn: ({ signal }) =>
      invoiceService.getInvoices({
        signal,
        page,
        itemsPerPage,
        priceFilter,
        searchPrice,
        searchQuery,
      }),
  });

  const invoices = data?.data?.data || [];

  useEffect(() => {
    if (data?.data?.pagination) {
      setTotalPages(data.data.pagination.totalPages);
    }
  }, [data]);

  // Flatten the invoices by creating a row for each product while keeping the invoice data common
const flattenedInvoices = invoices.flatMap((invoice) =>
  invoice?.invoiceDetails?.map((detail) => ({
    ...invoice,  // Keep the original invoice data
    product: detail?.product,
    quantity: detail?.quantity,
    totalPrice: detail?.product?.sellingPrice * detail?.quantity,
  }))
);

const columns = [
  {
    key: "index",
    label: "ID",
    render: (invoice, index) => <p>{index + 1}</p>,
    align: "center",
  },
  {
    key: "image",
    label: "Hình ảnh",
    render: (invoice) =>
      invoice.product?.images?.[0] ? (
        <img
          src={invoice.product.images[0]}
          alt="Product"
          className="w-10 h-10 object-cover"
        />
      ) : (
        <p>No Image</p>
      ),
    align: "center",
  },
  {
    key: "name",
    label: "Tên sản phẩm",
    render: (invoice) => <p>{invoice.product?.name || "Unknown Product"}</p>,
  },
  {
    key: "price",
    label: "Giá",
    render: (invoice) => <p>{invoice.product?.sellingPrice.toLocaleString()} VND</p>,
    align: "center",
  },
  {
    key: "quantity",
    label: "Số lượng",
    render: (invoice) => <p>{invoice.quantity}</p>,
    align: "center",
  },
  {
    key: "totalAmount",
    label: "Tổng tiền sản phẩm",
    render: (invoice) => <p>{(invoice.totalPrice || 0).toLocaleString()} VND</p>,
    align: "center",
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    render: (invoice) => <p>{new Date(invoice.createdAt).toLocaleString()}</p>,
    align: "center",
  },
  {
    key: "customer",
    label: "Khách hàng",
    render: (invoice) => <p>{invoice.customer?.name || "Unknown"}</p>,
    align: "center",
  },
  {
    key: "actions",
    label: "Thao tác",
    render: (invoice) => (
      <ActionCell
        onView={() => alert(`Chi tiết hóa đơn ID: ${invoice._id}`)}
      />
    ),
    align: "center",
  },
];

// Render DataTable with the flattenedInvoices
<DataTable
  columns={columns}
  data={flattenedInvoices}
  isLoading={isLoading}
/>


  function handleAddInvoice() {
    setIsAddModalOpen(true);
  }

  function handlePriceFilterChange(order) {
    setPriceFilter(order);
  }

  function handlePriceSearchChange(e) {
    setSearchPrice(e.target.value);
  }

  function handleSearchQueryChange(e) {
    setSearchQuery(e.target.value);
  }

  function toggleFilterPanel() {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  }

  return (
    <>
      <PageTitle
        title="Danh sách hóa đơn"
        description="Quản lý hóa đơn của cửa hàng"
        buttonTitle="Thêm hóa đơn"
        onButonClick={handleAddInvoice}
        isLoading={isLoading}
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm hóa đơn..."
            className="px-4 py-2 border rounded w-full"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
          <input
            type="number"
            placeholder="Tìm kiếm theo giá"
            className="px-4 py-2 border rounded"
            value={searchPrice}
            onChange={handlePriceSearchChange}
          />
          <button
            onClick={toggleFilterPanel}
            className="flex items-center justify-center bg-gray-200 p-2 rounded"
          >
            <Filter /> {/* Filter Icon from Lucide */}
          </button>
        </div>

        {/* Filter Panel (Toggle visibility) */}
        {isFilterPanelOpen && (
          <div className="p-4 border bg-gray-100 rounded shadow-md flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <label className="text-sm">Lọc giá: </label>
              <select
                onChange={(e) => handlePriceFilterChange(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Chọn bộ lọc giá</option>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
            <button
              onClick={toggleFilterPanel}
              className="bg-red-500 text-white p-2 rounded"
            >
              Áp dụng
            </button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={flattenedInvoices}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <div className="mt-4 flex justify-end">
        <Pagination
          page={page}
          total={totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      {/* Add Invoice Modal */}
      {isAddModalOpen && (
        <AddInvoiceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </>
  );
}
