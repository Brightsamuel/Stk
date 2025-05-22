export enum StockType {
  FIXED = 'fixed',
  CURRENT = 'current',
}

export enum StockStatus {
  IN = 'stock_in',
  OUT = 'stock_out',
}

export interface Stock {
  id: string;
  name: string;
  type: StockType;
  quantity: number;
  clientId?: string; // Optional, only for current stock tied to a client
}

export interface StockMovement {
  id: string;
  stockId: string;
  quantity: number;
  status: StockStatus;
  date: Date;
  clientId?: string; // Optional, for current stock movements
}