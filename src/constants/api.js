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
};
