import {
    Transaction,
    Goal,
    AnalysisInput,
    FinancialSummary,
    SpendingPattern,
    BehavioralInsight,
    GoalImpact,
    PredictiveInsight,
    InsightsResponse,
    CategoryBreakdown
} from '../types/aiTypes';

/**
 * Comprehensive AI Financial Analysis Engine
 * Rule-based intelligent analysis - no external LLM APIs
 */

/**
 * 1. FINANCIAL SUMMARY
 */
export function generateFinancialSummary(transactions: Transaction[]): FinancialSummary {
    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
        const amount = Math.abs(parseFloat(t.amount.toString()));
        if (t.type === 'income') {
            totalIncome += amount;
        } else {
            totalExpenses += amount;
        }
    });

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    return {
        totalIncome,
        totalExpenses,
        netSavings,
        savingsRate
    };
}

/**
 * 2. SPENDING PATTERNS ANALYSIS
 */
export function analyzeSpendingPatterns(transactions: Transaction[]): SpendingPattern {
    const categoryTotals: { [key: string]: number } = {};
    const dailyTotals: { [key: string]: number } = {};
    let totalExpense = 0;

    // Calculate category and daily totals
    transactions.forEach(t => {
        if (t.type === 'expense') {
            const amount = Math.abs(parseFloat(t.amount.toString()));
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + amount;
            dailyTotals[t.date] = (dailyTotals[t.date] || 0) + amount;
            totalExpense += amount;
        }
    });

    // Top 3 categories
    const topCategories: CategoryBreakdown[] = Object.entries(categoryTotals)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);

    // High spend days (top 5)
    const highSpendDays = Object.entries(dailyTotals)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

    // Detect anomalies (days with spending > 2x average)
    const avgDailySpend = totalExpense / Object.keys(dailyTotals).length;
    const anomalies: string[] = [];

    Object.entries(dailyTotals).forEach(([date, amount]) => {
        if (amount > avgDailySpend * 2) {
            anomalies.push(`High spending on ${date}: ₹${amount.toLocaleString()} (${((amount / avgDailySpend) * 100).toFixed(0)}% above average)`);
        }
    });

    return {
        topCategories,
        categoryDistribution: categoryTotals,
        highSpendDays,
        anomalies
    };
}

/**
 * 3. BEHAVIORAL INSIGHTS
 */
