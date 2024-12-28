import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchCustomers } from "../requests/customer";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddCustomerModal from "../components/customer/AddCustomerModal";
import EditCustomerModal from "../components/customer/EditCustomerModal";
import CustomerDetailModal from "../components/customer/CustomerDetailModal";
import { Input, Button } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";

export default function CustomerPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["customer", page, itemsPerPage, debouncedKeyword],
    queryFn: ({ signal }) => fetchCustomers({ 
      signal, 
      page, 
      itemsPerPage, 
      keyword: debouncedKeyword 
    }),
  });

  const customers = data?.data || [];

  useEffect(() => {
    if (data?.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  // Debounce search to prevent too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const columns = [
    {
      key: "_id",
      label: "STT",
      render: (customer) => (page - 1) * itemsPerPage + (customers.indexOf(customer) + 1),
      align: "center"
    },
    {
      key: "name",
      label: "NAME",
      render: (customer) => <p className="capitalize">{customer.name || 'N/A'}</p>,
    },
    {
      key: "phone",
      label: "PHONE",
      render: (customer) => <p>{customer.phone || 'Chưa cập nhật'}</p>,
      align: "center"
    },
    {
      key: "address",
      label: "ADDRESS",
      render: (customer) => <p className="truncate max-w-xs">{customer.address || 'Chưa cập nhật'}</p>,
    },
    {
      key: "purchaseCount",
      label: "PURCHASES COUNT",
      render: (customer) => <p>{customer.purchaseCount || 0}</p>,
      align: "center"
    },
    {
      key: "totalSpent",
      label: "TOTAL SPENT",
      render: (customer) => (
        <p>
          {customer.totalSpent
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.totalSpent)
            : '0 VND'
          }
        </p>
      ),
      align: "center"
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (customer) => (
        <ActionCell
          onView={() => handleCustomerDetail(customer)}
          onEdit={() => handleEditCustomer(customer)}
          hideDelete
        />
      ),
      align: "center"
    },
  ];

  function handleCustomerDetail(customer) {
    setSelectedCustomer(customer);
    setIsDetailModalOpen(true);
  }

  function handleEditCustomer(customer) {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  }

  function handleAddCustomer() {
    setIsAddModalOpen(true);
  }

  function handleSearch() {
    setDebouncedKeyword(searchKeyword);
    setPage(1);
  }

  return (
    <>
      <PageTitle
        title="Customers Management"
        description="Manage your customers"
        buttonTitle="Add customer"
        onButonClick={handleAddCustomer}
        isLoading={isLoading}
      />

      <div className="flex gap-4 mb-4">
        <Input
          isClearable
          radius="lg"
          classNames={{
            label: "text-black/50 dark:text-white/90",
            input: [
              "bg-transparent",
              "text-black/90 dark:text-white/90",
              "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "bg-default-200/50",
              "dark:bg-default/60",
              "backdrop-blur-none",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default/60",
              "!cursor-text",
              "border",
            ],
          }}
          placeholder="Search customers by phone number..."
          startContent={
            <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
          }
          value={searchKeyword}
          onValueChange={setSearchKeyword}
          onClear={() => setSearchKeyword("")}
        />
        <Button 
          color="primary" 
          variant="solid" 
          onClick={handleSearch}
          isLoading={isLoading}
        >
          Search
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={isLoading}
        page={page}
        itemsPerPage={itemsPerPage}
      />

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            color="primary"
          />
        </div>
      )}

      <AddCustomerModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {selectedCustomer && (
        <>
          <EditCustomerModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            customer={selectedCustomer}
          />

          <CustomerDetailModal
            isOpen={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            customerId={selectedCustomer._id}
          />
        </>
      )}
    </>
  );
}
