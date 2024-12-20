import { cn } from "../../ultis/ultis.js";
import PropTypes from "prop-types";

export default function Column({ children, className, ...props }) {
  return <div className={cn("flex flex-col", className)} {...props}>{children}</div>;
}

Column.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};