import { StockMovement } from '../entities/stock';

export interface ReportGenerator {
  generateMonthlyReport(movements: StockMovement[], month: number, year: number): Promise<Buffer>;
}