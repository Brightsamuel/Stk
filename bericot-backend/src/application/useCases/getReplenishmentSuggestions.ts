import { StockRepository } from '../../domain/interfaces/stockRepository';

   export class GetReplenishmentSuggestionsUseCase {
     constructor(private stockRepository: StockRepository) {}

     async execute(month: number, year: number): Promise<{ stockId: string; name: string; suggestedQuantity: number }[]> {
       return this.stockRepository.getReplenishmentSuggestions(month, year);
     }
   }