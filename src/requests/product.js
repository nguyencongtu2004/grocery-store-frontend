import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchProduct({ signal, page, itemsPerPage }) {
  const response = await httpRequest.get({
    url: api.product.getAll({ page, itemsPerPage }),
    signal,
  });

  return response;
}