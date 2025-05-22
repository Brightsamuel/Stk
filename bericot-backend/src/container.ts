import { Container } from 'inversify';
import { MongoStockRepository } from './infrastructure/repositories/mongoStockRepository';
import { ExcelReportGenerator } from './infrastructure/services/excelReportGenerator';
import { AddStockUseCase } from './application/useCases/addStock';
import { RemoveStockUseCase } from './application/useCases/removeStock';
import { GenerateMonthlyReportUseCase } from './application/useCases/generateMonthlyReport';
import { StockRepository } from './domain/interfaces/stockRepository';
import { ReportGenerator } from './domain/interfaces/reportRepository';
import { MongoUserRepository } from './infrastructure/repositories/mongoUserRepository';
import { JwtAuthService } from './infrastructure/services/authService';
import { AuthService } from './domain/interfaces/authService';
import { UserRepository } from './domain/interfaces/userRepository';

const container = new Container();

container.bind<StockRepository>('StockRepository').to(MongoStockRepository).inSingletonScope();
container.bind<ReportGenerator>('ReportGenerator').to(ExcelReportGenerator).inSingletonScope();
container.bind<AddStockUseCase>(AddStockUseCase).toSelf().inSingletonScope();
container.bind<RemoveStockUseCase>(RemoveStockUseCase).toSelf().inSingletonScope();
container.bind<GenerateMonthlyReportUseCase>(GenerateMonthlyReportUseCase).toSelf().inSingletonScope();
container.bind<UserRepository>('UserRepository').to(MongoUserRepository).inSingletonScope();
container.bind<AuthService>('AuthService').to(JwtAuthService).inSingletonScope();

export { container };
