import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { getAllStock, Stock } from './services/api'; // <-- Import Stock here

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockDashboardProps {
  token: string;
}

const StockDashboard: React.FC<StockDashboardProps> = ({ token }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStocks();
  }, [token]);

  const fetchStocks = async () => {
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await getAllStock(config);
      setStocks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: stocks.map(stock => stock.name),
    datasets: [
      {
        label: 'Stock Quantity',
        data: stocks.map(stock => stock.quantity),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <Typography>Loading dashboard...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Stock Dashboard
      </Typography>
      {stocks.length === 0 ? (
        <Typography>No stocks available</Typography>
      ) : (
        <Grid container spacing={2}>
          <Grid size={12} sx={{ height: '400px' }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Stock Quantities',
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default StockDashboard;