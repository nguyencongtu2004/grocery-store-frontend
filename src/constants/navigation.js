import {
  BarChart2,
  Package,
  ShoppingCart,
  Percent,
  Users,
  Star,
  PackageCheck,
  BookMinus,
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

export const navigation = [
  {
    title: "Revenue report",
    route: "/revenue-report",
    icon: BarChart2,
    element: RevenueReportPage,
  },
  {
    title: "Warehouse report",
    route: "/warehouse-report",
    icon: Package,
    element: WarehouseReportPage,
  },
  {
    title: "Invoice",
    route: "/invoice",
    icon: Percent,
    element: InvoicePage,
  },
  {
    title: "Product",
    route: "/product",
    icon: ShoppingCart,
    element: ProductPage,
  },
  {
    title: "Employee",
    route: "/employee",
    icon: Users,
    element: Employee,
  },
  {
    title: "Customer",
    route: "/customer",
    icon: Star,
    element: CustomerPage,
  },
  {
    title: "Purchase Order",
    route: "/purchase-order",
    icon: ShoppingCart,
    element: PurchaseOrderPage,
  },
  {
    title: "Provider Management",
    route: "/providers",
    icon: PackageCheck,
    element: ProviderPage,
  },
  {
    title: "Category Management",
    route: "/categories",
    icon: BookMinus,
    element: CategoryPage,
  },
];
