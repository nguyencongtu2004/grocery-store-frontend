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

// export const convertToQuery = (key, value) => {
//   if (Array.isArray(value)) {
//     return value.map((v) => `${key}=${v}`).join("&");
//   }
//   return `${key}=${value}`;
// };

// use:
// const query = useMemo(
//   () =>
//     [
//       convertToQuery("categories", selectedCategories),
//       convertToQuery("colors", selectedColors),
//       convertToQuery("priceRange", selectedPriceRange),
//       convertToQuery("sizes", selectedSizes),
//       convertToQuery("ratings", selectedRatings),
//       convertToQuery("isOnSale", isOnSale),
//       convertToQuery("sortBy", sortBy),
//       convertToQuery("keyword", keyword),
//     ].join("&"),
//   [
//     isOnSale,
//     keyword,
//     selectedCategories,
//     selectedColors,
//     selectedPriceRange,
//     selectedRatings,
//     selectedSizes,
//     sortBy,
//   ]
// );