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
    getAll: ({ page, itemsPerPage }) => `/employees?page=${page}&limit=${itemsPerPage}`,
    getDetail: ({ id, page, itemsPerPage }) => `/employees/${id}?page=${page}&limit=${itemsPerPage}`,
  },
};
