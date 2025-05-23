import React, { useEffect, useState } from 'react';
import { getStocks, Stock } from '../services/api';

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await getStocks(config);
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
          <li key={stock._id}>
            {stock.name} ({stock.type}): {stock.quantity}
            {stock.clientId && `, Client: ${stock.clientId}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockList;