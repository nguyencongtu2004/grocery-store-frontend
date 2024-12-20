import PageTitle from "../components/PageTitle";

export default function StaffPage() {
  return (
    <>
      <PageTitle
        title="Staff"
        description="Manage Staffs of your store"
        buttonTitle="Add new staff"
        onButonClick={() => alert("Add new staff")}
        isLoading={false}
      />
      <div>
        <p>Staff page content</p>
      </div>
    </>
  );
}