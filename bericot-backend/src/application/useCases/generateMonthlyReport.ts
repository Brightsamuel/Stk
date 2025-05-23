import { injectable, inject } from 'inversify';
import { StockRepository } from '../../domain/interfaces/stockRepository';
import { ReportGenerator } from '../../domain/interfaces/reportRepository';

@injectable()
export class GenerateMonthlyReportUseCase {
  constructor(
    @inject('StockRepository') private stockRepository: StockRepository,
    @inject('ReportGenerator') private reportGenerator: ReportGenerator
  ) {}

  async execute(month: number, year: number): Promise<Buffer> {
    const movements = await this.stockRepository.getMovementsByMonth(month, year);
    return this.reportGenerator.generateMonthlyReport(movements, month, year);
  }
}