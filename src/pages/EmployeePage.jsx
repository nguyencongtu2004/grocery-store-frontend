import PageTitle from "../components/PageTitle";

export default function EmployeePage() {
  return (
    <>
      <PageTitle
        title="Employee"
        description="Manage Employees of your store"
        buttonTitle="Add new employee"
        onButonClick={() => alert("Add new Employee")}
        isLoading={false}
      />
      <div>
        <p>Employee page content</p>
      </div>
    </>
  );
}