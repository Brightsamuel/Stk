import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const addStock = async (stock: { name: string; type: string; quantity: number; clientId?: string }, config: any) => {
  return api.post('/stock/add', stock, config);
};

export const removeStock = async (stockId: string, quantity: number, clientId?: string, config: any) => {
  return api.post('/stock/remove', { stockId, quantity, clientId }, config);
};

export const downloadReport = async (month: number, year: number, config: any) => {
  return api.get(`/stock/report/${month}/${year}`, { ...config, responseType: 'blob' });
};