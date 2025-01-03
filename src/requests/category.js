import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Lấy danh sách danh mục
export async function fetchCategories({ signal }) {
  try {
    const response = await httpRequest.get({
      url: api.category.getAll(),
      signal,
    });
    console.log("Response from fetchCategories:", response);
    return response;
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    throw error;
  }
}


// Tạo mới Category
export async function createCategory({ name, signal }) {
  return await httpRequest.post({
    url: api.category.createCategory(),
    data: { name },
    signal,
  });
}

// Cập nhật Category
export async function updateCategory({ id, name, signal }) {
  return await httpRequest.put({
    url: api.category.updateCategory({ id }),
    data: { name },
    signal,
  });
}

// Xóa Category
export async function deleteCategory({ id, signal }) {
  return await httpRequest.deleteCategory({
    url: api.category.delete({ id }),
    signal,
  });
}
