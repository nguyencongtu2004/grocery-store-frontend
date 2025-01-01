import { api } from "../constants/api";
import { httpRequest } from "./index";

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await httpRequest.get({
        url: api.category.getAll(),
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch categories: " + error.message);
    }
  },
};

export const customerService = {
  searchCustomers: async (keyword) => {
    try {
      const response = await httpRequest.get({
        url: api.customer.search(keyword),
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to search customers: " + error.message);
    }
  },
};

export const productService = {
  searchProducts: async (keyword, categoryId) => {
    try {
      const response = await httpRequest.get({
        url: api.product.search(keyword, categoryId),
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to search products: " + error.message);
    }
  },
};

export const invoiceService = {
  createInvoice: async (data) => {
    try {
      const response = await httpRequest.post({
        url: api.invoice.create(),
        data,
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to create invoice: " + error.message);
    }
  },
};
