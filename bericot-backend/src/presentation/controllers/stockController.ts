import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, httpGet, request, response, next } from 'inversify-express-utils';
import { AddStockUseCase } from '../../application/useCases/addStock';
import { RemoveStockUseCase } from '../../application/useCases/removeStock';
import { GenerateMonthlyReportUseCase } from '../../application/useCases/generateMonthlyReport';
import { GetReplenishmentSuggestionsUseCase } from '../../application/useCases/getReplenishmentSuggestions';
import { AuthService } from '../../domain/interfaces/authService';
import { Stock } from '../../domain/entities/stock';

@controller('/api/stock')
export class StockController {
  constructor(
    @inject(AddStockUseCase) private addStockUseCase: AddStockUseCase,
    @inject(RemoveStockUseCase) private removeStockUseCase: RemoveStockUseCase,
    @inject(GenerateMonthlyReportUseCase) private generateMonthlyReportUseCase: GenerateMonthlyReportUseCase,
    @inject(GetReplenishmentSuggestionsUseCase) private getReplenishmentSuggestionsUseCase: GetReplenishmentSuggestionsUseCase,
    @inject('StockRepository') private stockRepository: import('../../domain/interfaces/stockRepository').StockRepository,
    @inject('AuthService') private authService: AuthService
  ) {}

  private handleError(res: Response, error: any) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }

  private async authenticate(
    @request() req: Request,
    @response() res: Response,
    @next() next: NextFunction
  ) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    try {
      await this.authService.verifyToken(token);
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }

  @httpPost('/add', StockController.prototype.authenticate)
  async addStock(@request() req: Request, @response() res: Response) {
    try {
      const { name, type, quantity, clientId } = req.body;
      if (!name || !type || !quantity || quantity <= 0) {
        throw new Error('Invalid input: name, type, and positive quantity are required');
      }
      const stock: Stock = { id: Date.now().toString(), name, type, quantity, clientId };
      await this.addStockUseCase.execute(stock);
      res.status(201).json({ message: 'Stock added successfully' });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @httpPost('/remove', StockController.prototype.authenticate)
  async removeStock(@request() req: Request, @response() res: Response) {
    try {
      const { stockId, quantity, clientId } = req.body;
      if (!stockId || !quantity || quantity <= 0) {
        throw new Error('Invalid input: stockId and positive quantity are required');
      }
      await this.removeStockUseCase.execute(stockId, quantity, clientId);
      res.status(200).json({ message: 'Stock removed successfully' });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @httpGet('/report/:month/:year', StockController.prototype.authenticate)
  async generateReport(@request() req: Request, @response() res: Response) {
    try {
      const { month, year } = req.params;
      const buffer = await this.generateMonthlyReportUseCase.execute(parseInt(month), parseInt(year));
      res.setHeader('Content-Disposition', `attachment; filename=stock-report-${month}-${year}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @httpGet('/replenishment/:month/:year', StockController.prototype.authenticate)
  async getReplenishmentSuggestions(@request() req: Request, @response() res: Response) {
    try {
      const { month, year } = req.params;
      const suggestions = await this.getReplenishmentSuggestionsUseCase.execute(parseInt(month), parseInt(year));
      res.status(200).json(suggestions);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  @httpGet('/all', StockController.prototype.authenticate)
  async getAllStock(@request() req: Request, @response() res: Response) {
    try {
      const stocks = await this.stockRepository.getAllStock();
      res.status(200).json(stocks);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}