import React, { useEffect, useState } from 'react';
import { getAllStock, Stock } from '../services/api';

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const token = localStorage.getItem('authToken') || '';

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await getAllStock(config);
        setStocks(response.data);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div>
      <h3>Stock List</h3>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.id}>
            {stock.name} ({stock.type}): {stock.quantity}
            {stock.clientId && `, Client: ${stock.clientId}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;