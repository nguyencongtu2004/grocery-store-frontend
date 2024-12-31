import { httpRequest } from ".";
import { api } from "../constants/api";

const getInvoices = async ({ signal, page, itemsPerPage, searchTerm, filter }) => {
  return await httpRequest.get({
    url: api.invoice.getAll({ page, itemsPerPage, searchTerm, sortBy: filter.sortBy, order: filter.order }),
    signal,
  });
};

const getDetailInvoices = async (id) => {
  return await httpRequest.get({ url: api.invoice.getOneById(id) });
};

const createInvoice = async (invoiceData) => {
  return await httpRequest.post({ url: api.invoice.create(), data: invoiceData });
};

const exportInvoicePDF = async (id) => {
  return await httpRequest.get({ url: api.invoice.exportPDF(id), responseType: "blob" });
};

export const invoiceService = {
  getInvoices,
  getDetailInvoices,
  createInvoice,
  exportInvoicePDF,
};
