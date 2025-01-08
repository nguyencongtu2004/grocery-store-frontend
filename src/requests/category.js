import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchCategories({ signal, page, itemsPerPage, keyword }) {
  const response = await httpRequest.get({
    url: api.category.getAll({ page, itemsPerPage, keyword }),
    signal,
  });

  return response;
}

export async function createCategory({ name, description, signal }) {
  const response = await httpRequest.post({
    url: api.category.createCategory(),
    data: { name, description },
    signal,
  });
  return response;
}

export async function updateCategory({ id, name, description, signal }) {
  const response = await httpRequest.put({
    url: api.category.updateCategory({ id }),
    data: { name, description },
    signal,
  });
  return response;
}

export async function deleteCategory({ id, signal }) {
  const response = await httpRequest.delete({
    url: api.category.deleteCategory({ id }),
    signal,
  });
  return response;
}

export async function fetchCategoryById({ id, signal }) {
  const response = await httpRequest.get({
    url: api.category.getCategory({ id }),
    signal,
  });
  return response;
}