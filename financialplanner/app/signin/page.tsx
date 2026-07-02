'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { PasswordInput } from '../components/ui/password-input';
import { Divider } from '../components/ui/divider';
import { SparklesIcon } from '../components/ui/icons';
import { signIn, getCurrentUser } from '../../lib/auth';
import { FinancialProfileService } from '../../lib/financial-profile';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });

      if (result.success && result.user) {
        // Check if this user already has a financial profile
        const profile = FinancialProfileService.getProfile(result.user.id);
        if (profile?.generatedProfile) {
          // User has completed onboarding, go to dashboard
          router.push('/dashboard');
        } else {
          // New user or incomplete onboarding, go to profile setup
          router.push('/profile-setup');
        }
      } else {
        setErrors({ form: result.error?.message || 'Failed to sign in' });
      }
    } catch (error) {
      setErrors({ form: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">
              Mindful Spend
            </span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Sign in to continue building better habits
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
                required
              />

              {/* Password */}
              <div className="space-y-2">
                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  autoComplete="current-password"
                  required
                />
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Divider className="my-6" />

            {/* Google OAuth (Placeholder) */}
            <button
              type="button"
              onClick={() => {
                console.log('Google OAuth not configured');
              }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                Continue with Google
              </span>
            </button>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-zinc-900 dark:text-white font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
