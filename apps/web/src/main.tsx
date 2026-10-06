import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider, QueryCache, onlineManager } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { ApiError, setCsrf } from '@/lib/api';
import App from './App';
import './styles.css';
onlineManager.setOnline(navigator.onLine);
let invalidating = false;
const client = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        query.queryKey[0] !== 'session' &&
        !invalidating
      ) {
        invalidating = true;
        setCsrf('');
        client.clear();
        void client.invalidateQueries({ queryKey: ['session'] }).finally(() => {
          invalidating = false;
        });
        window.location.reload();
      }
    },
  }),
  defaultOptions: {
    queries: {
      retry: (count, e) => !(e instanceof ApiError && e.status < 500) && count < 1,
      staleTime: 30000,
      refetchOnWindowFocus: true,
      gcTime: 5 * 60000,
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        storageKey="finances-theme"
      >
        <TooltipProvider>
          <BrowserRouter>
            <App />
            <Toaster richColors />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
