import { StockType, StockStatus } from './stock';

export interface StockMovement {
  id: string;
  stockId: string;
  quantity: number;
  status: StockStatus;
  date: Date;
  clientId?: string; // Optional, for current stock movements
}