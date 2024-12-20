import { navigation } from "../../constants/navigation";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../ultis/ultis";
import PropTypes from "prop-types";

export default function NavBar({ className }) {
  const location = useLocation();

  return (
    <nav className={cn(className, "h-screen w-64 bg-gray-100 p-4")}>
      <ul className="space-y-2">
        {navigation.map((item, index) => {
          const isSelected = location.pathname === item.route;
          return (
            <li key={index}>
              <Link
                to={item.route}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    isSelected ? "text-white" : "text-gray-500"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

NavBar.propTypes = {
  className: PropTypes.string,
};