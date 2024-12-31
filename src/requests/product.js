import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Lấy danh sách sản phẩm
export async function fetchProduct({ signal, page, itemsPerPage }) {
  const response = await httpRequest.get({
    url: api.product.getAll({ page, itemsPerPage }),
    signal,
  });
  return response;
}

// Xem chi tiết sản phẩm
export async function fetchProductById(id) {
  const response = await httpRequest.get({
    url: api.product.getDetail({ id }),
  });
  return response;
}

// Cập nhật sản phẩm
export async function updateProduct(id, data) {
  const response = await httpRequest.put({
    url: api.product.updateById(id),
    data,
  });
  return response;
}

// Xóa sản phẩm
export async function deleteProduct(id) {
  const response = await httpRequest.delete({
    url: api.product.deleteById(id),
  });
  return response;
}
