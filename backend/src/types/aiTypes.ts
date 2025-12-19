// Type definitions for AI Financial Analysis

export interface Transaction {
    id?: string;
    user_id?: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    note?: string;
    payment_method?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Goal {
    id?: string;
    user_id?: string;
    goal_name: string;
    target_amount: number;
    current_amount: number;
    deadline: string;
    goal_type: 'saving' | 'emergency' | 'investment';
    status: 'active' | 'completed' | 'cancelled';
    created_at?: string;
    updated_at?: string;
}

export interface AnalysisInput {
    transactions: Transaction[];
    goals?: Goal[];
}

export interface FinancialSummary {
    totalIncome: number;
    totalExpenses: number;
    netSavings: number;
    savingsRate: number;
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
}

export interface SpendingPattern {
    topCategories: CategoryBreakdown[];
    categoryDistribution: { [key: string]: number };
    highSpendDays: { date: string; amount: number }[];
    anomalies: string[];
}

export interface BehavioralInsight {
    weekendVsWeekday: { weekend: number; weekday: number; weekendPercentage: number };
    monthlyPattern: { startOfMonth: number; endOfMonth: number };
    preferredPaymentMethods: { method: string; count: number; percentage: number }[];
    recurringExpenses: { category: string; frequency: string; averageAmount: number }[];
}

export interface GoalImpact {
    goalName: string;
    currentProgress: number;
    predictedCompletionDate: string;
    riskLevel: 'On Track' | 'At Risk' | 'Off Track';
    monthlyRequirement: number;
    currentMonthlySavings: number;
}

export interface PredictiveInsight {
    endOfMonthSavings: number;
    expenseTrend: 'Increasing' | 'Decreasing' | 'Stable';
    budgetOverrunRisk: boolean;
    trendPercentage: number;
}

export interface InsightsResponse {
    summary: string;
    keyInsights: string[];
    risks: string[];
    smartSuggestions: string[];
    dataQualityIssues?: string[];
}

export interface CSVColumnMapping {
    dateColumn?: string;
    categoryColumn?: string;
    amountColumn?: string;
    typeColumn?: string;
    descriptionColumn?: string;
    paymentMethodColumn?: string;
}

export interface DataQualityReport {
    issues: string[];
    missingColumns: string[];
    rowsWithErrors: number;
    totalRows: number;
}
