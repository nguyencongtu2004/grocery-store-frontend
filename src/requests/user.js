import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";
import { setAuthToken, setUserId } from "../ultis/auth.js";

export async function fetchUser({ signal }) {
  const response = await httpRequest.get({
    url: api.user.getInfor(),
    signal,
  });
  if (response.data.user.id) setUserId(response.data.user.id);
  return response;
}

export async function updateUser({ user, signal }) {
  httpRequest.putWithFiles({
    url: api.user.update(),
    data: user,
    signal,
  });
}

export async function loginUser({ data, signal }) {
  const response = await httpRequest.post({
    url: api.auth.login(),
    data,
    signal,
  });
  if (response.status === 200) {
    if (response.data.token) setAuthToken(response.data.token);
    if (response.data.user.id) setUserId(response.data.user.id);
  }

  return response;
}

export async function registerUser({ data, signal }) {
  return await httpRequest.post({
    url: api.auth.register(),
    data,
    signal,
  });
}
