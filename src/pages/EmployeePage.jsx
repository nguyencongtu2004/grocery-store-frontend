import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import PageTitle from "../components/PageTitle";
import { fetchEmployee } from "../requests/employee";
import { Link, Pagination } from "@nextui-org/react";
import { ActionCell, DataTable } from "../components/DataTable";

export default function EmployeePage() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      render: (_, index) => (page - 1) * itemsPerPage + index + 1,
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
      render: (employee) => <p className="capitalize">{employee.role}</p>,
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
          onDelete={() => handleDeleteEmployee(employee._id)}
        />
      ),
      align: "center"
    },
  ];

  function handleEmployeeDetail(employee) {
    alert(`View employee detail: ${employee.name}`);
  }

  function handleEditEmployee(employee) {
    alert(`Edit employee: ${employee.name}`);
  }

  function handleDeleteEmployee(employeeId) {
    alert(`Delete employee with ID: ${employeeId}`);
  }

  function handleAddEmployee() {
    alert("Add new Employee");
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
    </div>
  );
}

