import React, { useState } from 'react';
import { addStock, removeStock, downloadReport } from '../services/api';
import StockDashboard from '../StockDashboard';
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Box, Typography, Grid } from '@mui/material';

const StockForm: React.FC = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('fixed');
  const [quantity, setQuantity] = useState('');
  const [clientId, setClientId] = useState('');
  const [stockId, setStockId] = useState('');
  const [month, setMonth] = useState('1');
  const [year, setYear] = useState('2025');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', quantity: '', stockId: '', month: '', year: '' });

  const validate = (field: string, value: string) => {
    if (field === 'name' && !value) return 'Name is required';
    if (field === 'quantity' && (!value || isNaN(Number(value)) || Number(value) <= 0)) return 'Quantity must be a positive number';
    if (field === 'stockId' && !value) return 'Stock ID is required';
    if (field === 'month' && (!value || isNaN(Number(value)) || Number(value) < 1 || Number(value) > 12)) return 'Month must be between 1 and 12';
    if (field === 'year' && (!value || isNaN(Number(value)) || Number(value) < 2000)) return 'Year must be valid';
    return '';
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        alert('Login successful');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  const handleAddStock = async () => {
    const nameError = validate('name', name);
    const quantityError = validate('quantity', quantity);
    if (nameError || quantityError) {
      setErrors({ ...errors, name: nameError, quantity: quantityError });
      return;
    }
    try {
      await addStock(
        { name, type, quantity: Number(quantity), clientId: type === 'current' ? clientId : undefined },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Stock added successfully');
      setName('');
      setQuantity('');
      setClientId('');
    } catch (error) {
      alert('Error adding stock');
    }
  };

  const handleRemoveStock = async () => {
    const stockIdError = validate('stockId', stockId);
    const quantityError = validate('quantity', quantity);
    if (stockIdError || quantityError) {
      setErrors({ ...errors, stockId: stockIdError, quantity: quantityError });
      return;
    }
    try {
      await removeStock(stockId, Number(quantity), type === 'current' ? clientId : undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Stock removed successfully');
      setStockId('');
      setQuantity('');
      setClientId('');
    } catch (error) {
      alert('Error removing stock');
    }
  };

  const handleDownloadReport = async () => {
    const monthError = validate('month', month);
    const yearError = validate('year', year);
    if (monthError || yearError) {
      setErrors({ ...errors, month: monthError, year: yearError });
      return;
    }
    try {
      const response = await downloadReport(Number(month), Number(year), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock-report-${month}-${year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error downloading report');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Bericot Stock Tracking</Typography>
      {!token ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Login</Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleLogin} sx={{ mt: 2 }}>
            Login
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <StockDashboard token={token} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Add Stock</Typography>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: validate('name', e.target.value) });
              }}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Type</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <MenuItem value="fixed">Fixed</MenuItem>
                <MenuItem value="current">Current</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors({ ...errors, quantity: validate('quantity', e.target.value) });
              }}
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
              margin="normal"
            />
            {type === 'current' && (
              <TextField
                label="Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            <Button variant="contained" onClick={handleAddStock} sx={{ mt: 2 }}>
              Add Stock
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Remove Stock</Typography>
            <TextField
              label="Stock ID"
              value={stockId}
              onChange={(e) => {
                setStockId(e.target.value);
                setErrors({ ...errors, stockId: validate('stockId', e.target.value) });
              }}
              error={!!errors.stockId}
              helperText={errors.stockId}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors({ ...errors, quantity: validate('quantity', e.target.value) });
              }}
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
              margin="normal"
            />
            {type === 'current' && (
              <TextField
                label="Client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
            <Button variant="contained" onClick={handleRemoveStock} sx={{ mt: 2 }}>
              Remove Stock
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Generate Monthly Report</Typography>
            <TextField
              label="Month"
              type="number"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setErrors({ ...errors, month: validate('month', e.target.value) });
              }}
              error={!!errors.month}
              helperText={errors.month}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setErrors({ ...errors, year: validate('year', e.target.value) });
              }}
              error={!!errors.year}
              helperText={errors.year}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleDownloadReport} sx={{ mt: 2 }}>
              Download Report
            </Button>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StockForm;