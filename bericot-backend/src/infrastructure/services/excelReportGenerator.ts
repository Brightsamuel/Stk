import { injectable } from 'inversify';
import ExcelJS from 'exceljs';
import { ReportGenerator } from '../../domain/interfaces/reportRepository';
import { StockMovement } from '../../domain/entities/stock';

@injectable()
export class ExcelReportGenerator implements ReportGenerator {
  async generateMonthlyReport(movements: StockMovement[], month: number, year: number): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Stock Report ${month}-${year}`);

    worksheet.columns = [
      { header: 'Movement ID', key: 'id', width: 15 },
      { header: 'Stock ID', key: 'stockId', width: 15 },
      { header: 'Quantity', key: 'quantity', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Client ID', key: 'clientId', width: 15 },
    ];

    movements.forEach((movement) => {
      worksheet.addRow({
        id: movement.id,
        stockId: movement.stockId,
        quantity: movement.quantity,
        status: movement.status,
        date: movement.date.toISOString(),
        clientId: movement.clientId || 'N/A',
      });
    });

    // Convert ArrayBuffer to Buffer if needed
    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }
}