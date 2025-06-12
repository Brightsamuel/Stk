import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import axios from 'axios';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [registerCredentials, setRegisterCredentials] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(0); // 0 for login, 1 for register

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isRegister = false
  ) => {
    const { name, value } = e.target;
    if (isRegister) {
      setRegisterCredentials(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Sending login request to http://localhost:3001/api/auth/login', credentials);

    try {
      const response = await axios.post<{ token: string }>(
        'http://localhost:3001/api/auth/login',
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      console.log('Token stored:', localStorage.getItem('authToken'));
      onLogin(token);
    } catch (err: any) {
      console.error('Login error:', err);
      console.log('Error response:', err.response?.data);
      console.log('Error status:', err.response?.status);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        id: Math.random().toString(36).substr(2, 9), // Generate random ID
        ...registerCredentials
      });
      setError('Registration successful! Please log in.');
      setTab(0); // Switch to login tab
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} centered>
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Typography variant="h4" component="h1" gutterBottom align="center">
          {tab === 0 ? 'Login' : 'Register'}
        </Typography>
        
        {error && (
          <Alert severity={error.includes('successful') ? 'success' : 'error'} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {tab === 0 ? (
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Username"
              name="username"
              value={credentials.username}
              onChange={e => handleInputChange(e)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={e => handleInputChange(e)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              label="Username"
              name="username"
              value={registerCredentials.username}
              onChange={e => handleInputChange(e, true)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={registerCredentials.password}
              onChange={e => handleInputChange(e, true)}
              fullWidth
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        )}
      </Paper>
    </Box>
  );
};

export default Login;