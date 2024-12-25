import { httpRequest } from ".";
import { api } from "../constants/api";

const getPurchaseOrder = async ({signal, page, itemsPerPage}) =>{
      return  await httpRequest.get({
        url: api.purchaseOrder.getAll({ page, itemsPerPage }),
        signal,
      });
}




export const purchaseServices = {
    getPurchaseOrder
}