import { useState, useMemo, useEffect } from "react";
import { Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Image } from "@nextui-org/react";
import { Eye, Search, ArrowUpDown, Printer, X, QrCode } from "lucide-react";
import { DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { useQuery } from "@tanstack/react-query";
import { createQr, exportInvoicePDF, fetchInvoices } from "../requests/invoice";
import AddInvoiceModal from "../components/invoice/AddInvoiceModal";
import InvoiceDetailModal from "../components/invoice/InvoiceDetailModal";
import Row from "../components/layout/Row";
import { formatDateTime, formatPrice } from "../ultis/ultis";
import toast from "react-hot-toast";

export default function InvoicePage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [payUrl, setPayUrl] = useState("");
  const [showPaymentIframe, setShowPaymentIframe] = useState(false);
  const [filters, setFilters] = useState({
    sortBy: "createdAt",
    order: "desc"  // Changed to make newest first as default
  });
  const itemsPerPage = 10;

  // Fetch all data at once
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invoices"],
    queryFn: ({ signal }) => fetchInvoices({ signal }),
    keepPreviousData: true,
  });

  // Process data from API
  const processedInvoices = useMemo(() => {
    const rawInvoices = data?.data?.data || [];
    return rawInvoices.map((invoice) => ({
      ...invoice,
      searchableId: invoice._id?.toString().toLowerCase() || ""
    }));
  }, [data]);

  // Filter and sort invoices
  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...processedInvoices];

    // Apply search filter for id and customer name
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(invoice =>
        invoice.searchableId.includes(searchLower) ||
        invoice.customer?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    result.sort((a, b) => {
      let compareValueA, compareValueB;

      switch (filters.sortBy) {
        case "totalPrice":
          compareValueA = a.totalPrice || 0;
          compareValueB = b.totalPrice || 0;
          break;
        case "createdAt":
          compareValueA = new Date(a.createdAt).getTime();
          compareValueB = new Date(b.createdAt).getTime();
          break;
        default:
          compareValueA = a[filters.sortBy];
          compareValueB = b[filters.sortBy];
      }

      if (filters.order === "asc") {
        return compareValueA - compareValueB;
      } else {
        return compareValueB - compareValueA;
      }
    });

    return result;
  }, [processedInvoices, searchTerm, filters]);

  // Pagination
  const paginatedInvoices = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredAndSortedInvoices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedInvoices, page]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  async function handleExport(id) {
    try {
      const response = await exportInvoicePDF({ id });

      if (response.headers['content-type']?.includes('application/pdf')) {
        // Create Blob from data
        const blob = new Blob([response.data], { type: 'application/pdf' });

        // Create URL from Blob
        const url = URL.createObjectURL(blob);

        // Open PDF in new tab
        const newWindow = window.open(url, '_blank');

        if (newWindow) {
          // Wait for PDF to load
          newWindow.onload = () => {
            // Call print dialog
            newWindow.print();
          };
        } else {
          toast.error('Cannot open new tab. Please check browser popup settings.');
        }

        // Clean up temporary URL
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        toast.error('Response is not a PDF file');
      }
    } catch (error) {
      toast.error('Error exporting PDF:', error);
    }
  }

  async function handleCreateQr(invoice) {
    if (invoice?.paymentData) {
      // window.open(invoice.paymentData.payUrl, '_blank');
      setPayUrl(invoice.paymentData.payUrl);
      return;
    }
    try {
      const response = await createQr({ id: invoice._id });
      if (response.status === 200) {
        toast.success('Create QR code successfully');
        const qrCodeUrl = response.data.data.payUrl;
        setPayUrl(qrCodeUrl);
        // window.open(qrCodeUrl, '_blank');
      } else {
        toast.error('Failed to create QR code: ' + response.data.message);
      }
    } catch (error) {
      toast.error('Error creating QR code: ' + error.message);
    }
  }

  const columns = [
    {
      key: "index",
      label: "INDEX",
      render: (index) => (page - 1) * itemsPerPage + (processedInvoices.indexOf(index) + 1),
      align: "center",
    },
    // {
    //   key: "productImage",
    //   label: "PRODUCT IMAGE",
    //   render: (invoice) => (
    //     invoice?.invoiceDetails?.map((detail, index) => (
    //       <Image
    //         key={index}
    //         src={detail.product?.images?.[0] || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
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
    //   render: (invoice) => (
    //     <div className="flex flex-col">
    //       {invoice?.invoiceDetails?.map((detail, index) => (
    //         <p key={index} className="text-sm text-gray-700">
    //           {detail.product?.name || "Unnamed Product"}
    //         </p>
    //       ))}
    //     </div>
    //   ),
    //   align: "left",
    // },
    // {
    //   key: "productPrice",
    //   label: "SELLING PRICE",
    //   render: (invoice) => (
    //     invoice?.invoiceDetails?.map((detail, idx) => (
    //       <p key={idx}>{(detail?.product?.sellingPrice || 0).toLocaleString()}</p>
    //     )) || <p>N/A</p>
    //   ),
    //   align: "right",
    // },
    // {
    //   key: "quantity",
    //   label: "QUANTITY",
    //   render: (invoice) => (
    //     invoice?.invoiceDetails?.map((detail, idx) => (
    //       <p key={idx}>{detail?.quantity ?? 0}</p>
    //     )) || <p>N/A</p>
    //   ),
    //   align: "center",
    // },
    {
      key: "totalPrice",
      label: "TOTAL PRICE",
      render: (invoice) => (
        <p className="font-semibold text-blue-600">{formatPrice(invoice.totalPrice || 0)}</p>
      ),
      align: "center",
    },
    {
      key: "createdAt",
      label: "CREATE AT",
      render: (invoice) => (
        <p className="text-sm text-gray-600">{formatDateTime(new Date(invoice.createdAt))}</p>
      ),
      align: "center",
    },
    {
      key: "customerName",
      label: "CUSTOMER NAME",
      render: (invoice) => (
        <p className="text-sm text-gray-700">{invoice.customer?.name || "Unknown"}</p>
      ),
      align: "center",
    },
    {
      key: "actions",
      label: "ACTION",
      render: (invoice) => (
        <Row className="gap-2 justify-center">
          <Eye
            size={24}
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedInvoice(invoice);
              setIsDetailModalOpen(true);
            }}
          />
          <Printer
            size={24}
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedInvoice(invoice);
              handleExport(invoice._id);
            }}
          />
          <QrCode
            size={24}
            className="cursor-pointer text-blue-500 hover:text-blue-700"
            onClick={() => {
              setSelectedInvoice(invoice);
              handleCreateQr(invoice);
            }}
          />
        </Row>
      ),
      align: "center",
    },
  ];

  useEffect(() => {
    if (payUrl) {
      setTimeout(() => {
        setShowPaymentIframe(true);
      }, 100);
    }
  }, [payUrl]);

  const handleClosePayment = () => {
    setShowPaymentIframe(false);
    setTimeout(() => {
      setPayUrl("");
    }, 300); // Đợi animation kết thúc
  };

  return (
    <Row className="relative">
      <div className={`space-y-4 transition-all duration-300 ${showPaymentIframe ? 'w-2/3' : 'w-full'}`}>
        <PageTitle
          title="Invoice Management"
          description="List of invoices and information management."
          buttonTitle="Add New Invoice"
          onButonClick={() => {
            setIsAddModalOpen(true);
          }}
          isLoading={isLoading}
        />

        <div className="flex justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by Invoice ID or Customer Name..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
            />
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="flat"
                className="capitalize"
                startIcon={<ArrowUpDown className="h-4 w-4" />}
              >
                {filters.sortBy === "totalPrice"
                  ? (filters.order === "asc" ? "Price: Low to High" : "Price: High to Low")
                  : (filters.order === "asc" ? "Date: Oldest First" : "Date: Newest First")
                }
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort options"
              onAction={(key) => {
                const [sortBy, order] = key.split("-");
                handleFilterChange({ sortBy, order });
              }}
              selectedKeys={[`${filters.sortBy}-${filters.order}`]}
            >
              <DropdownItem key="totalPrice-asc">Price: Low to High</DropdownItem>
              <DropdownItem key="totalPrice-desc">Price: High to Low</DropdownItem>
              <DropdownItem key="createdAt-asc">Date: Oldest First</DropdownItem>
              <DropdownItem key="createdAt-desc">Date: Newest First</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {isError && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">
            Failed to load invoices. Please try again.
          </div>
        )}

        <DataTable
          data={paginatedInvoices}
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
                  onChange={setPage}
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
          onClose={(payUrl) => {
            setIsDetailModalOpen(false);
            if (payUrl)
              setPayUrl(payUrl);
          }}
          invoice={selectedInvoice}
        />
      </div>
      
      {payUrl && (
        <div
          className={`fixed top-0 right-0 h-screen bg-white shadow-lg transition-all duration-300 ease-in-out z-50 ${showPaymentIframe ? 'w-1/3 opacity-100' : 'w-0 opacity-0'
            }`}
        >
          {/* Improved close button styling and positioning */}
          <div className="relative h-full">
            <button
              onClick={handleClosePayment}
              className="absolute -left-12 top-4 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-100 flex items-center justify-center transition-all duration-200 z-50"
              aria-label="Close payment window"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="w-full h-full overflow-hidden">
              <iframe
                src={payUrl}
                title="Payment"
                className={`w-full h-full border-none transition-opacity duration-300 ${showPaymentIframe ? 'opacity-100' : 'opacity-0'
                  }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add overlay when payment iframe is shown */}
      {showPaymentIframe && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={handleClosePayment}
        />
      )}
    </Row>
  );
}