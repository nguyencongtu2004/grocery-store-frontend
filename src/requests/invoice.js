import { httpRequest } from ".";
import { api } from "../constants/api";

const getInvoices = async ({ signal, page, itemsPerPage })=>{
     const response = await httpRequest.get({
        url: api.invoice.getAll({ page, itemsPerPage }),
        signal,
      });
    return response
}
const getDetailInvoices = async (id)=>{
    const response = await httpRequest.get({
       url: api.invoice.getOneById(id),
       signal,
     });
   return response
}

export const invoiceService = {
    getInvoices,
    getDetailInvoices
}