'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon } from '../components/ui/icons';
import { Button } from '../components/ui/button';
import { Overview } from '../components/dashboard/Overview';
import { SpendingAnalytics } from '../components/dashboard/SpendingAnalytics';
import { SavingsGoals } from '../components/dashboard/SavingsGoals';
import { AIAnalysis } from '../components/dashboard/AIAnalysis';
import { SpendingTimeline } from '../components/dashboard/SpendingTimeline';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { FinancialProfileService } from '../../lib/financial-profile';
import { isAuthenticated, getCurrentUser, signOut } from '../../lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Verify user is authenticated
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }

    // Verify user has a financial profile
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/signin');
      return;
    }

    const profile = FinancialProfileService.getProfile(currentUser.id);
    if (!profile?.generatedProfile) {
      router.replace('/profile-setup');
      return;
    }
  }, [router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">
              Mindful Spend
            </span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <Overview />

        <div className="grid lg:grid-cols-2 gap-8">
          <SpendingAnalytics />
          <SavingsGoals />
        </div>

        <AIAnalysis />

        <div className="grid lg:grid-cols-2 gap-8">
          <SpendingTimeline />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
