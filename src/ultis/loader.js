import { redirect } from "react-router-dom";
import { navigation } from "../constants/navigation";

export async function rootLoader({ request }) {
  const url = new URL(request.url);
  console.log(url.pathname);

  if (url.pathname === "/") {
    return redirect(navigation[0].route);
  }

  return null;
}