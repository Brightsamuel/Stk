import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpGet } from 'inversify-express-utils';
import { AddStockUseCase } from '../../application/useCases/addStock';
import { RemoveStockUseCase } from '../../application/useCases/removeStock';
import { GenerateMonthlyReportUseCase } from '../../application/useCases/generateMonthlyReport';
import { Stock, StockType } from '../../domain/entities/stock';

@controller('/api/stock')
export class StockController {
  constructor(
    @inject(AddStockUseCase) private addStockUseCase: AddStockUseCase,
    @inject(RemoveStockUseCase) private removeStockUseCase: RemoveStockUseCase,
    @inject(GenerateMonthlyReportUseCase) private generateMonthlyReportUseCase: GenerateMonthlyReportUseCase
  ) {}

  @httpPost('/add')
  async addStock(req: Request, res: Response) {
    try {
      const { name, type, quantity, clientId } = req.body;
      const stock: Stock = { id: Date.now().toString(), name, type, quantity, clientId };
      await this.addStockUseCase.execute(stock);
      res.status(201).json({ message: 'Stock added successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  @httpPost('/remove')
  async removeStock(req: Request, res: Response) {
    try {
      const { stockId, quantity, clientId } = req.body;
      await this.removeStockUseCase.execute(stockId, quantity, clientId);
      res.status(200).json({ message: 'Stock removed successfully' });
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  @httpGet('/report/:month/:year')
  async generateReport(req: Request, res: Response) {
    try {
      const { month, year } = req.params;
      const buffer = await this.generateMonthlyReportUseCase.execute(parseInt(month), parseInt(year));
      res.setHeader('Content-Disposition', `attachment; filename=stock-report-${month}-${year}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
}