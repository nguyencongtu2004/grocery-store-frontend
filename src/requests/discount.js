import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

export async function fetchAllDiscount({ signal, page, itemsPerPage, keyword }) {
  const response = await httpRequest.get({
    url: api.discount.getAll({ page, itemsPerPage, keyword }),
    signal,
  });

  return response;
}

export async function createDiscount({ code, name, description, discountInPercent, minOrderValue, maxDiscountValue, usageLimit, expireDate, signal }) {
  const response = await httpRequest.post({
    url: api.discount.createDiscount(),
    data: { code, name, description, discountInPercent, minOrderValue, maxDiscountValue, usageLimit, expireDate },
    signal,
  });
  return response;
}

export async function updateDiscount({ id, code, name, description, discountInPercent, minOrderValue, maxDiscountValue, usageLimit, expireDate, signal }) {
  const response = await httpRequest.put({
    url: api.discount.updateDiscount({ id }),
    data: { code, name, description, discountInPercent, minOrderValue, maxDiscountValue, usageLimit, expireDate },
    signal,
  });
  return response;
}

export async function deleteDiscount({ id, signal }) {
  const response = await httpRequest.delete({
    url: api.discount.deleteDiscount({ id }),
    signal,
  });
  return response;
}

export async function fetchDiscountById({ id, signal }) {
  const response = await httpRequest.get({
    url: api.discount.getDiscount({ id }),
    signal,
  });
  return response;
}