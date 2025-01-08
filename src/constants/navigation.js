import { BarChart2, Package, FileText, ShoppingBag, Users, UserCheck, Clipboard, Percent, Truck, Layers, UserCircle } from 'lucide-react';
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
import DiscountPage from "../pages/DiscountPage";

export const navigation = [
  {
    title: "Revenue report",
    route: "/revenue-report",
    icon: BarChart2,
    element: RevenueReportPage,
    role: ["manager"],
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
    icon: FileText,
    element: InvoicePage,
    role: ["manager", "sale"],
  },
  {
    title: "Product",
    route: "/product",
    icon: ShoppingBag,
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
    icon: UserCheck,
    element: CustomerPage,
    role: ["manager", "sale"],
  },
  {
    title: "Purchase Order",
    route: "/purchase-order",
    icon: Clipboard,
    element: PurchaseOrderPage,
    role: ["manager", "warehouse"],
  },
  {
    title: "Discount Management",
    route: "/discounts",
    icon: Percent,
    element: DiscountPage,
    role: ["manager", "sale"],
  },
  {
    title: "Provider Management",
    route: "/providers",
    icon: Truck,
    element: ProviderPage,
    role: ["manager", "warehouse"],
  },
  {
    title: "Category Management",
    route: "/categories",
    icon: Layers,
    element: CategoryPage,
    role: ["manager", "warehouse"],
  },
  {
    title: "Profile",
    route: "/profile",
    icon: UserCircle,
    element: ProfilePage,
    role: ["manager", "sale", "warehouse"],
  },
];

