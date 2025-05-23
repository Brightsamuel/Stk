import { injectable, inject } from 'inversify';
import { StockRepository } from '../../domain/interfaces/stockRepository';

@injectable()
export class RemoveStockUseCase {
  constructor(
    @inject('StockRepository') private stockRepository: StockRepository
  ) {}

  async execute(stockId: string, quantity: number, clientId?: string): Promise<void> {
    await this.stockRepository.removeStock(stockId, quantity, clientId);
  }
}