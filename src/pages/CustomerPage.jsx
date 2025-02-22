import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import SearchInput from "../components/SearchInput";
import { fetchCustomers } from "../requests/customer";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddCustomerModal from "../components/customer/AddCustomerModal";
import EditCustomerModal from "../components/customer/EditCustomerModal";
import CustomerDetailModal from "../components/customer/CustomerDetailModal";
import { formatPrice } from "../ultis/ultis";

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
      label: "INDEX",
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
      render: (customer) => <p>{customer.phone || 'Not provided'}</p>,
      align: "center"
    },
    {
      key: "address",
      label: "ADDRESS",
      render: (customer) => <p className="truncate max-w-xs">{customer.address || 'Not provided'}</p>,
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
        <p>{formatPrice(customer.totalSpent || 0)}</p>
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

      <SearchInput
        value={searchKeyword}
        onValueChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="Search customers by phone number..."
        isLoading={isLoading}
      />

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
