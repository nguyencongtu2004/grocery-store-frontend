import PageTitle from "../components/PageTitle";

export default function PurchaseOrderPage() {
  return (
    <>
      <PageTitle
        title="PurchaseOrder"
        description="Manage PurchaseOrder of your store"
        buttonTitle="Add new purchaseOrder"
        onButonClick={() => alert("Add new purchaseOrder")}
        isLoading={false}
      />
      <div>
        <p>PurchaseOrder page content</p>
      </div>
    </>
  );
}