  import { api } from "../constants/api.js";
  import { httpRequest } from "./index.js";

  export const invoiceService = {
    getInvoices: async ({ signal, page, itemsPerPage, searchTerm = "", filter = {} }) => {
      const { sortBy = "createdAt", order = "desc" } = filter;
      const response = await httpRequest.get({
        url: api.invoice.getAll({ page, itemsPerPage, searchTerm, sortBy, order }),
        signal,
      });
      return response;
    },

    createInvoice: async (data) => {
      const response = await httpRequest.post({
        url: api.invoice.create(),
        data,
      });
      return response;
    },

    exportPDF: async (id) => {
      const response = await httpRequest.get({
        url: api.invoice.exportPDF(id),
        responseType: "blob", // This is used for downloading files
      });
      return response;
    },
  };

  export const customerService = {
    searchCustomers: async (keyword) => {
      return await httpRequest.get({
        url: `/customers?keyword=${keyword}`,
      });
    },    
  };
  

  export const productService = {
    searchProducts: async (keyword, categoryId) => {
      return await httpRequest.get({
        url: `/products?keyword=${keyword}&category=${categoryId}`,
      });
    },    
  };