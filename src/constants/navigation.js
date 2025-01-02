import {
  BarChart2,
  Package,
  ShoppingCart,
  Percent,
  Users,
  Star,
  PackageCheck,
  BookMinus,
  CircleUserRound,
} from "lucide-react";
import RevenueReportPage from "../pages/RevenueReportPage";
import WarehouseReportPage from "../pages/WarehouseReportPage";
import ProductPage from "../pages/ProductPage";
import InvoicePage from "../pages/InvoicePage";
import CustomerPage from "../pages/CustomerPage";
import Employee from "../pages/EmployeePage";
import PurchaseOrderPage from "../pages/PurchaseOrderPage";
import ProviderPage from "../pages/ProviderPage";
import CategoryPage from "../pages/CategoryPage";
import ProfilePage from "../pages/ProfilePage";

export const navigation = [
  {
    title: "Revenue report",
    route: "/revenue-report",
    icon: BarChart2,
    element: RevenueReportPage,
    role: ["manager", "sale"],
  },
  {
    title: "Warehouse report",
    route: "/warehouse-report",
    icon: Package,
    element: WarehouseReportPage,
    role: ["manager", "warehouse"],
  },
  {
    title: "Invoice",
    route: "/invoice",
    icon: Percent,
    element: InvoicePage,
    role: ["manager", "sale"],
  },
  {
    title: "Product",
    route: "/product",
    icon: ShoppingCart,
    element: ProductPage,
    role: ["manager", "sale", "warehouse"],
  },
  {
    title: "Employee",
    route: "/employee",
    icon: Users,
    element: Employee,
    role: ["manager"],
  },
  {
    title: "Customer",
    route: "/customer",
    icon: Star,
    element: CustomerPage,
    role: ["manager", "sale"],
  },
  {
    title: "Purchase Order",
    route: "/purchase-order",
    icon: ShoppingCart,
    element: PurchaseOrderPage,
    role: ["manager", "sale"],
  },
  {
    title: "Provider Management",
    route: "/providers",
    icon: PackageCheck,
    element: ProviderPage,
    role: ["manager"],
  },
  {
    title: "Category Management",
    route: "/categories",
    icon: BookMinus,
    element: CategoryPage,
    role: ["manager"],
  },
  {
    title: "Profile",
    route: "/profile",
    icon: CircleUserRound,
    element: ProfilePage,
    role: ["manager", "sale", "warehouse"],
  },
];
