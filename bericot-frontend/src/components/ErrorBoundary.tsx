import React, { Component, ReactNode } from 'react';
  import { Typography, Box } from '@mui/material';

  interface Props {
    children: ReactNode;
  }

  interface State {
    hasError: boolean;
  }

  class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return (
          <Box sx={{ p: 3 }}>
            <Typography color="error">Something went wrong. Please try again.</Typography>
          </Box>
        );
      }
      return this.props.children;
    }
  }

  export default ErrorBoundary;