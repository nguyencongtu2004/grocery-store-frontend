import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchProduct({ signal, page, itemsPerPage }) {
  const response = await httpRequest.get({
    url: api.product.getAll({ page, itemsPerPage }),
    signal,
  });
  return response;
} 

export async function deleteProduct(id) {
  const response = await httpRequest.delete({
    url: api.product.deleteById(id),
  });
  return response;
}