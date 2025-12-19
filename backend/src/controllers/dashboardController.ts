import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';
import Goal from '../models/Goal';
import { generateInsights } from '../services/aiInsightsService';

// @desc    Get dashboard summary data
// @route   GET /api/dashboard/summary
// @access  Private
export const getDashboardSummary = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const userId = req.user?.id;

        // Get current month's date range
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Fetch this month's transactions
        const monthlyTransactions = await Transaction.find({
            userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });

        // Calculate monthly totals
        let monthlyIncome = 0;
        let monthlyExpense = 0;

        monthlyTransactions.forEach((t) => {
            if (t.type === 'income') {
                monthlyIncome += t.amount;
            } else {
                monthlyExpense += Math.abs(t.amount);
            }
        });

        const totalSaved = monthlyIncome - monthlyExpense;

        // Category breakdown (expenses only)
        const categoryMap: { [key: string]: number } = {};
        monthlyTransactions.forEach((t) => {
            if (t.type === 'expense') {
                categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
            }
        });

        // Convert to array format for charts
        const categoryBreakdown = Object.entries(categoryMap).map(([name, value], index) => {
            const colors = ['#10B981', '#3B82F6', '#6D28D9', '#F59E0B', '#EF4444', '#8B5CF6'];
            return {
                name,
                value,
                color: colors[index % colors.length],
            };
        });

        // Get active goals
        const goals = await Goal.find({ userId, status: 'active' });
        const goalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

        // Get recent transactions (all time, limited to 10)
        const recentTransactions = await Transaction.find({ userId })
            .sort({ date: -1, createdAt: -1 })
            .limit(10)
            .lean();

        // Format recent transactions
        const formattedTransactions = recentTransactions.map((t) => ({
            id: t._id,
            description: t.description,
            category: t.category,
            amount: t.type === 'expense' ? -Math.abs(t.amount) : t.amount,
            date: t.date,
            type: t.type,
            note: t.note,
            paymentMethod: t.paymentMethod,
        }));

        // Generate AI insights
        const aiInsights = await generateInsights(userId!);

        // Prepare response
        const dashboardData = {
            monthlyTotalSpent: monthlyExpense,
            monthlyIncome,
            totalSaved,
            goalTarget,
            categoryBreakdown,
            aiInsights: aiInsights.length > 0 ? aiInsights : ['Track more transactions to get personalized insights!'],
            recentTransactions: formattedTransactions,
        };

        res.status(200).json(dashboardData);
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json({ message: 'Server error while fetching dashboard data' });
    }
};
