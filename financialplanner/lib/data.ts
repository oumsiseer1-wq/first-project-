import { Transaction, SpendingPattern, Goal } from './ai';
import { FinancialProfileService } from './financial-profile';
import { FinancialProfile } from './types';
import { getCurrentUser } from './auth';

export const mockTransactions: Transaction[] = [];

export const mockSpendingPatterns: SpendingPattern[] = [];

export const mockGoals: Goal[] = [];

export const mockStats = {
  monthlySpending: 0,
  monthlyBudget: 0,
  remainingBudget: 0,
  monthlySavings: 0,
  spendingTrend: 'neutral' as const,
  trendPercentage: 0,
};

function getProfile(): FinancialProfile | null {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    return null;
  }
  return FinancialProfileService.getProfile(currentUser.id);
}

export function getTransactions(): Transaction[] {
  const profile = getProfile();
  if (profile) {
    return profile.transactions.map(t => ({
      id: t.id,
      amount: t.amount,
      category: t.category || 'Uncategorized',
      description: t.description,
      date: t.date,
      isImpulse: t.isImpulse,
    }));
  }
  return mockTransactions;
}

export function getSpendingPatterns(): SpendingPattern[] {
  const profile = getProfile();
  if (profile) {
    return profile.categories.map(c => ({
      category: c.category,
      amount: c.amount,
      trend: c.trend,
      percentage: c.percentage,
    }));
  }
  return mockSpendingPatterns;
}

export function getGoals(): Goal[] {
  const profile = getProfile();
  if (profile?.goals?.length) {
    return profile.goals.map(goal => ({
      id: goal.id,
      name: goal.name,
      target: goal.target,
      current: goal.current,
      deadline: goal.deadline,
    }));
  }
  return mockGoals;
}

export function getStats() {
  const profile = getProfile();
  if (profile) {
    return {
      monthlySpending: profile.monthlyStats.totalSpending,
      monthlyBudget: Math.max(profile.monthlyStats.totalSpending + profile.monthlyStats.netSavings, 0),
      remainingBudget: Math.max(profile.monthlyStats.netSavings, 0),
      monthlySavings: Math.max(profile.monthlyStats.netSavings, 0),
      spendingTrend: 'neutral' as const,
      trendPercentage: 0,
    };
  }
  return mockStats;
}
