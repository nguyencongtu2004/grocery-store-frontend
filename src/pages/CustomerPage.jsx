import PageTitle from "../components/PageTitle";

export default function CustomerPage() {
  return (
    <>
      <PageTitle
        title="Customer"
        description="Manage Customers of your store"
        buttonTitle="Add new customer"
        onButonClick={() => alert("Add new customer")}
        isLoading={false}
      />
      <div>
        <p>Customer page content</p>
      </div>
    </>
  );
}