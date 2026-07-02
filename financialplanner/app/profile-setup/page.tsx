'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon } from '../components/ui/icons';
import { ProgressIndicator } from '../components/ProgressIndicator';
import { isAuthenticated, getCurrentUser } from '../../lib/auth';
import { FinancialProfileService } from '../../lib/financial-profile';
import { submitFinancialAssessment } from '../../lib/services/assessment-service';
import { SavingsGoal } from '../../lib/types';

const onboardingCategories = [
  'Dining & Entertainment',
  'Subscriptions',
  'Travel',
  'Groceries',
  'Health & Fitness',
  'Shopping',
  'Utilities',
];

const stepCards = [
  {
    title: 'Secure assessment',
    description: 'Answer a few questions so we can personalize your financial profile and generate a premium dashboard.',
  },
  {
    title: 'Define your goals',
    description: 'Share what you are working toward and what matters most to your money.',
  },
  {
    title: 'Snapshot your budget',
    description: 'Tell us about income, spending, and savings so AI can tune recommendations.',
  },
  {
    title: 'Complete assessment',
    description: 'Submit your responses and unlock your dashboard.',
  },
];

type AssessmentFormData = {
  primaryGoal: string;
  priority: string;
  monthlyIncome: string;
  monthlySpendingTarget: string;
  reviewFrequency: string;
  selectedCategories: string[];
  ageRange: string;
  employmentStatus: string;
  occupationCategory: string;
  cityCostOfLiving: string;
  householdSize: string;
  currentSavings: string;
  emergencyFund: string;
  monthlySavingsContribution: string;
  creditCardDebt: string;
  personalLoans: string;
  educationLoans: string;
  autoLoans: string;
  mortgageBalance: string;
  averageMonthlyDebtPayments: string;
  biggestSpendingWeakness: string;
  impulsePurchaseFrequency: string;
  financialConfidenceScore: string;
  biggestFinancialConcern: string;
};

