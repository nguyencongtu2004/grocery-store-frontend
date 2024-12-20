import PageTitle from "../components/PageTitle";

export default function ProductPage() {
  return (
    <>
      <PageTitle
        title="Product"
        description="Manage products of your store"
        isLoading={false}
      />
      <div>
        <p>Product page content</p>
      </div>
    </>
  );
}