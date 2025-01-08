import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import SearchInput from "../components/SearchInput";
import { fetchAllDiscount } from "../requests/discount";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddDiscountModal from "../components/discount/AddDiscountModal";
import EditDiscountModal from "../components/discount/EditDiscountModal";
import DiscountDetailModal from "../components/discount/DiscountDetailModal";
import DeleteConfirmModal from "../components/discount/DeleteConfirmModal";
import { Tag } from 'lucide-react';
import { formatDateTime, formatPrice } from "../ultis/ultis";

export default function DiscountPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const itemsPerPage = 1000;

  const { data, isLoading } = useQuery({
    queryKey: ["discount", page, itemsPerPage, debouncedKeyword],
    queryFn: ({ signal }) => fetchAllDiscount({
      signal,
      page,
      itemsPerPage,
      keyword: debouncedKeyword
    }),
  });

  const discounts = data?.data.data || [];

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
      render: (discount) => (page - 1) * itemsPerPage + (discounts.indexOf(discount) + 1),
      align: "center"
    },
    {
      key: "code",
      label: "CODE",
      render: (discount) => (
        <div className="flex items-center">
          <Tag className="mr-2" size={16} />
          <span>{discount.code}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "NAME",
      render: (discount) => <p className="capitalize">{discount.name}</p>,
    },
    {
      key: "discountInPercent",
      label: "DISCOUNT",
      render: (discount) => (
        <span>{discount.discountInPercent}%</span>
      ),
      align: "center"
    },
    {
      key: "expireDate",
      label: "EXPIRE DATE",
      render: (discount) => (
        <span>{formatDateTime(new Date(discount.expireDate))}</span>
      ),
    },
    {
      key: "maxDiscountValue",
      label: "MAX DISCOUNT",
      render: (discount) => (
        <span>{formatPrice(discount.maxDiscountValue)}</span>
      ),
      align: "right"
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (discount) => (
        <ActionCell
          onView={() => handleDiscountDetail(discount)}
          onEdit={() => handleEditDiscount(discount)}
          onDelete={() => handleDeleteDiscount(discount)}
        />
      ),
      align: "center"
    },
  ];

  function handleDiscountDetail(discount) {
    setSelectedDiscount(discount);
    setIsDetailModalOpen(true);
  }

  function handleEditDiscount(discount) {
    setSelectedDiscount(discount);
    setIsEditModalOpen(true);
  }

  function handleDeleteDiscount(discount) {
    setSelectedDiscount(discount);
    setIsDeleteModalOpen(true);
  }

  function handleAddDiscount() {
    setIsAddModalOpen(true);
  }

  function handleSearch() {
    setDebouncedKeyword(searchKeyword);
    setPage(1);
  }

  return (
    <>
      <PageTitle
        title="Discounts Management"
        description="Manage your discount codes"
        buttonTitle="Add discount"
        onButonClick={handleAddDiscount}
        isLoading={isLoading}
      />

      <SearchInput
        value={searchKeyword}
        onValueChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="Search discounts by code or name..."
        isLoading={isLoading}
      />

      <DataTable
        columns={columns}
        data={discounts}
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

      <AddDiscountModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {selectedDiscount && (
        <>
          <EditDiscountModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            discount={selectedDiscount}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            discount={selectedDiscount}
          />
          <DiscountDetailModal
            isOpen={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            discountId={selectedDiscount._id}
          />
        </>
      )}
    </>
  );
}