export function analyzeBehavioralInsights(transactions: Transaction[]): BehavioralInsight {
    let weekendSpend = 0;
    let weekdaySpend = 0;
    let startOfMonthSpend = 0; // Days 1-10
    let endOfMonthSpend = 0;   // Days 21-31

    const paymentMethodCounts: { [key: string]: number } = {};
    const categoryFrequency: { [key: string]: number[] } = {};

    transactions.forEach(t => {
        const amount = t.type === 'expense' ? Math.abs(parseFloat(t.amount.toString())) : 0;
        const date = new Date(t.date);
        const dayOfWeek = date.getDay();
        const dayOfMonth = date.getDate();

        // Weekend vs Weekday
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendSpend += amount;
        } else {
            weekdaySpend += amount;
        }

        // Start vs End of month
        if (dayOfMonth <= 10) {
            startOfMonthSpend += amount;
        } else if (dayOfMonth >= 21) {
            endOfMonthSpend += amount;
        }

        // Payment methods
        if (t.payment_method) {
            paymentMethodCounts[t.payment_method] = (paymentMethodCounts[t.payment_method] || 0) + 1;
        }

        // Track category frequency for recurring detection
        if (t.type === 'expense') {
            if (!categoryFrequency[t.category]) {
                categoryFrequency[t.category] = [];
            }
            categoryFrequency[t.category].push(date.getTime());
        }
    });

    // Calculate percentages
    const totalSpend = weekendSpend + weekdaySpend;
    const weekendPercentage = totalSpend > 0 ? (weekendSpend / totalSpend) * 100 : 0;

    // Preferred payment methods
    const totalTransactions = Object.values(paymentMethodCounts).reduce((sum, count) => sum + count, 0);
    const preferredPaymentMethods = Object.entries(paymentMethodCounts)
        .map(([method, count]) => ({
            method,
            count,
            percentage: totalTransactions > 0 ? (count / totalTransactions) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count);

    // Detect recurring expenses (categories that appear regularly)
    const recurringExpenses: { category: string; frequency: string; averageAmount: number }[] = [];

    Object.entries(categoryFrequency).forEach(([category, timestamps]) => {
        if (timestamps.length >= 2) {
            // Calculate average days between transactions
            const sortedTimestamps = timestamps.sort((a, b) => a - b);
            const intervals: number[] = [];

            for (let i = 1; i < sortedTimestamps.length; i++) {
                intervals.push((sortedTimestamps[i] - sortedTimestamps[i - 1]) / (1000 * 60 * 60 * 24));
            }

            const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

            let frequency = 'Occasional';
            if (avgInterval <= 7) frequency = 'Weekly';
            else if (avgInterval <= 14) frequency = 'Bi-weekly';
            else if (avgInterval <= 31) frequency = 'Monthly';

            const categoryAmount = transactions
                .filter(t => t.category === category && t.type === 'expense')
                .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

            const avgAmount = categoryAmount / timestamps.length;

            if (frequency !== 'Occasional') {
                recurringExpenses.push({ category, frequency, averageAmount: avgAmount });
            }
        }
    });

    return {
        weekendVsWeekday: {
            weekend: weekendSpend,
            weekday: weekdaySpend,
            weekendPercentage
        },
        monthlyPattern: {
            startOfMonth: startOfMonthSpend,
            endOfMonth: endOfMonthSpend
        },
        preferredPaymentMethods,
        recurringExpenses
    };
}

/**
 * 4. GOAL IMPACT ANALYSIS
 */
export function analyzeGoalImpact(transactions: Transaction[], goals: Goal[]): GoalImpact[] {
    if (!goals || goals.length === 0) return [];

    const summary = generateFinancialSummary(transactions);
    const monthlySavings = summary.netSavings;

    return goals.map(goal => {
        const targetAmount = parseFloat(goal.target_amount.toString());
        const currentAmount = parseFloat(goal.current_amount.toString());
        const remaining = targetAmount - currentAmount;

        const deadline = new Date(goal.deadline);
        const now = new Date();
        const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const monthsLeft = daysLeft / 30;

        const currentProgress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
        const monthlyRequirement = monthsLeft > 0 ? remaining / monthsLeft : remaining;

        let riskLevel: 'On Track' | 'At Risk' | 'Off Track';
        let predictedCompletionDate: string;

        if (monthlySavings >= monthlyRequirement && monthlySavings > 0) {
            riskLevel = 'On Track';
            const monthsToComplete = remaining / monthlySavings;
            const completionDate = new Date();
            completionDate.setMonth(completionDate.getMonth() + monthsToComplete);
            predictedCompletionDate = completionDate.toISOString().split('T')[0];
        } else if (monthlySavings > 0) {
            riskLevel = 'At Risk';
            const monthsToComplete = remaining / monthlySavings;
            const completionDate = new Date();
            completionDate.setMonth(completionDate.getMonth() + monthsToComplete);
            predictedCompletionDate = completionDate.toISOString().split('T')[0];
        } else {
            riskLevel = 'Off Track';
            predictedCompletionDate = 'Unable to predict (currently not saving)';
        }

        return {
            goalName: goal.goal_name,
            currentProgress,
            predictedCompletionDate,
            riskLevel,
            monthlyRequirement,
            currentMonthlySavings: monthlySavings
        };
    });
}

/**
 * 5. PREDICTIVE INSIGHTS
 */
export function generatePredictiveInsights(transactions: Transaction[]): PredictiveInsight {
    const summary = generateFinancialSummary(transactions);

    // Calculate trend by comparing first half vs second half
    const sortedTransactions = [...transactions].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const midPoint = Math.floor(sortedTransactions.length / 2);
    const firstHalf = sortedTransactions.slice(0, midPoint);
    const secondHalf = sortedTransactions.slice(midPoint);

    const firstHalfExpense = firstHalf
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

    const secondHalfExpense = secondHalf
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount.toString())), 0);

    let expenseTrend: 'Increasing' | 'Decreasing' | 'Stable';
    let trendPercentage = 0;

    if (firstHalfExpense > 0) {
        trendPercentage = ((secondHalfExpense - firstHalfExpense) / firstHalfExpense) * 100;

        if (trendPercentage > 10) expenseTrend = 'Increasing';
        else if (trendPercentage < -10) expenseTrend = 'Decreasing';
        else expenseTrend = 'Stable';
    } else {
        expenseTrend = 'Stable';
    }

    // End of month savings forecast (extrapolate current savings rate)
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dayOfMonth = now.getDate();
    const daysLeft = daysInMonth - dayOfMonth;

    const dailySavings = summary.netSavings / dayOfMonth;
    const endOfMonthSavings = summary.netSavings + (dailySavings * daysLeft);

    // Budget overrun risk
    const budgetOverrunRisk = summary.savingsRate < 0 || expenseTrend === 'Increasing';

    return {
        endOfMonthSavings,
        expenseTrend,
        budgetOverrunRisk,
        trendPercentage
    };
}

