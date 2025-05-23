import { injectable, inject } from 'inversify';
import { Stock } from '../../domain/entities/stock';
import { StockRepository } from '../../domain/interfaces/stockRepository';

@injectable()
export class AddStockUseCase {
  constructor(
    @inject('StockRepository') private stockRepository: StockRepository
  ) {}

  async execute(stock: Stock): Promise<void> {
    await this.stockRepository.addStock(stock);
  }
}