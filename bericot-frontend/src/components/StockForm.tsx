import React, { useState } from 'react';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography, Grid } from '@mui/material';
import StockDashboard from '../StockDashboard';
import { addStock, removeStock, downloadReport } from '../services/api';

interface Stock {
  id: string;
  name: string;
  type: string;
  quantity: number;
  clientId?: string;
}

interface StockFormProps {
  token: string;
}

const StockForm: React.FC<StockFormProps> = ({ token }) => {
  const [stockData, setStockData] = useState({
    name: '',
    type: '',
    quantity: 0,
    clientId: ''
  });
  
  const [removeId, setRemoveId] = useState('');
  const [removeQuantity, setRemoveQuantity] = useState(0);
  const [reportMonth, setReportMonth] = useState('');
  const [reportYear, setReportYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStockData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setStockData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      await addStock(stockData, config);
      setMessage('Stock added successfully!');
      setStockData({
        name: '',
        type: '',
        quantity: 0,
        clientId: ''
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      await removeStock(removeId, removeQuantity, stockData.clientId, config);
      setMessage('Stock removed successfully!');
      setRemoveId('');
      setRemoveQuantity(0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove stock');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const month = parseInt(reportMonth);
      const year = parseInt(reportYear);
      const response = await downloadReport(month, year, config);
      
      // Create download link for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock-report-${month}-${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setMessage('Report downloaded successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Stock Management System
      </Typography>
      
      <Button 
        variant="outlined" 
        onClick={() => setShowDashboard(!showDashboard)}
        sx={{ mb: 3 }}
      >
        {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
      </Button>

      {message && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1 }}>
          {message}
        </Box>
      )}

      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          {error}
        </Box>
      )}

      {showDashboard ? (
        <Box sx={{ mb: 4 }}>
          <StockDashboard token={token} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid size={12}>
            <StockDashboard token={token} />
          </Grid>          
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Add Stock</Typography>
            <TextField
              label="Name"
              name="name"
              value={stockData.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={stockData.type}
                onChange={handleSelectChange}
                label="Type"
              >
                <MenuItem value="Electronics">Electronics</MenuItem>
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Books">Books</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={stockData.quantity}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Client ID (Optional)"
              name="clientId"
              value={stockData.clientId}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleAddStock}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Stock'}
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h6">Remove Stock</Typography>
            <TextField
              label="Stock ID"
              value={removeId}
              onChange={(e) => setRemoveId(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Quantity to Remove"
              type="number"
              value={removeQuantity}
              onChange={(e) => setRemoveQuantity(Number(e.target.value))}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleRemoveStock}
              disabled={loading}
            >
              {loading ? 'Removing...' : 'Remove Stock'}
            </Button>
          </Grid>
          <Grid size={12}>
            <Typography variant="h6">Generate Monthly Report</Typography>
            <TextField
              label="Month (1-12)"
              type="number"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g., 1 for January"
              inputProps={{ min: 1, max: 12 }}
              required
            />
            <TextField
              label="Year"
              type="number"
              value={reportYear}
              onChange={(e) => setReportYear(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g., 2024"
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="info"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? 'Downloading...' : 'Download Report'}
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StockForm;