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
    expiringProducts: ({ startDate, endDate }) => `/reports/expiring-products?startDate=${startDate}&endDate=${endDate}`,
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
  product: {
    getAll: ({ page, itemsPerPage, keyword, categoryId }) => `/products?page=${page}&limit=${itemsPerPage}&name=${keyword ?? ""}&categoryId=${categoryId ?? ""}`,
    getDetail: ({ id }) => `/products/${id}`,
    updateById: (id) => `/products/${id}`,
  },
  invoice: {
    getAll: ({ page, itemsPerPage, searchTerm, sortBy, order }) =>
      `/invoices?page=${page}&limit=${itemsPerPage}&search=${searchTerm ?? ""}&sortBy=${sortBy ?? ""}&order=${order ?? ""}`,
    create: () => "/invoices",
    exportPDF: ({ id }) => `/invoices/${id}/export`,
  },
  purchaseOrder: {
    getAll: ({ page, itemsPerPage, keyword }) => `/purchase-orders?page=${page}&limit=${itemsPerPage}&keyword=${keyword ?? ""}`,
    create: () => "/purchase-orders",
    update: ({ id }) => `/purchase-orders/${id}`,
  },
  provider: {
    getAll: () => `/providers`,
    createProvider: () => `/providers`,
    updateProvider: ({ id }) => `/providers/${id}`,
    deleteProvider: ({ id }) => `/providers/${id}`,
    getProvider: ({ id }) => `/providers/${id}`,
  },
  category: {
    getAll: () => `/categories`,
    createCategory: () => `/categories`,
    updateCategory: ({ id }) => `/categories/${id}`,
    deleteCategory: ({ id }) => `/categories/${id}`,
    getCategory: ({ id }) => `/categories/${id}`,
  },
  discount: {
    getAll: ({ page, itemsPerPage }) => `/discounts/all?page=${page}&limit=${itemsPerPage}`,
    createDiscount: () => `/discounts`,
    updateDiscount: ({ id }) => `/discounts/${id}`,
    deleteDiscount: ({ id }) => `/discounts/${id}`,
    getDiscount: ({ id }) => `/discounts/${id}`,
  },
};
