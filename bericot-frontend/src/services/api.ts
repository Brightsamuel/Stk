import axios from 'axios';

export interface Stock {
  id: string;
  name: string;
  type: string;
  quantity: number;
  clientId?: string;
}

// Fallback type for Axios config if @types/axios fails
type AxiosRequestConfig = any;
type AxiosResponse<T = any> = { data: T; status: number; statusText: string; headers: any; config: any };

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
});

// Add interceptor to include token in all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add Stock
export const addStock = async (
  stock: { name: string; type: string; quantity: number; clientId?: string },
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<Stock>> => {
  return api.post('/stock/add', stock, config);
};

// Remove Stock
export const removeStock = async (
  stockId: string,
  quantity: number,
  clientId?: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<void>> => {
  return api.post('/stock/remove', { stockId, quantity, clientId }, config);
};

// Download Report
export const downloadReport = async (
  month: number,
  year: number,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<Blob>> => {
  return api.get(`/stock/report/${month}/${year}`, { ...config, responseType: 'blob' });
};

// Get All Stocks
export const getAllStock = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<Stock[]>> => {
  return api.get('/stock/all', config);
};

// Get Replenishment Suggestions
export const getReplenishmentSuggestions = async (
  month: number,
  year: number,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<any>> => {
  return api.get(`/stock/replenishment/${month}/${year}`, config);
};

export default api;