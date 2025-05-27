import React, { useEffect, useState } from 'react';
   import { Box, Typography, Grid } from '@mui/material';
   import { Bar } from 'react-chartjs-2';
   import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
   import { getAllStock, Stock } from './services/api';

   ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

   const StockDashboard: React.FC = () => {
     const [stocks, setStocks] = useState<Stock[]>([]);
     const [loading, setLoading] = useState(true);
     const token = localStorage.getItem('token') || '';

     useEffect(() => {
       const fetchStocks = async () => {
         try {
           const config = {
             headers: { Authorization: `Bearer ${token}` },
           };
           const response = await getAllStock(config);
           setStocks(response.data);
           setLoading(false);
         } catch (err) {
           console.error('Error fetching stocks:', err);
           setLoading(false);
         }
       };
       fetchStocks();
     }, []);

     const chartData = {
       labels: stocks.map((stock) => stock.name),
       datasets: [
         {
           label: 'Stock Quantity',
           data: stocks.map((stock) => stock.quantity),
           backgroundColor: 'rgba(75, 192, 192, 0.6)',
         },
       ],
     };

     return (
       <Box sx={{ p: 3 }}>
         <Typography variant="h5" gutterBottom>
           Stock Dashboard
         </Typography>
         {loading ? (
           <Typography>Loading...</Typography>
         ) : (
           <Grid container spacing={2}>
             <Grid item xs={12} component="div">
               <Bar
                 data={chartData}
                 options={{
                   responsive: true,
                   plugins: { title: { display: true, text: 'Stock Levels' } },
                 }}
               />
             </Grid>
           </Grid>
         )}
       </Box>
     );
   };

   export default StockDashboard;