/**
 * 6. SMART RECOMMENDATIONS
 */
export function generateSmartRecommendations(
    summary: FinancialSummary,
    patterns: SpendingPattern,
    behavioral: BehavioralInsight,
    goals: GoalImpact[],
    predictive: PredictiveInsight
): string[] {
    const recommendations: string[] = [];

    // Savings rate recommendations
    if (summary.savingsRate < 0) {
        recommendations.push(
            `You're spending more than you earn. Immediately reduce expenses in your top category (${patterns.topCategories[0]?.category}) by at least ₹${(patterns.topCategories[0]?.amount * 0.2).toLocaleString()} to break even.`
        );
    } else if (summary.savingsRate < 20) {
        const additionalSavingsNeeded = (summary.totalIncome * 0.2) - summary.netSavings;
        recommendations.push(
            `Increase your savings rate from ${summary.savingsRate.toFixed(1)}% to 20% by saving an additional ₹${additionalSavingsNeeded.toLocaleString()} per month.`
        );
    }

    // Category-specific recommendations
    if (patterns.topCategories[0] && patterns.topCategories[0].percentage > 40) {
        recommendations.push(
            `${patterns.topCategories[0].category} takes up ${patterns.topCategories[0].percentage.toFixed(0)}% of your spending. Look for cheaper alternatives or reduce frequency to save ₹${(patterns.topCategories[0].amount * 0.15).toLocaleString()} monthly.`
        );
    }

    // Behavioral recommendations
    if (behavioral.weekendVsWeekday.weekendPercentage > 50) {
        const potentialSavings = behavioral.weekendVsWeekday.weekend * 0.2;
        recommendations.push(
            `You spend ${behavioral.weekendVsWeekday.weekendPercentage.toFixed(0)}% of your money on weekends. Plan weekend activities in advance to save approximately ₹${potentialSavings.toLocaleString()} monthly.`
        );
    }

    // Goal-based recommendations
    goals.forEach(goal => {
        if (goal.riskLevel === 'At Risk') {
            const shortfall = goal.monthlyRequirement - goal.currentMonthlySavings;
            recommendations.push(
                `To reach "${goal.goalName}" on time, increase monthly savings by ₹${shortfall.toLocaleString()}. Consider automating this amount right after receiving income.`
            );
        } else if (goal.riskLevel === 'Off Track') {
            recommendations.push(
                `"${goal.goalName}" is off track. Start with small savings of ₹${(goal.monthlyRequirement * 0.5).toLocaleString()}/month and increase gradually.`
            );
        }
    });

    // Trend-based recommendations
    if (predictive.expenseTrend === 'Increasing' && predictive.trendPercentage > 20) {
        recommendations.push(
            `Your expenses are increasing by ${predictive.trendPercentage.toFixed(0)}%. Review recent purchases and set spending limits for the next two weeks to reverse this trend.`
        );
    }

    // Recurring expense optimization
    if (behavioral.recurringExpenses.length > 0) {
        const topRecurring = behavioral.recurringExpenses.sort((a, b) => b.averageAmount - a.averageAmount)[0];
        recommendations.push(
            `You have ${behavioral.recurringExpenses.length} recurring expenses. Review "${topRecurring.category}" (${topRecurring.frequency}, ₹${topRecurring.averageAmount.toLocaleString()}) for potential subscription savings or plan downgrades.`
        );
    }

    // Ensure at least 3 recommendations
    if (recommendations.length === 0) {
        recommendations.push(
            'Set up automated savings transfers for 20% of your income immediately after receiving it.',
            'Track daily expenses using this app to identify unnecessary spending patterns.',
            'Create an emergency fund goal equal to 6 months of expenses for financial security.'
        );
    } else if (recommendations.length < 3) {
        recommendations.push('Create specific financial goals to stay motivated and track your progress effectively.');
    }

    return recommendations.slice(0, 5); // Maximum 5 recommendations
}

/**
 * 7. FORMAT OUTPUT
 */
