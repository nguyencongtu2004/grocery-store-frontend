import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchCustomers } from "../requests/customer";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddCustomerModal from "../components/customer/AddCustomerModal";
import EditCustomerModal from "../components/customer/EditCustomerModal";
import CustomerDetailModal from "../components/customer/CustomerDetailModal";

export default function CustomerPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["customer", page, itemsPerPage],
    queryFn: ({ signal }) => fetchCustomers({ signal, page, itemsPerPage }),
  });

  const customers = data?.data || [];

  useEffect(() => {
    if (data?.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

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

  return (
    <>
      <PageTitle
        title="Customers Management"
        description="Manage your customers"
        buttonTitle="Add customer"
        onButonClick={handleAddCustomer}
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

