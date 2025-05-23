import mongoose, { Schema, Document } from 'mongoose';
import { StockStatus, StockType } from '../../domain/entities/stock';
import { StockMovement } from '../../domain/entities/stockMovement';
import { Stock } from '../../domain/entities/stock';
import { StockRepository } from '../../domain/interfaces/stockRepository';
import { injectable } from 'inversify';


interface StockDocument extends Document {
  _id: string;
  name: string;
  type: StockType;
  quantity: number;
  clientId?: string;
}

interface StockMovementDocument extends Document {
  _id: string;
  stockId: string;
  quantity: number;
  status: StockStatus;
  date: Date;
  clientId?: string;
}

const StockSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(StockType), required: true },
  quantity: { type: Number, required: true },
  clientId: { type: String, required: false },
});

const StockMovementSchema = new Schema({
  _id: { type: String, required: true },
  stockId: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: Object.values(StockStatus), required: true },
  date: { type: Date, required: true },
  clientId: { type: String, required: false },
});

const StockModel = mongoose.model<StockDocument>('Stock', StockSchema);
const StockMovementModel = mongoose.model<StockMovementDocument>('StockMovement', StockMovementSchema);

@injectable()
export class MongoStockRepository implements StockRepository {
  constructor() {
    mongoose.connect('mongodb://localhost:27017/bericot', { dbName: 'bericot' });
  }

  async addStock(stock: Stock): Promise<void> {
    const existingStock = await StockModel.findOne({ _id: stock.id });
    if (existingStock) {
      existingStock.quantity += stock.quantity;
      await existingStock.save();
    } else {
      await StockModel.create({ _id: stock.id, ...stock });
    }
    await StockMovementModel.create({
      _id: Date.now().toString(),
      stockId: stock.id,
      quantity: stock.quantity,
      status: StockStatus.IN,
      date: new Date(),
      clientId: stock.clientId,
    });
  }

  async removeStock(stockId: string, quantity: number, clientId?: string): Promise<void> {
    const stock = await StockModel.findOne({ _id: stockId });
    if (!stock || stock.quantity < quantity) {
      throw new Error('Insufficient stock or stock not found');
    }
    stock.quantity -= quantity;
    await stock.save();
    await StockMovementModel.create({
      _id: Date.now().toString(),
      stockId,
      quantity,
      status: StockStatus.OUT,
      date: new Date(),
      clientId,
    });
  }

  async getStockById(stockId: string): Promise<Stock | null> {
    const stock = await StockModel.findOne({ _id: stockId });
    if (!stock) return null;
    return { id: stock._id, name: stock.name, type: stock.type, quantity: stock.quantity, clientId: stock.clientId };
  }

  async getAllStock(): Promise<Stock[]> {
    const stocks = await StockModel.find();
    return stocks.map((s) => ({
      id: s._id,
      name: s.name,
      type: s.type,
      quantity: s.quantity,
      clientId: s.clientId,
    }));
  }

  async getMovementsByMonth(month: number, year: number): Promise<StockMovement[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const movements = await StockMovementModel.find({
      date: { $gte: start, $lte: end },
    });
    return movements.map((m: StockMovementDocument) => ({
      id: m._id,
      stockId: m.stockId,
      quantity: m.quantity,
      status: m.status,
      date: m.date,
      clientId: m.clientId,
    }));
  }
}