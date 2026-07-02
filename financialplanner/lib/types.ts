// Data Models for Financial Profile

export interface AssessmentPersonalInfo {
  ageRange: string;
  employmentStatus: string;
  occupationCategory: string;
  cityCostOfLiving: string;
  householdSize: number;
}

export interface IncomeSource {
  source: string;
  amount: number;
}

export interface AssessmentIncomeProfile {
  primaryMonthlyIncome: number;
  incomeFrequency: 'monthly' | 'biweekly' | 'weekly' | 'annual';
  secondaryIncomeSources: IncomeSource[];
  averageBonuses: number;
  incomeStability: 'stable' | 'variable' | 'seasonal';
}

export interface AssessmentFixedExpenses {
  rentMortgage: number;
  utilities: number;
  internetPhone: number;
  insurance: number;
  loanEMIs: number;
  subscriptions: number;
  educationExpenses: number;
  childcareExpenses: number;
}

export interface AssessmentVariableExpenses {
  groceries: number;
  diningOut: number;
  transportation: number;
  fuel: number;
  entertainment: number;
  shopping: number;
  travel: number;
  healthFitness: number;
  personalCare: number;
}

export interface AssessmentSavingsInvestments {
  currentSavingsAmount: number;
  emergencyFundAmount: number;
  monthlySavingsContribution: number;
  investmentAmount: number;
  investmentTypes: string[];
  retirementContributions: number;
}

export interface AssessmentDebtLiabilities {
  creditCardDebt: number;
  personalLoans: number;
  educationLoans: number;
  autoLoans: number;
  mortgageBalance: number;
  averageMonthlyDebtPayments: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  currentProgress: number;
}

export interface AssessmentSpendingBehaviour {
  biggestSpendingWeakness: string;
  mostRegrettedCategory: string;
  impulsePurchaseFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  shoppingTriggers: string[];
  budgetingMethod: string;
  financialConfidenceScore: number;
  biggestFinancialConcern: string;
}

export interface AssessmentProfile {
  userId: string;
  assessmentCompletedAt: string;
  personalInfo: AssessmentPersonalInfo;
  incomeProfile: AssessmentIncomeProfile;
  fixedExpenses: AssessmentFixedExpenses;
  variableExpenses: AssessmentVariableExpenses;
  savingsInvestments: AssessmentSavingsInvestments;
  debtLiabilities: AssessmentDebtLiabilities;
  financialGoals: FinancialGoal[];
  spendingBehaviour: AssessmentSpendingBehaviour;
}

export interface AssessmentNormalizedData extends AssessmentProfile {
  monthlyStats: MonthlyStats;
  categories: CategoryBreakdown[];
  merchants: MerchantStats[];
}

export interface AIProfileMeta {
  estimatedMonthlySpending: number;
  estimatedMonthlySavings: number;
  categoryDistribution: CategoryBreakdown[];
  financialHealthScore: number;
  emergencyFundAdequacy: string;
  debtPressureAssessment: string;
  savingPotentialEstimate: string;
  behavioralRiskIndicators: string;
  topStrengths: string[];
  topImprovementOpportunities: string[];
  personalizedActionPlan: string[];
  profileGeneratedAt: string;
}

export interface ParsedTransaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: 'debit' | 'credit';
  category?: string;
  description: string;
  balance?: number;
  isImpulse?: boolean;
}

export interface UploadHistoryItem {
  id: string;
  filename: string;
  uploadedAt: string;
  source: 'csv' | 'pdf' | 'assessment';
  fileSize: number;
  transactionCount: number;
}

export interface DashboardState {
  lastUpdated: string;
  lastUploadSource: 'csv' | 'pdf' | 'assessment' | 'unknown';
  lastUploadFilename?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  showImpulseInsights: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
}

export interface FinancialProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  assessmentResponses?: AssessmentProfile;
  generatedProfile?: AIProfileMeta;
  transactions: ParsedTransaction[];
  aiAnalysis: AIAnalysisResult;
  monthlyStats: MonthlyStats;
  categories: CategoryBreakdown[];
  merchants: MerchantStats[];
  uploads: UploadHistoryItem[];
  dashboardState?: DashboardState;
  preferences?: UserPreferences;
  goals?: SavingsGoal[];
}

export interface AIAnalysisResult {
  spendingSummary: string;
  monthlySpending: number;
  categoryBreakdown: string;
  spendingHabits: string;
  frequentMerchants: string;
  largestExpenses: string;
  behavioralObservations: string;
  savingOpportunities: string;
  subscriptionDetection: string;
  spendingTrends: string;
  estimatedMonthlySavings: number;
  personalizedRecommendations: string[];
  financialHealthSummary: string;
  riskScore: number;
}

export interface MonthlyStats {
  totalSpending: number;
  totalIncome: number;
  netSavings: number;
  transactionCount: number;
  averageTransaction: number;
  impulseSpending: number;
  essentialSpending: number;
  discretionarySpending: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  transactionCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MerchantStats {
  merchant: string;
  amount: number;
  transactionCount: number;
  category: string;
  frequency: 'high' | 'medium' | 'low';
}

export interface UploadProgress {
  stage: 'idle' | 'uploading' | 'parsing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface NormalizedData {
  transactions: ParsedTransaction[];
  categories: CategoryBreakdown[];
  merchants: MerchantStats[];
  monthlyStats: MonthlyStats;
}
