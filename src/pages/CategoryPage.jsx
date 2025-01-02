import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import SearchInput from "../components/SearchInput";
import { fetchCategories } from "../requests/category";
import { Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddCategoryModal from "../components/category/AddCategoryModal";
import EditCategoryModal from "../components/category/EditCategoryModal";
import CategoryDetailModal from "../components/category/CategoryDetailModal";
import DeleteConfirmModal from "../components/category/DeleteConfirmModal";

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["category", page, itemsPerPage, debouncedKeyword],
    queryFn: ({ signal }) => fetchCategories({
      signal,
      page,
      itemsPerPage,
      keyword: debouncedKeyword
    }),
  });

  const categories = data?.data.categories || [];
  console.log('categories', categories);

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
      render: (category) => (page - 1) * itemsPerPage + (categories.indexOf(category) + 1),
      align: "center"
    },
    {
      key: "name",
      label: "NAME",
      render: (category) => <p className="capitalize">{category.name || 'N/A'}</p>,
    },
    {
      key: "description",
      label: "DESCRIPTION",
      render: (category) => <p className="truncate max-w-xs">{category.description || 'N/A'}</p>,
    },
    {
      key: "actions",
      label: "ACTIONS",
      render: (category) => (
        <ActionCell
          // hide view detail
          // onView={() => handleCategoryDetail(category)}
          onEdit={() => handleEditCategory(category)}
          onDelete={() => handleDeleteCategory(category)}
        />
      ),
      align: "center"
    },
  ];

  // function handleCategoryDetail(category) {
  //   setSelectedCategory(category);
  //   setIsDetailModalOpen(true);
  // }

  function handleEditCategory(category) {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  }

  function handleDeleteCategory(category) {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  }

  function handleAddCategory() {
    setIsAddModalOpen(true);
  }

  function handleSearch() {
    setDebouncedKeyword(searchKeyword);
    setPage(1);
  }

  return (
    <>
      <PageTitle
        title="Categories Management"
        description="Manage your categories"
        buttonTitle="Add category"
        onButonClick={handleAddCategory}
        isLoading={isLoading}
      />

      <SearchInput
        value={searchKeyword}
        onValueChange={setSearchKeyword}
        onSearch={handleSearch}
        placeholder="Search categories by name..."
        isLoading={isLoading}
      />

      <DataTable
        columns={columns}
        data={categories}
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

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
      />

      {selectedCategory && (
        <>
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            category={selectedCategory}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            category={selectedCategory}
          />
          <CategoryDetailModal
            isOpen={isDetailModalOpen}
            onOpenChange={setIsDetailModalOpen}
            categoryId={selectedCategory._id}
          />
        </>
      )}
    </>
  );
}

