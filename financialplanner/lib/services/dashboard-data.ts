import { FinancialProfileService } from '../financial-profile';
import { FinancialProfile } from '../types';

export interface DashboardData {
  profile: FinancialProfile | null;
  isReady: boolean;
}

export function getDashboardData(): DashboardData {
  const profile = FinancialProfileService.getProfile();
  return {
    profile,
    isReady: Boolean(profile?.generatedProfile && profile?.aiAnalysis),
  };
}
