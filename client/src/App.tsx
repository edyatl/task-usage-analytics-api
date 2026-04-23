import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import ReactDOM from 'react-dom/client';
import UsageStats from './features/usage/components/UsageStats';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <UsageStats />
  </QueryClientProvider>
);
