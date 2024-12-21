import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchEmployee({ signal, page, itemsPerPage }) {
  const response = await httpRequest.get({
    url: api.employee.getAll({ page, itemsPerPage }),
    signal,
  });

  return response;
}