export function formatInsightsOutput(
    summary: FinancialSummary,
    patterns: SpendingPattern,
    behavioral: BehavioralInsight,
    goals: GoalImpact[],
    predictive: PredictiveInsight,
    recommendations: string[],
    dataQualityIssues?: string[]
): InsightsResponse {
    // Generate summary text
    const summaryText = summary.savingsRate >= 20
        ? `Your financial health is strong with a ${summary.savingsRate.toFixed(1)}% savings rate. You saved ₹${summary.netSavings.toLocaleString()} from ₹${summary.totalIncome.toLocaleString()} income after spending ₹${summary.totalExpenses.toLocaleString()}.`
        : summary.savingsRate >= 0
            ? `You're saving ${summary.savingsRate.toFixed(1)}% of your income (₹${summary.netSavings.toLocaleString()}), but there's room for improvement. Your income is ₹${summary.totalIncome.toLocaleString()} and expenses are ₹${summary.totalExpenses.toLocaleString()}.`
            : `Alert: You're overspending by ₹${Math.abs(summary.netSavings).toLocaleString()}. Your expenses (₹${summary.totalExpenses.toLocaleString()}) exceed your income (₹${summary.totalIncome.toLocaleString()}) by ${Math.abs(summary.savingsRate).toFixed(1)}%.`;

    // Generate key insights
    const keyInsights: string[] = [];

    // Top spending categories
    if (patterns.topCategories.length > 0) {
        const top3 = patterns.topCategories
            .map(c => `${c.category} (₹${c.amount.toLocaleString()}, ${c.percentage.toFixed(1)}%)`)
            .join(', ');
        keyInsights.push(`Top spending categories: ${top3}`);
    }

    // Behavioral patterns
    if (behavioral.weekendVsWeekday.weekendPercentage > 0) {
        keyInsights.push(
            `Weekend spending is ${behavioral.weekendVsWeekday.weekendPercentage.toFixed(0)}% of total expenses (₹${behavioral.weekendVsWeekday.weekend.toLocaleString()})`
        );
    }

    if (behavioral.preferredPaymentMethods.length > 0) {
        const topMethod = behavioral.preferredPaymentMethods[0];
        keyInsights.push(
            `Most used payment method: ${topMethod.method} (${topMethod.percentage.toFixed(0)}% of transactions)`
        );
    }

    // Predictive insights
    keyInsights.push(
        `Expense trend: ${predictive.expenseTrend}${predictive.trendPercentage !== 0 ? ` (${predictive.trendPercentage > 0 ? '+' : ''}${predictive.trendPercentage.toFixed(1)}%)` : ''}`
    );

    if (predictive.endOfMonthSavings !== summary.netSavings) {
        keyInsights.push(
            `Projected end-of-month savings: ₹${predictive.endOfMonthSavings.toLocaleString()}`
        );
    }

    // Goal progress
    goals.forEach(goal => {
        keyInsights.push(
            `"${goal.goalName}": ${goal.currentProgress.toFixed(0)}% complete, ${goal.riskLevel}`
        );
    });

    // Generate risks
    const risks: string[] = [];

    if (summary.savingsRate < 0) {
        risks.push('Critical: Overspending detected - expenses exceed income');
    }

    if (predictive.budgetOverrunRisk && summary.savingsRate >= 0) {
        risks.push('Budget overrun risk - expenses are trending upward');
    }

    if (patterns.anomalies.length > 0) {
        risks.push(`${patterns.anomalies.length} unusual high-spend day(s) detected`);
    }

    goals.forEach(goal => {
        if (goal.riskLevel === 'Off Track') {
            risks.push(`Goal "${goal.goalName}" is off track - not currently saving enough`);
        } else if (goal.riskLevel === 'At Risk') {
            risks.push(`Goal "${goal.goalName}" is at risk - need ₹${(goal.monthlyRequirement - goal.currentMonthlySavings).toLocaleString()} more per month`);
        }
    });

    if (risks.length === 0) {
        risks.push('No major risks detected');
    }

    return {
        summary: summaryText,
        keyInsights,
        risks,
        smartSuggestions: recommendations,
        dataQualityIssues
    };
}

/**
 * MAIN ANALYSIS FUNCTION
 */
export function analyzeTransactions(
    transactions: Transaction[],
    goals?: Goal[],
    dataQualityIssues?: string[]
): InsightsResponse {
    if (transactions.length === 0) {
        return {
            summary: 'No transaction data available for analysis.',
            keyInsights: ['Add transactions to get personalized financial insights'],
            risks: ['No data to analyze'],
            smartSuggestions: [
                'Start tracking your daily expenses to understand spending patterns',
                'Add both income and expense transactions for accurate analysis',
                'Set financial goals to stay motivated'
            ],
            dataQualityIssues
        };
    }

    const summary = generateFinancialSummary(transactions);
    const patterns = analyzeSpendingPatterns(transactions);
    const behavioral = analyzeBehavioralInsights(transactions);
    const goalImpacts = goals ? analyzeGoalImpact(transactions, goals) : [];
    const predictive = generatePredictiveInsights(transactions);
    const recommendations = generateSmartRecommendations(
        summary,
        patterns,
        behavioral,
        goalImpacts,
        predictive
    );

    return formatInsightsOutput(
        summary,
        patterns,
        behavioral,
        goalImpacts,
        predictive,
        recommendations,
        dataQualityIssues
    );
}
