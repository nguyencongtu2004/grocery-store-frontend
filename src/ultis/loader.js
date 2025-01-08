import { redirect } from "react-router-dom";
import { navigation } from "../constants/navigation";
import { httpRequest } from "../requests";
import { api } from "../constants/api";

export async function rootLoader({ request }) {
  const url = new URL(request.url);

  const response = await httpRequest.get({ url: api.user.getInfor() });
  const role = response?.data?.user.role;
  const filteredNavigation = navigation.filter((item) => item.role.includes(role));

  if (url.pathname === "/") {
    return redirect(filteredNavigation[0].route);
  }

  return null;
}