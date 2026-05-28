import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import UsageStats from './features/usage/components/UsageStats';
import { useAuth } from './features/auth/api/useAuth';
import LoginForm from './features/auth/components/LoginForm';

export default function App() {
  const { isLoading, isError, refetch } = useAuth();

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return <LoginForm onSuccess={refetch} />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <UsageStats />
    </QueryClientProvider>
  );
}
