import { cn } from "../../ultis/ultis.js";
import PropTypes from "prop-types";
export default function Row({ children, className, ...props }) {
  return (
    <div className={cn("flex", className)} {...props}>
      {children}
    </div>
  );
}

Row.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
