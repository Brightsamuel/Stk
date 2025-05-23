import React, { useState } from 'react';
import { addStock, removeStock, downloadReport } from '../services/api';

const StockForm: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('fixed');
  const [quantity, setQuantity] = useState(0);
  const [clientId, setClientId] = useState('');
  const [stockId, setStockId] = useState('');
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2025);

  const token = localStorage.getItem('token') || '';

  const handleAddStock = async () => {
    try {
      const stock = {
        _id: Date.now().toString(),
        name,
        type,
        quantity: Number(quantity),
        clientId: type === 'current' ? clientId : undefined,
      };
      await addStock(stock, { headers: { Authorization: `Bearer ${token}` } });
      alert('Stock added successfully');
    } catch (error) {
      alert('Error adding stock: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleRemoveStock = async () => {
    try {
      await removeStock(
        stockId,
        Number(quantity),
        type === 'current' ? clientId : undefined,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Stock removed successfully');
    } catch (error) {
      alert('Error removing stock: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDownloadReport = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' as const,
      };
      const response = await downloadReport(month, year, config);
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock-report-${month}-${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error downloading report: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div>
      <h2>Stock Management</h2>
      <div>
        <h3>Add Stock</h3>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="fixed">Fixed</option>
          <option value="current">Current</option>
        </select>
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
        />
        {type === 'current' && (
          <input placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
        )}
        <button onClick={handleAddStock}>Add Stock</button>
      </div>
      <div>
        <h3>Remove Stock</h3>
        <input placeholder="Stock ID" value={stockId} onChange={(e) => setStockId(e.target.value)} />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
        />
        {type === 'current' && (
          <input placeholder="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} />
        )}
        <button onClick={handleRemoveStock}>Remove Stock</button>
      </div>
      <div>
        <h3>Generate Monthly Report</h3>
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value) || 1)}
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value) || 2025)}
        />
        <button onClick={handleDownloadReport}>Download Report</button>
      </div>
    </div>
  );
};

export default StockForm;