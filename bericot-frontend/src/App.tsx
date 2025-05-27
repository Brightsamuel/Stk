import React from 'react';
import { Container, Typography } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import StockForm from './components/StockForm';
import StockList from './components/StockList';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bericot Stock Tracking
        </Typography>
        <StockForm />
        <StockList />
      </Container>
    </ErrorBoundary>
  );
};

export default App;
