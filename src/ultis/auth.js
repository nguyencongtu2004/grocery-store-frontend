import { redirect } from "react-router-dom";

export function setAuthToken(token) {
  console.log("setAuthToken called, token: ", token);

  localStorage.setItem("token", token);
}

export function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  return token;
}

export function setUserId(userId) {
  localStorage.setItem("userId", userId);
}

export function getUserId() {
  return localStorage.getItem("userId");
}

export function removeAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function tokenLoader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/login");
  }

  return null; // phải return null
}
