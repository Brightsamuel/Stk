import React, { useState, useEffect } from 'react';
import { Button, Container, Typography } from '@mui/material';
import ErrorBoundary from './components/ErrorBoundary';
import StockForm from './components/StockForm';
import StockList from './components/StockList';
import Login from './components/login';
const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  // Check for token in local storage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle login by storing token and updating state
  const handleLogin = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
  };

  return (
    <ErrorBoundary>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Bericot Stock Tracking
        </Typography>
        {token ? (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{ mb: 2 }}
            >
              Logout
            </Button>
            <StockForm token={token} />
            <StockList />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default App;