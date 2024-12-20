import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import RootPage from "./pages/RootPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { rootLoader } from "./ultis/loader.js";
import { navigation } from "./constants/navigation.js";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    id: "root",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      ...navigation.map((item) => ({
        path: item.route,
        element: <item.element />,
      })),
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
