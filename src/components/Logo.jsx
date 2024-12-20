import logo from "../assets/images/logo.png";
import { cn } from "../ultis/ultis";
import PropTypes from "prop-types";
import Row from "./layout/Row.jsx";
import { Link } from "react-router-dom";

Logo.propTypes = {
  className: PropTypes.string,
};

export default function Logo({ className }) {
  return (
    <Link to="/report">
      <Row className={cn("items-center gap-2", className)}>
        <img className="w-16 h-16" src={logo} alt="logo" />
        <div className="text-center text-[#42b28f] text-4xl font-semibold leading-normal">
          Tạp hóa
        </div>
      </Row>
    </Link>
  );
}
