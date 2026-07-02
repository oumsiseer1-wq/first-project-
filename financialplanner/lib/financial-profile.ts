import { FinancialProfile, ParsedTransaction, AIAnalysisResult, MonthlyStats, CategoryBreakdown, MerchantStats, UploadHistoryItem, DashboardState, UserPreferences, SavingsGoal, AssessmentProfile, AIProfileMeta } from './types';
import { getCurrentUser } from './auth';

// Helper to get storage key for a specific user
function getStorageKeyForUser(userId: string): string {
  return `financial_profile_${userId}`;
}

export class FinancialProfileService {
  static saveProfile(profile: FinancialProfile): void {
    try {
      if (typeof window === 'undefined') return;
      const key = getStorageKeyForUser(profile.userId);
      window.localStorage.setItem(key, JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to save financial profile:', error);
    }
  }

  static getProfile(userId?: string): FinancialProfile | null {
    try {
      if (typeof window === 'undefined') return null;
      
      // If no userId provided, use current authenticated user
      const userToUse = userId || getCurrentUser()?.id;
      if (!userToUse) return null;
      
      const key = getStorageKeyForUser(userToUse);
      const data = window.localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data) as FinancialProfile;
    } catch (error) {
      console.error('Failed to load financial profile:', error);
      return null;
    }
  }

  static hasProfile(userId?: string): boolean {
    return this.getProfile(userId) !== null;
  }

  static clearProfile(userId?: string): void {
    if (typeof window === 'undefined') return;
    const userToUse = userId || getCurrentUser()?.id;
    if (!userToUse) return;
    const key = getStorageKeyForUser(userToUse);
    window.localStorage.removeItem(key);
  }

  static createProfile(
    userId: string,
    transactions: ParsedTransaction[],
    aiAnalysis: AIAnalysisResult,
    monthlyStats: MonthlyStats,
    categories: CategoryBreakdown[],
    merchants: MerchantStats[],
    metadata?: {
      assessmentResponses?: AssessmentProfile;
      generatedProfile?: AIProfileMeta;
      uploads?: UploadHistoryItem[];
      dashboardState?: DashboardState;
      preferences?: UserPreferences;
      goals?: SavingsGoal[];
    }
  ): FinancialProfile {
    const existing = this.getProfile(userId);

    return {
      id: existing?.id || `profile-${userId}-${Date.now()}`,
      userId,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactions,
      assessmentResponses: metadata?.assessmentResponses || existing?.assessmentResponses,
      generatedProfile: metadata?.generatedProfile || existing?.generatedProfile,
      aiAnalysis,
      monthlyStats,
      categories,
      merchants,
      uploads: metadata?.uploads || existing?.uploads || [],
      dashboardState: metadata?.dashboardState || existing?.dashboardState || {
        lastUpdated: new Date().toISOString(),
        lastUploadSource: 'unknown',
      },
      preferences: metadata?.preferences || existing?.preferences || {
        theme: 'system',
        currency: 'USD',
        showImpulseInsights: true,
      },
      goals: metadata?.goals || existing?.goals || [],
    };
  }

  static updateProfile(
    profile: FinancialProfile,
    updates: Partial<FinancialProfile>
  ): FinancialProfile {
    const updated = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveProfile(updated);
    return updated;
  }

  static appendStatement(profileId: string, statement: UploadHistoryItem, userId: string): void {
    const profile = this.getProfile(userId);
    if (!profile || profile.id !== profileId) return;

    const uploads = [statement, ...(profile.uploads || [])];
    const updated = this.updateProfile(profile, { uploads });
    this.saveProfile({
      ...updated,
      dashboardState: {
        lastUpdated: new Date().toISOString(),
        lastUploadSource: statement.source,
        lastUploadFilename: statement.filename,
      },
    });
  }

  static savePreferences(preferences: UserPreferences): void {
    const profile = this.getProfile();
    if (!profile) return;
    this.saveProfile({ ...profile, preferences, updatedAt: new Date().toISOString() });
  }

  static saveGoals(goals: SavingsGoal[]): void {
    const profile = this.getProfile();
    if (!profile) return;
    this.saveProfile({ ...profile, goals, updatedAt: new Date().toISOString() });
  }
}
