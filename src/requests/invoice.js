import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Lấy danh sách hóa đơn
export async function fetchInvoices({ signal, page = 1, itemsPerPage = 10, searchTerm = "", sortBy, order }) {
  const processedSearchTerm = searchTerm.trim().split(/\s+/).join(' ');

  const response = await httpRequest.get({
    url: api.invoice.getAll({ page, itemsPerPage, searchTerm: processedSearchTerm, sortBy, order }),
    signal,
  });

  return response;
}

// Tạo mới Invoice
export async function createInvoice({ data, signal }) {
  return await httpRequest.post({
    url: api.invoice.create(),
    data,
    signal,
  });
}

// Xuất PDF Invoice
export async function exportInvoicePDF({ id, signal }) {
  return await httpRequest.get({
    url: api.invoice.exportPDF({ id }),
    signal,
    responseType: 'arraybuffer', 
  });
}