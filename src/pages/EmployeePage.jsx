import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchEmployee } from "../requests/employee";
import { Link, Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";
import AddEmployeeModal from "../components/employee/AddEmployeeModal";
import EditEmployeeModal from "../components/employee/EditEmployeeModal";
import DeleteConfirmModal from "../components/employee/DeleteConfirmModal";
import EmployeeDetailModal from "../components/employee/EmployeeDetailModal";

export default function EmployeePage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["employee", page, itemsPerPage],
    queryFn: ({ signal }) => fetchEmployee({ signal, page, itemsPerPage }),
  });

  const employees = data?.data || [];
  console.log(employees);

  useEffect(() => {
    if (data?.data?.pagination) {
      setTotalPages(data.data.pagination.totalPages);
    }
  }, [data]);

  const columns = [
    {
      key: "_id",
      label: "STT",
      render: (employee) => (page - 1) * itemsPerPage + (employees.indexOf(employee) + 1),
      align: "center"
    },
    {
      key: "email",
      label: "EMAIL",
      render: (employee) => <Link href={employee.email}>{employee.email}</Link>,
    },
    {
      key: "name",
      label: "NAME",
      render: (employee) => <p className="capitalize">{employee.name}</p>,
    },
    {
      key: "role",
      label: "ROLE",
      render: (employee) => <p className="capitalize">{employee.role}</p>,
      align: "center"
    },
    {
      key: "phone",
      label: "PHONE",
      render: (employee) => <p>{employee.phone}</p>,
      align: "center"
    },
    {
      key: "address",
      label: "ADDRESS",
      render: (employee) => <p className="truncate max-w-xs">{employee.address}</p>,
    },
    {
      key: "actions",
      label: "",
      render: (employee) => (
        <ActionCell
          onView={() => handleEmployeeDetail(employee)}
          onEdit={() => handleEditEmployee(employee)}
          onDelete={() => handleDeleteEmployee(employee)}
        />
      ),
      align: "center"
    },
  ];

  function handleEmployeeDetail(employee) {
    setSelectedEmployee(employee);
    setIsDetailModalOpen(true);
  }

  function handleEditEmployee(employee) {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  }

  function handleDeleteEmployee(employee) {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  }

  function handleAddEmployee() {
    setIsAddModalOpen(true);
  }

  return (
    <div className="space-y-4">
      <PageTitle
        title="Employee Management"
        description="Manage employees of your store"
        buttonTitle="Add new employee"
        onButonClick={handleAddEmployee}
        isLoading={isLoading}
      />
      <DataTable
        data={employees}
        columns={columns}
        isLoading={isLoading}
        emptyContent="No employees found"
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
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      {selectedEmployee && (
        <>
          <EditEmployeeModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            employee={selectedEmployee}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            employee={selectedEmployee}
          />
          <EmployeeDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            employeeId={selectedEmployee._id}
          />
        </>
      )}
    </div>
  );
}
