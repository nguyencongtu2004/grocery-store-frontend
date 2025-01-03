import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Tải toàn bộ danh sách Purchase Orders
export async function fetchAllPurchaseOrders({ signal }) {
  const response = await httpRequest.get({
    url: api.purchaseOrder.getAll({ page: 1, itemsPerPage: 10, keyword: "" }), // Tải tối đa dữ liệu
    signal,
  });

  return response;
}

// Tìm kiếm trong danh sách Purchase Orders
export function searchPurchaseOrders(data, keyword) {
  const processedKeyword = keyword.trim().toLowerCase();

  return data.filter(order => {
    return order.provider.name.toLowerCase().includes(processedKeyword) ||
      new Date(order.orderDate).toLocaleDateString().includes(processedKeyword);
  });
}

// Tạo mới Purchase Order
export async function createPurchaseOrder({ formData, signal }) {
  return await httpRequest.postWithFiles({
    url: api.purchaseOrder.create(),
    data: formData,
    signal,
  });
}

// Cập nhật Purchase Order
export async function updatePurchaseOrder({ id, formData, signal }) {
  return await httpRequest.putWithFiles({
    url: api.purchaseOrder.update({ id }),
    data: formData,
    signal,
  });
}