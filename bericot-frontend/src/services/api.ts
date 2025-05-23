import axios from 'axios';

export interface Stock {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  clientId?: string;
}

// Fallback type for Axios config if @types/axios fails
type AxiosRequestConfig = any;
// Fallback type for Axios response if @types/axios fails
type AxiosResponse<T = any> = { data: T; status: number; statusText: string; headers: any; config: any };

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const addStock = async (stock: Stock, config?: AxiosRequestConfig): Promise<AxiosResponse<Stock>> => {
  return api.post('/stock/add', stock, config);
};

export const removeStock = async (
  stockId: string,
  quantity: number,
  clientId?: string,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<void>> => {
  return api.post('/stock/remove', { stockId, quantity, clientId }, config);
};

export const downloadReport = async (
  month: number,
  year: number,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<Blob>> => {
  return api.get(`/report/${month}/${year}`, { ...config, responseType: 'blob' });
};

export const getStocks = async (config?: AxiosRequestConfig): Promise<AxiosResponse<Stock[]>> => {
  return api.get('/stock', config);
};

export default api;