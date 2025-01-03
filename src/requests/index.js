import { QueryClient } from "@tanstack/react-query";
import { getAuthToken } from "../ultis/auth.js";
import axios from "axios";

// chuyển queryClient sang đây để mọi người có thể dùng chung
export const queryClient = new QueryClient();

const baseURL = "http://localhost:3000";

// Đối tượng httpRequest với các phương thức HTTP
export const httpRequest = {
  baseURL,
  async get({ url, signal = null, responseType = "json" }) {
    return this.request({
      method: "get",
      url,
      signal,
      responseType,
    });
  },
  async post({ url, data, signal = null }) {
    return this.request({
      method: "post",
      url,
      data,
      signal,
    });
  },
  async postWithFiles({
    url,
    data,
    signal = null,
    header = {
      "Content-Type": "multipart/form-data",
    },
  }) {
    return this.request({
      method: "post",
      url,
      data,
      signal,
      header,
    });
  },
  async put({ url, data, signal = null }) {
    return this.request({
      method: "put",
      url,
      data,
      signal,
    });
  },
  async putWithFiles({
    url,
    data,
    signal = null,
    header = {
      "Content-Type": "multipart/form-data",
    },
  }) {
    return this.request({
      method: "put",
      url,
      data,
      signal,
      header,
    });
  },
  async delete({ url, signal = null }) {
    return this.request({
      method: "delete",
      url,
      signal,
    });
  },
  async request({ method, url, data = null, signal = null, header = null, responseType = "json" }) {
    const fullURL = `${baseURL}${url}`;
    try {
      let headers = {
        "Content-Type": "application/json",
      };
      if (header) {
        headers = header;
      }

      const token = getAuthToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      console.log("Call url:", fullURL);
      return await axios({
        method,
        url: fullURL,
        data: (data ??= {}),
        signal,
        headers,
        withCredentials: true,
        responseType,
      });
    } catch (error) {
      return error.response;
    }
  },
};
