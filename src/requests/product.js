import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchProduct({ signal, page, itemsPerPage, keyword, categoryId }) {
  const response = await httpRequest.get({
    url: api.product.getAll({ page, itemsPerPage, keyword, categoryId }),
    signal,
  });
  return response;
}

export async function getProductById({ id, signal }) {
  const response = await httpRequest.get({
    url: api.product.getProduct({ id }),
    signal,
  });
  return response;
}

// Tải toàn bộ danh sách Products
export async function fetchAllProducts({ signal }) {
  const response = await httpRequest.get({
    url: api.product.getAll({ page: 1, itemsPerPage: 1000, keyword: "" }), // Tải tối đa dữ liệu
    signal,
  });

  return response;
}

// Tìm kiếm trong danh sách Products
export function searchProducts(data, keyword) {
  const processedKeyword = keyword.trim().toLowerCase();

  return data.filter(product => {
    return (
      product.name?.toLowerCase().includes(processedKeyword) ||
      product.description?.toLowerCase().includes(processedKeyword) ||
      product.category.name?.toLowerCase().includes(processedKeyword)
    );
  });
}

// Tạo mới Product
export async function createProduct({ data, signal }) {
  return await httpRequest.post({
    url: api.product.create(),
    data,
    signal,
  });
}

// Cập nhật Product
export async function updateProduct({ id, data, signal }) {
  return await httpRequest.put({
    url: api.product.updateById(id),
    data,
    signal,
  });
}