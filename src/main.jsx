import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./requests/index.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </Provider>
    </NextUIProvider>
  </StrictMode>
);
