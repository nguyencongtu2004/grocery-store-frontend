import { twMerge } from "tailwind-merge";

// cn = classNames
export const cn = (...inputs) => {
  return twMerge(...inputs);
};

export function generateRandomId() {
  const timestamp = Date.now(); // Lấy thời gian hiện tại
  const randomNum = Math.floor(Math.random() * 1000); // Tạo số ngẫu nhiên từ 0 đến 999
  return `${timestamp}${randomNum}`; // Kết hợp thời gian và số ngẫu nhiên để tạo ID
}

export const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day}/${month}/${year} - ${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
};