import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchEmployee({ signal, page, itemsPerPage }) {
  const response = await httpRequest.get({
    url: api.employee.getAll({ page, itemsPerPage }),
    signal,
  });

  return response;
}

export async function createEmployee({ email, password, name, role, phone, address, signal }) {
  const data = {
    email,
    password,
    name,
    role,
    phone,
    address
  }

  return await httpRequest.post({
    url: api.employee.create(),
    data,
    signal,
  });
}

export async function updateEmployee({ id, email, password, name, role, phone, address, signal }) {
  const data = {
    id,
    email,
    password,
    name,
    role,
    phone,
    address
  }

  return await httpRequest.put({
    url: api.employee.updateEmployee({ id }),
    data,
    signal,
  });
}

export async function deleteEmployee({ id, signal }) {
  return await httpRequest.delete({
    url: api.employee.deleteEmployee({ id }),
    signal,
  });
}

export async function getOneEmployee({ id, signal }) {
  return await httpRequest.get({
    url: api.employee.getOneById({ id }),
    signal,
  });
}