import mongoose, { Schema, Document } from 'mongoose';
import { StockStatus, StockType } from 'domain/entities/stock';
import { StockMovement } from '../domain/entities/StockMovement';
import { Stock } from '../../domain/entities/stock';
import { StockRepository } from '../../domain/interfaces/stockRepository';
interface StockDocument extends Document, Stock {}
interface StockMovementDocument extends Document, StockMovement {}

const StockSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(StockType), required: true },
  quantity: { type: Number, required: true },
  clientId: { type: String, required: false },
});

const StockMovementSchema = new Schema({
  id: { type: String, required: true, unique: true },
  stockId: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: Object.values(StockStatus), required: true },
  date: { type: Date, required: true },
  clientId: { type: String, required: false },
});

const StockModel = mongoose.model<StockDocument>('Stock', StockSchema);
const StockMovementModel = mongoose.model<StockMovementDocument>('StockMovement', StockMovementSchema);

export class MongoStockRepository implements StockRepository {
  constructor() {
    mongoose.connect('mongodb://localhost:27017/bericot', { dbName: 'bericot' });
  }

  async addStock(stock: Stock): Promise<void> {
    const existingStock = await StockModel.findOne({ id: stock.id });
    if (existingStock) {
      existingStock.quantity += stock.quantity;
      await existingStock.save();
    } else {
      await StockModel.create(stock);
    }
    await StockMovementModel.create({
      id: Date.now().toString(),
      stockId: stock.id,
      quantity: stock.quantity,
      status: StockStatus.IN,
      date: new Date(),
      clientId: stock.clientId,
    });
  }

  async removeStock(stockId: string, quantity: number, clientId?: string): Promise<void> {
    const stock = await StockModel.findOne({ id: stockId });
    if (!stock || stock.quantity < quantity) {
      throw new Error('Insufficient stock or stock not found');
    }
    stock.quantity -= quantity;
    await stock.save();
    await StockMovementModel.create({
      id: Date.now().toString(),
      stockId,
      quantity,
      status: StockStatus.OUT,
      date: new Date(),
      clientId,
    });
  }

  async getStockById(stockId: string): Promise<Stock | null> {
    return StockModel.findOne({ id: stockId });
  }

  async getAllStock(): Promise<Stock[]> {
    return StockModel.find();
  }

  async getMovementsByMonth(month: number, year: number): Promise<StockMovement[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    return StockMovementModel.find({
      date: { $gte: start, $lte: end },
    });
  }
}