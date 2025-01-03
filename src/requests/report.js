import { api } from "../constants/api.js";
import { httpRequest } from "./index.js";

// Revenue Report

export async function fetchRevenueReport({ signal, interval, startDate, endDate, groupBy }) {
  const response = await httpRequest.get({
    url: api.report.revenueReport({ interval, startDate, endDate, groupBy }),
    signal,
  });

  return response;
}

export async function fetchProfitReport({ signal, startDate, endDate, interval }) {
  const response = await httpRequest.get({
    url: api.report.profitReport({ startDate, endDate, interval }),
    signal,
  });
  return response;
}

export async function fetchSalesReport({ signal, startDate, endDate, interval }) {
  const response = await httpRequest.get({
    url: api.report.salesReport({ startDate, endDate, interval }),
    signal,
  });
  return response;
}

// Stock Report

export async function stockByCategory({ signal, threshold }) {
  const response = await httpRequest.get({
    url: api.report.stockByCategory({ threshold }),
    signal,
  });
  return response;
}

export async function expiringProducts({ signal, startDate, endDate }) {
  const response = await httpRequest.get({
    url: api.report.expiringProducts({ startDate, endDate }),
    signal,
  });
  return response;
}

export async function importByProvider({ signal, startDate, endDate }) {
  const response = await httpRequest.get({
    url: api.report.importByProvider({ startDate, endDate }),
    signal,
  });
  return response;
}

export async function topSellingProducts({ signal, startDate, endDate }) {
  const response = await httpRequest.get({
    url: api.report.topSellingProducts({ startDate, endDate }),
    signal,
  });
  return response;
}