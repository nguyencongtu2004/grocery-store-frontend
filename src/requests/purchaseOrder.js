import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Lấy danh sách đơn hàng
const getPurchaseOrder = async ({ signal, page, itemsPerPage }) => {
  return await httpRequest.get({
    url: api.purchaseOrder.getAll({ page, itemsPerPage }),
    signal,
  });
};

// Tạo mới đơn hàng
const createPurchaseOrder = async (orderData) => {
  return await httpRequest.post({
    url: api.purchaseOrder.create,  // Giả sử đây là API endpoint tạo đơn hàng
    data: orderData,
  });
};

// Cập nhật đơn hàng
const updatePurchaseOrder = async (purchaseId, updatedData) => {
  return await httpRequest.put({
    url: api.purchaseOrder.update(purchaseId),  // Giả sử đây là API endpoint cập nhật đơn hàng
    data: updatedData,
  });
};

// Xóa đơn hàng
const deletePurchaseOrder = async (purchaseId) => {
  return await httpRequest.delete({
    url: api.purchaseOrder.delete(purchaseId),  // Giả sử đây là API endpoint xóa đơn hàng
  });
};

export const purchaseServices = {
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};
