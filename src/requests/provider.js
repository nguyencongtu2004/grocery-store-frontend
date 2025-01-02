import { api } from "../constants/api";
import { httpRequest } from "./index";

export async function fetchProviders({ signal }) {
  const response = await httpRequest.get({
    url: api.provider.getAll(),
    signal,
  });

  return response;
}

export async function createProvider({ name, phoneNumber, address, email, signal }) {
  const response = await httpRequest.post({
    url: api.provider.createProvider(),
    data: { name, address, phoneNumber, email },
    signal,
  });
  return response;
}

export async function updateProvider({ id, name, phoneNumber, address, email, signal }) {
  const response = await httpRequest.put({
    url: api.provider.updateProvider({ id }),
    data: { name, address, phoneNumber, email },
    signal,
  });
  return response;
}

export async function deleteProvider({ id, signal }) {
  const response = await httpRequest.delete({
    url: api.provider.deleteProvider({ id }),
    signal,
  });
  return response;
}

export async function fetchProviderById({ id, signal }) {
  const response = await httpRequest.get({
    url: api.provider.getProvider({ id }),
    signal,
  });
  return response;
}