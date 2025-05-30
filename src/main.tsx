
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeProvider';
import './index.css';

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Make sure we're using React.StrictMode to help catch issues early
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
