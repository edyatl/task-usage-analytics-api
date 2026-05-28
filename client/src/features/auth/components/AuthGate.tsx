import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../api/useAuth';
import { logout as apiLogout } from '../api/logout';
import LoginForm from './LoginForm';
import UsageStats from '../../usage/components/UsageStats';
import { ApiError } from '../../../lib/api';

type Screen = 'login' | 'dashboard';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function AuthGate() {
  const queryClient = useQueryClient();
  const auth = useAuth();

  // null = initial loading; we haven't resolved auth yet
  const [screen, setScreen] = useState<Screen | null>(null);
  const [faded, setFaded] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  // -- Initial screen resolution --------------------------------------
  useEffect(() => {
    if (auth.isLoading || initialized) return;
    setInitialized(true);
    setScreen(auth.isSuccess ? 'dashboard' : 'login');
  }, [auth.isLoading, auth.isSuccess, initialized]);

  // -- Token expiry: if /api/auth/me fails after init, go to login ----
  useEffect(() => {
    if (!initialized || screen !== 'dashboard') return;
    if (
      auth.isError &&
      auth.error instanceof ApiError &&
      auth.error.status === 401
    ) {
      queryClient.clear();
      crossFade('login');
    }
    // crossFade is stable; intentionally omitted from deps to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isError, auth.error, initialized, screen, queryClient]);

  // -- Cross-fade helper ----------------------------------------------
  const crossFade = useCallback(async (next: Screen) => {
    setFaded(true);
    await delay(200);
    setScreen(next);
    // Let the new screen render at opacity-0 before fading in
    await delay(30);
    setFaded(false);
  }, []);

  // -- Auth handlers --------------------------------------------------
  const handleLoginSuccess = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['auth'] });
    await crossFade('dashboard');
  }, [queryClient, crossFade]);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Proceed regardless — cookie will be cleared server-side or expire
    }
    queryClient.clear();
    setLoggedOut(true);
    await crossFade('login');
    // Auto-dismiss the "logged out" banner after 5 s
    setTimeout(() => setLoggedOut(false), 5000);
  }, [queryClient, crossFade]);

  // -- Loading: auth query hasn't resolved yet ------------------------
  if (screen === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <SpinnerIcon className="text-primary w-7 h-7" />
      </div>
    );
  }

  return (
    <div
      className="transition-opacity duration-200"
      style={{ opacity: faded ? 0 : 1, pointerEvents: faded ? 'none' : undefined }}
    >
      {screen === 'login' ? (
        <LoginForm onSuccess={handleLoginSuccess} showLogoutBanner={loggedOut} />
      ) : (
        <UsageStats onLogout={handleLogout} />
      )}
    </div>
  );
}

// -- Shared spinner used in AuthGate & LoginForm ----------------------
export function SpinnerIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
