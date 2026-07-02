import { analyzeStatementWithAI } from '../ai-statement';
import { FinancialProfileService } from '../financial-profile';
import { normalizeTransactions } from '../parsers/normalizer';
import { parseStatement } from './statement-parser';
import { FinancialProfile, UserPreferences, SavingsGoal, DashboardState } from '../types';

export interface UploadMetadata {
  preferences?: UserPreferences;
  goals?: SavingsGoal[];
  dashboardState?: DashboardState;
}

export interface UploadSessionResult {
  profile: FinancialProfile;
  analysisCached: boolean;
}

export async function uploadAndAnalyzeStatement(
  file: File,
  metadata?: UploadMetadata
): Promise<UploadSessionResult> {
  const parsed = await parseStatement(file);

  if (parsed.transactions.length === 0) {
    throw new Error('No transactions were found in the statement.');
  }

  const existingProfile = FinancialProfileService.getProfile();
  const combinedTransactions = [...(existingProfile?.transactions || []), ...parsed.transactions];
  const mergedNormalized = normalizeTransactions(combinedTransactions);
  const aiAnalysis = await analyzeStatementWithAI(mergedNormalized);
  const statementRecord = {
    id: `${Date.now()}-${file.name}`,
    filename: file.name,
    uploadedAt: new Date().toISOString(),
    source: parsed.source,
    fileSize: file.size,
    transactionCount: parsed.transactions.length,
  };

  const profile = FinancialProfileService.createProfile(
    existingProfile?.userId || `user-${Date.now()}`,
    combinedTransactions,
    aiAnalysis,
    mergedNormalized.monthlyStats,
    mergedNormalized.categories,
    mergedNormalized.merchants,
    {
      uploads: [statementRecord, ...(existingProfile?.uploads || [])],
      dashboardState: metadata?.dashboardState || {
        lastUpdated: new Date().toISOString(),
        lastUploadSource: parsed.source,
        lastUploadFilename: file.name,
      },
      preferences: metadata?.preferences || existingProfile?.preferences,
      goals: metadata?.goals || existingProfile?.goals || [],
    }
  );

  FinancialProfileService.saveProfile(profile);

  return {
    profile,
    analysisCached: true,
  };
}
