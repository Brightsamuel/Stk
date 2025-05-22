import { StockRepository } from '../../domain/interfaces/stockRepository';
import { ReportGenerator } from '../../domain/interfaces/reportRepository';

export class GenerateMonthlyReportUseCase {
  constructor(
    private stockRepository: StockRepository,
    private reportGenerator: ReportGenerator
  ) {}

  async execute(month: number, year: number): Promise<Buffer> {
    const movements = await this.stockRepository.getMovementsByMonth(month, year);
    return this.reportGenerator.generateMonthlyReport(movements, month, year);
  }
}