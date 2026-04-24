import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import UsageStats from './features/usage/components/UsageStats';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UsageStats />
    </QueryClientProvider>
  );
}
