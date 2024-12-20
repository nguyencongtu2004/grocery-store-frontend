import PageTitle from "../components/PageTitle";

export default function InvoicePage() {
  return (
    <>
      <PageTitle
        title="Invoice"
        description="Manage invoices of your store"
        buttonTitle="Add new invoice"
        onButonClick={() => alert("Add new invoice")}
        isLoading={false}
      />
      <div>
        <p>Invoice content</p>
      </div>
    </>
  );
}