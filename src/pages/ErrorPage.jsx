import { Button } from "@nextui-org/react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useRouteError } from "react-router-dom";
import Logo from "../components/Logo";
import Column from "../components/layout/Column.jsx";

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError();

  console.log(error);

  return (
    <>
      <main className="grid place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <p>{error.message}</p>
        <Column className="items-center">
          <Logo className="pb-10" />
          <p className="text-red-500 font-bold">{error.status}</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {error.statusText}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">{error.data}</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              onClick={() => navigate(-1)}
              className="text-sm font-semibold bg-primary text-white"
              startContent={<ArrowLeft size={16} />}
            >
              Quay lại
            </Button>
            <Button variant="light" className="text-sm font-semibold">
              Liên hệ hỗ trợ
            </Button>
          </div>
        </Column>
      </main>
    </>
  );
}
