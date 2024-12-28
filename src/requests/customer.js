import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Lấy danh sách khách hàng
export async function fetchCustomers({ signal, page = 1, itemsPerPage = 10, keyword = "" }) {
  // Loại bỏ khoảng trắng thừa và tách từ khóa
  const processedKeyword = keyword.trim().split(/\s+/).join(' ');

  const response = await httpRequest.get({
    url: api.customer.getAll({ page, itemsPerPage, keyword: processedKeyword }),
    signal,
  });

  return response;
}

// Tạo khách hàng mới
export async function createCustomer({ name, phone, address, signal }) {
  const data = {
    name,
    phone,
    address
  };

  return await httpRequest.post({
    url: api.customer.create(),
    data,
    signal,
  });
}

// Cập nhật thông tin khách hàng
export async function updateCustomer({ id, name, phone, address, signal }) {
  const data = {
    name,
    phone,
    address
  };

  return await httpRequest.put({
    url: api.customer.update({ id }),
    data,
    signal,
  });
}

// Lấy chi tiết khách hàng
export async function getCustomerDetail({ id, signal }) {
  return await httpRequest.get({
    url: api.customer.getOneById({ id }),
    signal,
  });
}

// Xóa khách hàng
export async function deleteCustomer({ id, signal }) {
  return await httpRequest.delete({
    url: api.customer.delete({ id }),
    signal,
  });
}