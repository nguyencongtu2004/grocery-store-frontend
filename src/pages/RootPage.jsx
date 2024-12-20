import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header.jsx";
import Row from "../components/layout/Row.jsx";
import NavBar from "../components/layout/NavBar.jsx";
import { useScrollToTop } from "../hooks/useScrollToTop.js";

export default function RootPage() {
  useScrollToTop();
  return (
    <>
      <Header />
      <Row>
        <NavBar className="sticky block top-24" />
        <div className="w-full p-8">
          <Outlet />
        </div>
      </Row>
    </>
  );
}
