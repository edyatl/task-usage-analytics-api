import { useState, useId, type FormEvent } from 'react';
import { login } from '../api/login';
import { Card, CardContent } from '../../../components/ui/Card';
import { SpinnerIcon } from './AuthGate';
import { ApiError } from '../../../lib/api';

interface Props {
  onSuccess: () => void;
  showLogoutBanner?: boolean;
}

export default function LoginForm({ onSuccess, showLogoutBanner = false }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailId = useId();
  const passwordId = useId();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email: email.trim(), password });
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? 'Invalid email or password.'
            : `Error ${err.status}: ${err.message}`,
        );
      } else if (err instanceof TypeError) {
        // fetch() itself threw — typically a network failure
        setError('Network error. Please check your connection.');
      } else {
        setError('Something went wrong. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !isSubmitting;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-7">

        {/* Brand header */}
        <div className="text-center space-y-1.5">
          <h1
            className="text-4xl font-normal tracking-tight text-foreground"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Usage Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to monitor your AI usage
          </p>
        </div>

        {/* Logout success banner */}
        {showLogoutBanner && (
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-sm text-muted-foreground animate-fade-up"
          >
            <CheckIcon className="w-4 h-4 text-primary shrink-0" />
            You've been signed out successfully.
          </div>
        )}

        {/* Form card */}
        <Card>
          <CardContent className="space-y-5 pt-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor={emailId}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Email
              </label>
              <input
                id={emailId}
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="you@example.com"
                className={fieldCls(!!error)}
                disabled={isSubmitting}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor={passwordId}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                Password
              </label>
              <input
                id={passwordId}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="••••••••"
                className={fieldCls(!!error)}
                disabled={isSubmitting}
              />
            </div>

            {/* Inline error */}
            {error && (
              <p
                role="alert"
                className="flex items-start gap-1.5 text-xs text-red-500 dark:text-red-400"
              >
                <span className="mt-px shrink-0">⚠</span>
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={[
                'w-full flex items-center justify-center gap-2',
                'rounded-[calc(var(--radius)-2px)] py-2.5 px-4',
                'bg-primary text-primary-foreground text-sm font-medium',
                'transition-opacity duration-150',
                'hover:opacity-90 active:opacity-80',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              ].join(' ')}
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="w-4 h-4" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// -- Helpers ----------------------------------------------------------

const fieldCls = (hasError: boolean) =>
  [
    'w-full rounded-[calc(var(--radius)-2px)] border bg-background',
    'px-3 py-2.5 text-sm text-foreground',
    'placeholder:text-muted-foreground/40',
    'focus:outline-none focus:ring-2 focus:ring-primary/35',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-colors duration-150',
    hasError
      ? 'border-red-400 dark:border-red-600'
      : 'border-border hover:border-foreground/25',
  ].join(' ');

function CheckIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