const initialFormData: AssessmentFormData = {
  primaryGoal: '',
  priority: '',
  monthlyIncome: '',
  monthlySpendingTarget: '',
  reviewFrequency: 'monthly',
  selectedCategories: [],
  ageRange: '25-34',
  employmentStatus: 'employed',
  occupationCategory: 'professional',
  cityCostOfLiving: 'moderate',
  householdSize: '1',
  currentSavings: '0',
  emergencyFund: '0',
  monthlySavingsContribution: '0',
  creditCardDebt: '0',
  personalLoans: '0',
  educationLoans: '0',
  autoLoans: '0',
  mortgageBalance: '0',
  averageMonthlyDebtPayments: '0',
  biggestSpendingWeakness: 'Impulse purchases when stressed',
  impulsePurchaseFrequency: 'monthly',
  financialConfidenceScore: '6',
  biggestFinancialConcern: 'Balancing savings with everyday spending',
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AssessmentFormData>(initialFormData);
  const [stepError, setStepError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.replace('/signin');
      return;
    }

    // Check if this specific user already has a profile
    const profile = FinancialProfileService.getProfile(currentUser.id);
    if (profile?.generatedProfile) {
      router.replace('/dashboard');
    }
  }, [router]);

  const steps = useMemo(
    () => [
      { label: 'Welcome', description: 'Start your financial setup' },
      { label: 'Goals', description: 'Share your top financial priorities' },
      { label: 'Budget', description: 'Capture income, spending, and savings' },
      { label: 'Review', description: 'Submit and unlock your dashboard' },
    ],
    []
  );

  const handleFormChange = (field: keyof AssessmentFormData, value: string) => {
    setStepError('');
    setSubmitError('');
    setSubmitMessage('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => {
      const selected = prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((item) => item !== category)
        : [...prev.selectedCategories, category];
      return { ...prev, selectedCategories: selected };
    });
  };

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.primaryGoal.trim() || !formData.priority.trim()) {
        setStepError('Please enter your goal and choose your priority.');
        return false;
      }
    }

    if (step === 2) {
      if (!formData.monthlyIncome || !formData.monthlySpendingTarget) {
        setStepError('Please enter your monthly income and spending target.');
        return false;
      }

      if (Number(formData.monthlyIncome) <= 0 || Number(formData.monthlySpendingTarget) <= 0) {
        setStepError('Income and spending must be positive numbers.');
        return false;
      }
    }

    if (step === 3) {
      if (!formData.biggestFinancialConcern.trim()) {
        setStepError('Please share your biggest financial concern before submitting.');
        return false;
      }

      if (!formData.financialConfidenceScore || Number(formData.financialConfidenceScore) < 1) {
        setStepError('Please provide a confidence score between 1 and 10.');
        return false;
      }
    }

    return true;
  };

  const buildAssessmentProfile = () => {
    const currentUser = getCurrentUser();
    const userId = currentUser?.id ?? `user-${Date.now()}`;

    return {
      userId,
      assessmentCompletedAt: new Date().toISOString(),
      personalInfo: {
        ageRange: formData.ageRange,
        employmentStatus: formData.employmentStatus,
        occupationCategory: formData.occupationCategory,
        cityCostOfLiving: formData.cityCostOfLiving,
        householdSize: Number(formData.householdSize) || 1,
      },
      incomeProfile: {
        primaryMonthlyIncome: Number(formData.monthlyIncome) || 0,
        incomeFrequency: 'monthly',
        secondaryIncomeSources: [],
        averageBonuses: 0,
        incomeStability: 'stable',
      },
      fixedExpenses: {
        rentMortgage: 0,
        utilities: 0,
        internetPhone: 0,
        insurance: 0,
        loanEMIs: 0,
        subscriptions: 0,
        educationExpenses: 0,
        childcareExpenses: 0,
      },
      variableExpenses: {
        groceries: 0,
        diningOut: 0,
        transportation: 0,
        fuel: 0,
        entertainment: 0,
        shopping: 0,
        travel: 0,
        healthFitness: 0,
        personalCare: 0,
      },
      savingsInvestments: {
        currentSavingsAmount: Number(formData.currentSavings) || 0,
        emergencyFundAmount: Number(formData.emergencyFund) || 0,
        monthlySavingsContribution: Number(formData.monthlySavingsContribution) || 0,
        investmentAmount: 0,
        investmentTypes: [],
        retirementContributions: 0,
      },
      debtLiabilities: {
        creditCardDebt: Number(formData.creditCardDebt) || 0,
        personalLoans: Number(formData.personalLoans) || 0,
        educationLoans: Number(formData.educationLoans) || 0,
        autoLoans: Number(formData.autoLoans) || 0,
        mortgageBalance: Number(formData.mortgageBalance) || 0,
        averageMonthlyDebtPayments: Number(formData.averageMonthlyDebtPayments) || 0,
      },
      financialGoals: [
        {
          id: `goal-${Date.now()}`,
          name: formData.primaryGoal || 'Build stronger savings',
          targetAmount: Number(formData.monthlySpendingTarget) * 6 || 0,
          targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          currentProgress: 0,
        },
      ],
      spendingBehaviour: {
        biggestSpendingWeakness: formData.biggestSpendingWeakness,
        mostRegrettedCategory: formData.selectedCategories[0] || 'Shopping',
        impulsePurchaseFrequency: formData.impulsePurchaseFrequency as
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'rarely',
        shoppingTriggers: formData.selectedCategories,
        budgetingMethod: formData.reviewFrequency,
        financialConfidenceScore: Number(formData.financialConfidenceScore) || 0,
        biggestFinancialConcern: formData.biggestFinancialConcern,
      },
    };
  };

  const handleSubmitAssessment = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    const assessmentResponses = buildAssessmentProfile();
    const goal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name: formData.primaryGoal || 'Build stronger savings',
      target: Number(formData.monthlySpendingTarget) * 6 || 0,
      current: 0,
      deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitMessage('Generating your financial profile...');

    try {
      await submitFinancialAssessment({
        assessmentResponses,
        goals: [goal],
        preferences: {
          theme: 'system',
          currency: 'USD',
          showImpulseInsights: true,
        },
      });

      setSubmitMessage('Your premium dashboard is ready. Redirecting now...');
      window.setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (error) {
      console.error('Assessment submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Unable to complete assessment.');
      setSubmitMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep === steps.length - 1) {
      await handleSubmitAssessment();
      return;
    }

    setStepError('');
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setStepError('');
    setSubmitError('');
    setSubmitMessage('');
    setCurrentStep((step) => Math.max(step - 1, 0));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-zinc-900 dark:text-white" />
            <span className="text-xl font-semibold text-zinc-900 dark:text-white">Mindful Spend</span>
          </Link>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Step {currentStep + 1} of {steps.length}</div>
        </div>
      </div>

      <div className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-8 space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Financial onboarding</p>
              <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">Build your profile with confidence</h1>
              <p className="max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
                We guide you through a short setup so your dashboard is shaped by your goals, budget, and financial profile.
              </p>
            </div>

            <div className="space-y-8">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {stepCards.slice(0, 2).map((card) => (
                      <div key={card.title} className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="font-semibold text-zinc-900 dark:text-white">{card.title}</h2>
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{card.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">What to expect</h2>
                    <ul className="mt-4 space-y-3 text-zinc-600 dark:text-zinc-400">
                      <li>• A secure onboarding experience that respects your privacy.</li>
                      <li>• AI-generated insights after you complete the assessment.</li>
                      <li>• A premium dashboard built from your goals and budget profile.</li>
                    </ul>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">Primary financial goal</label>
                    <input
                      type="text"
                      value={formData.primaryGoal}
                      onChange={(event) => handleFormChange('primaryGoal', event.target.value)}
                      placeholder="Save more, reduce debt, build an emergency fund..."
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    />
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">What matters most?</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {['Save more', 'Cut spending', 'Build emergency fund', 'Plan a purchase'].map((option) => {
                        const active = formData.priority === option;
                        return (
                          <button
                            type="button"
                            key={option}
                            onClick={() => handleFormChange('priority', option)}
                            className={`rounded-2xl border px-4 py-3 text-left transition ${
                              active
                                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white/10'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                            }`}
                          >
                            <span className="font-medium">{option}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">How often will you review this plan?</label>
                    <select
                      value={formData.reviewFrequency}
                      onChange={(event) => handleFormChange('reviewFrequency', event.target.value)}
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    >
                      {['daily', 'weekly', 'monthly', 'quarterly'].map((option) => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                        Monthly take-home income
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={formData.monthlyIncome}
                          onChange={(event) => handleFormChange('monthlyIncome', event.target.value)}
                          placeholder="e.g. 4500"
                          className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                        />
                      </label>
                      <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                        Target monthly spending
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={formData.monthlySpendingTarget}
                          onChange={(event) => handleFormChange('monthlySpendingTarget', event.target.value)}
                          placeholder="e.g. 3200"
                          className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">Spending areas to watch</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {onboardingCategories.map((category) => {
                        const selected = formData.selectedCategories.includes(category);
                        return (
                          <button
                            type="button"
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`rounded-2xl border px-4 py-3 text-left transition ${
                              selected
                                ? 'border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white/10'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300'
                            }`}
                          >
                            {category}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Final assessment details</h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                      Share a few final details so we can create a complete profile tailored to your situation.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                      Current savings
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.currentSavings}
                        onChange={(event) => handleFormChange('currentSavings', event.target.value)}
                        placeholder="e.g. 1200"
                        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                      />
                    </label>
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                      Emergency fund amount
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.emergencyFund}
                        onChange={(event) => handleFormChange('emergencyFund', event.target.value)}
                        placeholder="e.g. 500"
                        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                      Credit card debt
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.creditCardDebt}
                        onChange={(event) => handleFormChange('creditCardDebt', event.target.value)}
                        placeholder="e.g. 3000"
                        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                      />
                    </label>
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">
                      Monthly debt payments
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.averageMonthlyDebtPayments}
                        onChange={(event) => handleFormChange('averageMonthlyDebtPayments', event.target.value)}
                        placeholder="e.g. 250"
                        className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                      />
                    </label>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">How confident do you feel about your finances?</p>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formData.financialConfidenceScore}
                      onChange={(event) => handleFormChange('financialConfidenceScore', event.target.value)}
                      className="mt-4 w-full"
                    />
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{formData.financialConfidenceScore} / 10</p>
                  </div>

                  <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950">
                    <label className="block text-sm font-medium text-zinc-900 dark:text-white">Biggest financial concern</label>
                    <input
                      type="text"
                      value={formData.biggestFinancialConcern}
                      onChange={(event) => handleFormChange('biggestFinancialConcern', event.target.value)}
                      placeholder="e.g. emergency savings, debt, cash flow..."
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {stepError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                {stepError}
              </div>
            )}

            {submitError && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                {submitError}
              </div>
            )}

            {submitMessage && (
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                {submitMessage}
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:border-white dark:hover:text-white"
                  >
                    Back
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {currentStep === steps.length - 1 ? (isSubmitting ? 'Submitting...' : 'Submit assessment') : 'Continue'}
              </button>
            </div>
          </div>

          <ProgressIndicator currentStep={currentStep} steps={steps} />
        </div>
      </div>
    </div>
  );
}
