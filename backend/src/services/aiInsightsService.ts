import Transaction from '../models/Transaction';
import Goal from '../models/Goal';

interface Insight {
    message: string;
    type: 'info' | 'warning' | 'success';
}

/**
 * Generate AI-powered insights for a user based on their transactions and goals
 */
export const generateInsights = async (userId: string): Promise<string[]> => {
    try {
        const insights: Insight[] = [];

        // Get user's transactions from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const transactions = await Transaction.find({
            userId,
            date: { $gte: thirtyDaysAgo },
        });

        const goals = await Goal.find({
            userId,
            status: 'active',
        });

        // Generate insights
        const overspendingInsight = detectOverspending(transactions);
        if (overspendingInsight) insights.push(overspendingInsight);

        const goalInsights = predictGoalCompletion(goals, transactions);
        insights.push(...goalInsights);

        const suggestions = generateSuggestions(transactions, goals);
        insights.push(...suggestions);

        // Return just the messages
        return insights.map((i) => i.message);
    } catch (error) {
        console.error('Error generating insights:', error);
        return ['Unable to generate insights at this time. Please try again later.'];
    }
};

/**
 * Detect categories where user is overspending
 */
const detectOverspending = (transactions: any[]): Insight | null => {
    if (transactions.length === 0) return null;

    // Calculate category breakdown
    const categoryTotals: { [key: string]: number } = {};
    let totalExpense = 0;

    transactions.forEach((t) => {
        if (t.type === 'expense') {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
            totalExpense += Math.abs(t.amount);
        }
    });

    if (totalExpense === 0) return null;

    // Find the highest spending category
    let maxCategory = '';
    let maxAmount = 0;
    let maxPercentage = 0;

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        const percentage = (amount / totalExpense) * 100;
        if (percentage > maxPercentage) {
            maxCategory = category;
            maxAmount = amount;
            maxPercentage = percentage;
        }
    });

    // If any category is over 40%, flag it
    if (maxPercentage > 40) {
        return {
            message: `You spent ${maxPercentage.toFixed(0)}% (₹${maxAmount.toLocaleString()}) on ${maxCategory} this month. Consider reducing this category.`,
            type: 'warning',
        };
    } else if (maxPercentage > 25) {
        return {
            message: `${maxCategory} is your biggest expense at ${maxPercentage.toFixed(0)}% of your spending (₹${maxAmount.toLocaleString()}).`,
            type: 'info',
        };
    }

    return null;
};

/**
 * Predict if user will reach their goals based on current savings rate
 */
const predictGoalCompletion = (goals: any[], transactions: any[]): Insight[] => {
    const insights: Insight[] = [];

    if (goals.length === 0) return insights;

    // Calculate monthly savings rate
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const monthlySavings = income - expenses;

    goals.forEach((goal) => {
        const remaining = goal.targetAmount - goal.currentAmount;
        const daysLeft = Math.ceil(
            (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        const monthsLeft = daysLeft / 30;

        if (monthsLeft <= 0) {
            if (goal.currentAmount < goal.targetAmount) {
                insights.push({
                    message: `Your "${goal.goalName}" goal deadline has passed. You're ₹${remaining.toLocaleString()} away from your target.`,
                    type: 'warning',
                });
            }
            return;
        }

        const neededPerMonth = remaining / monthsLeft;

        if (monthlySavings >= neededPerMonth) {
            insights.push({
                message: `You're on track to reach "${goal.goalName}"! Keep saving ₹${neededPerMonth.toLocaleString()}/month.`,
                type: 'success',
            });
        } else if (monthlySavings > 0) {
            const additionalNeeded = neededPerMonth - monthlySavings;
            insights.push({
                message: `To reach "${goal.goalName}" on time, save ₹${additionalNeeded.toLocaleString()} more per month.`,
                type: 'warning',
            });
        } else {
            insights.push({
                message: `You're spending more than you earn. Start by reducing expenses to save for "${goal.goalName}".`,
                type: 'warning',
            });
        }
    });

    return insights;
};

/**
 * Generate actionable suggestions based on spending patterns
 */
const generateSuggestions = (transactions: any[], goals: any[]): Insight[] => {
    const insights: Insight[] = [];

    if (transactions.length === 0) {
        insights.push({
            message: 'Start tracking your expenses to get personalized insights!',
            type: 'info',
        });
        return insights;
    }

    // Calculate income vs expenses
    const income = transactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    // Saving rate suggestion
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    if (savingsRate < 20 && savingsRate > 0) {
        insights.push({
            message: `You're saving ${savingsRate.toFixed(0)}% of your income. Try to save at least 20% for a healthy financial future.`,
            type: 'info',
        });
    } else if (savingsRate >= 20) {
        insights.push({
            message: `Great job! You're saving ${savingsRate.toFixed(0)}% of your income. Keep it up!`,
            type: 'success',
        });
    }

    // Goal suggestions
    if (goals.length === 0 && income > expenses) {
        insights.push({
            message: "You're saving money! Set a financial goal to stay motivated and track your progress.",
            type: 'info',
        });
    }

    return insights;
};
