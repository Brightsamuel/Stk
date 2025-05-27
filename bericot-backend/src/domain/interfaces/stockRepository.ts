import { Stock, StockMovement } from '../entities/stock';

export interface StockRepository {
  addStock(stock: Stock): Promise<void>;
  removeStock(stockId: string, quantity: number, clientId?: string): Promise<void>;
  getStockById(stockId: string): Promise<Stock | null>;
  getAllStock(): Promise<Stock[]>;
  getMovementsByMonth(month: number, year: number): Promise<StockMovement[]>;
  getReplenishmentSuggestions(month: number, year: number): Promise<{ stockId: string; name: string; suggestedQuantity: number }[]>;
}