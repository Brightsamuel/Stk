import { Stock } from '../../domain/entities/stock';
import { StockRepository } from '../../domain/interfaces/stockRepository';

export class AddStockUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute(stock: Stock): Promise<void> {
    await this.stockRepository.addStock(stock);
  }
}