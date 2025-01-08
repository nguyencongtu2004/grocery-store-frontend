import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Row from "../components/layout/Row.jsx";
import NavBar from "../components/layout/NavBar.jsx";
import { useScrollToTop } from "../hooks/useScrollToTop.js";
import { Toaster } from "react-hot-toast";

export default function RootPage() {
  useScrollToTop();
  return (
    <>
      <Header />
      <Row>
        <NavBar className="fixed left-0 top-24 h-[calc(100vh-6rem)]" />
        <div className="ml-64 w-full p-8">
          <Toaster position="top-center"/>
          <Outlet />
        </div>
      </Row>
    </>
  );
}
