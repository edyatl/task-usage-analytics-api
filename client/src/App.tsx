import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import AuthGate from './features/auth/components/AuthGate';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}
