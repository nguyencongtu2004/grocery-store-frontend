import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import SearchInput from "../components/SearchInput";
import { fetchProviders } from "../requests/provider";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddProviderModal from "../components/provider/AddProviderModal";
import EditProviderModal from "../components/provider/EditProviderModal";
import ProviderDetailModal from "../components/provider/ProviderDetailModal";
import DeleteConfirmModal from "../components/provider/DeleteConfirmModal";

export default function ProviderPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["provider", page, itemsPerPage, debouncedKeyword],
    queryFn: ({ signal }) => fetchProviders({
      signal,
      page,
      itemsPerPage,
      keyword: debouncedKeyword
    }),
  });

  const providers = data?.data || [];

  useEffect(() => {
    if (data?.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const columns = [
    {
      key: "_id",
      label: "STT",
      render: (provider) => (page - 1) * itemsPerPage + (providers.indexOf(provider) + 1),
      align: "center"
    },
    {
      key: "name",
      label: "NAME",
      render: (provider) => <p className="capitalize">{provider.name || 'N/A'}</p>,
    },
    {
      key: "phoneNumber",
      label: "PHONE",
      render: (provider) => <p>{provider.phoneNumber || 'Chưa cập nhật'}</p>,
      align: "center"
    },
    {
      key: "email",
      label: "EMAIL",
      render: (provider) => <p>{provider.email || 'Chưa cập nhật'}</p>,
    },
    {
      key: "address",
      label: "ADDRESS",
      render: (provider) => <p className="truncate max-w-xs">{provider.address || 'Chưa cập nhật'}</p>,
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (provider) => (
        <ActionCell
          onView={() => handleProviderDetail(provider)}
          onEdit={() => handleEditProvider(provider)}
          onDelete={() => handleDeleteProvider(provider)}
        />
      ),
      align: "center"
    },
  ];

  function handleProviderDetail(provider) {
    setSelectedProvider(provider);
    setIsDetailModalOpen(true);
  }

  function handleEditProvider(provider) {
    setSelectedProvider(provider);
    setIsEditModalOpen(true);
  }

  function handleDeleteProvider(provider) {
    setSelectedProvider(provider);
    setIsDeleteModalOpen(true);
  }

  function handleAddProvider() {
    setIsAddModalOpen(true);
  }

  function handleSearch() {
    setDebouncedKeyword(searchKeyword);
    setPage(1);
  }

  return (
    <>
      <PageTitle
        title="Providers Management"
        description="Manage your providers"
        buttonTitle="Add provider"
        onButonClick={handleAddProvider}
        isLoading={isLoading}
      />

      <SearchInput
        value={searchKeyword}
        onValueChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="Search providers by name or phone number..."
        isLoading={isLoading}
      />

      <DataTable
        columns={columns}
        data={providers}
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

      <AddProviderModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {selectedProvider && (
        <>
          <EditProviderModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            provider={selectedProvider}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            provider={selectedProvider}
          />
          <ProviderDetailModal
            isOpen={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            providerId={selectedProvider._id}
          />
        </>
      )}
    </>
  );
}