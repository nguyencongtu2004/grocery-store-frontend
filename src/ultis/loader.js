import { redirect } from "react-router-dom";

export async function rootLoader({ request }) {
  const url = new URL(request.url);
  console.log(url.pathname);

  if (url.pathname === "/") {
    return redirect("/revenue-report");
  }

  return null;
}