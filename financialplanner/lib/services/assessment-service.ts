import { FinancialProfileService } from '../financial-profile';
import {
  AssessmentProfile,
  AIProfileResult,
  DashboardState,
  FinancialProfile,
  SavingsGoal,
  UserPreferences,
} from '../types';
import { generateAIProfileFromAssessment } from '../ai-profile';
import { normalizeAssessmentData } from '../parsers/assessment-normalizer';
import { getCurrentUser } from '../auth';

export interface AssessmentSubmission {
  assessmentResponses: AssessmentProfile;
  goals: SavingsGoal[];
  preferences?: UserPreferences;
}

export interface AssessmentResult {
  profile: FinancialProfile;
}

export async function submitFinancialAssessment(
  submission: AssessmentSubmission
): Promise<AssessmentResult> {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error('User must be authenticated to submit assessment');
  }

  const normalized = normalizeAssessmentData(submission.assessmentResponses);
  const aiProfile = await generateAIProfileFromAssessment(normalized);

  // Use actual userId from current authenticated user
  const userId = currentUser.id;
  
  const profile = FinancialProfileService.createProfile(
    userId,
    [],
    aiProfile.aiAnalysis,
    aiProfile.monthlyStats,
    aiProfile.categories,
    aiProfile.merchants,
    {
      assessmentResponses: submission.assessmentResponses,
      generatedProfile: aiProfile.generatedProfile,
      dashboardState: {
        lastUpdated: new Date().toISOString(),
        lastUploadSource: 'assessment',
      },
      preferences: submission.preferences,
      goals: submission.goals,
    }
  );

  FinancialProfileService.saveProfile(profile);
  return { profile };
}
