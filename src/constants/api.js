import { getUserId } from "../ultis/auth.js";

export const api = {
  report: {
    // Revenue report
    revenueReport: ({ interval, startDate, endDate, groupBy }) =>
      `/reports/revenue?interval=${interval}&startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`,
    profitReport: ({ startDate, endDate, interval }) =>
      `/reports/profit?startDate=${startDate}&endDate=${endDate}&interval=${interval}`,
    salesReport: ({ startDate, endDate, interval }) =>
      `/reports/sales?startDate=${startDate}&endDate=${endDate}&interval=${interval}`,
    // Stock report
    stockByCategory: ({ threshold }) => `/reports/stock-by-category?threshold=${threshold}`,
    expiringProducts: ({ startDate , endDate}) => `/reports/expiring-products?startDate=${startDate}&endDate=${endDate}`,
    importByProvider: ({ startDate, endDate }) => `/reports/imports-by-provider?startDate=${startDate}&endDate=${endDate}`,
    topSellingProducts: ({ startDate, endDate }) => `/reports/top-selling-products?startDate=${startDate}&endDate=${endDate}`,
  },
  auth: {
    login: () => "/auth/login",
    register: () => "/auth/register",
  },
  user: {
    update: () => `/user/${getUserId()}`,
    getInfor: () => `/user/infor`,
  },
  employee: {
    create: () => `/auth/register`,
    updateEmployee: ({ id }) => `/user/${id}`,
    deleteEmployee: ({ id }) => `/user/${id}`,
    getAll: ({ page, itemsPerPage }) => `/employees?page=${page}&limit=${itemsPerPage}`,
    getOneById: ({ id }) => `/employees/${id}`,
  },
  customer: {
    getAll: ({ page, itemsPerPage, keyword }) => `/customers?page=${page}&limit=${itemsPerPage}&keyword=${keyword ?? ""}`,
    create: () => `/customers`,
    update: ({ id }) => `/customers/${id}`,
    getOneById: ({ id }) => `/customers/${id}`,
    delete: ({ id }) => `/customers/${id}`
  },
  invoice: {
    getAll: ({ page, itemsPerPage }) => `/invoices?page=${page}&limit=${itemsPerPage}`,
    getOneById: ({ id, page, itemsPerPage }) => `/invoices/${id}?page=${page}&limit=${itemsPerPage}`,
  },
  product: {
    getAll: ({ page, itemsPerPage }) => `/products?page=${page}&limit=${itemsPerPage}`,
    getDetail: ({ id, page, itemsPerPage }) => `/products/${id}?page=${page}&limit=${itemsPerPage}`,
  },
  purchaseOrder: {
    getAll: ({ page, itemsPerPage }) => `/purchase-orders?page=${page}&limit=${itemsPerPage}`,
    getDetail: ({ page, itemsPerPage }) => `/purchase-orders/${id}?page=${page}&limit=${itemsPerPage}`

  },
  provider: {
    getAll: () => `/providers`,
    createProvider: () => `/providers`,
    updateProvider: ({ id }) => `/providers/${id}`,
    deleteProvider: ({ id }) => `/providers/${id}`,
    getProvider: ({ id }) => `/providers/${id}`,
  }
};
