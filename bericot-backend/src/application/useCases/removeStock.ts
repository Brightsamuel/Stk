import { StockRepository } from '../../domain/interfaces/stockRepository';

export class RemoveStockUseCase {
  constructor(private stockRepository: StockRepository) {}

  async execute(stockId: string, quantity: number, clientId?: string): Promise<void> {
    await this.stockRepository.removeStock(stockId, quantity, clientId);
  }
}