import { getUserId } from "../ultis/auth.js";

export const api = {
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
    getDetail: ({ id, page, itemsPerPage }) => `/employees/${id}?page=${page}&limit=${itemsPerPage}`,
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

  }
};
