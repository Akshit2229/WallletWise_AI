import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChartCard from '../components/ChartCard';
import TransactionModal from '../components/TransactionModal';
import AIInsightsDisplay from '../components/AIInsightsDisplay';
import CSVUploadModal from '../components/CSVUploadModal';
import { Sparkles, TrendingUp, TrendingDown, Plus, FileUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import * as api from '../services/api';
import { showSuccess, showError } from '../utils/toast';

interface Transaction {
    id: string;
    description: string;
    category: string;
    amount: number;
    date: string;
    type: string;
}

interface DashboardData {
    monthlyTotalSpent: number;
    monthlyIncome: number;
    totalSaved: number;
    goalTarget: number;
    categoryBreakdown: { name: string; value: number; color: string }[];
    aiInsights: api.AIInsights | null;
    recentTransactions: Transaction[];
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const data = await api.getDashboardSummary();
            setDashboardData(data);
        } catch (error: any) {
            console.error('Failed to fetch dashboard data:', error);
            showError(error.message || 'Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleAddTransaction = async (transaction: api.Transaction) => {
        try {
            await api.createTransaction(transaction);
            showSuccess('Transaction added successfully!');
            fetchDashboardData(); // Refresh dashboard
        } catch (error: any) {
            showError(error.message || 'Failed to add transaction');
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 ml-64 flex items-center justify-center">
                    <div className="text-xl font-semibold text-text-muted">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    const goalProgress = dashboardData && dashboardData.goalTarget > 0
        ? (dashboardData.totalSaved / dashboardData.goalTarget) * 100
        : 0;

    return (
        <div className="flex h-screen bg-bg-light">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-64 overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-navy to-purple-primary text-white py-8 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Welcome to Your Dashboard 👋
                                </h1>
                                <p className="text-blue-soft">
                                    Here's your financial overview
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-neon-mint/30">
                                    <div className="w-2 h-2 bg-neon-mint rounded-full animate-pulse-glow"></div>
                                    <span className="text-sm font-semibold text-neon-mint">
                                        AI agent: Active
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsCSVModalOpen(true)}
                                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    <FileUp size={20} />
                                    <span>Upload CSV</span>
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-primary to-blue-primary rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                                >
                                    <Plus size={20} />
                                    <span>Add Transaction</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Monthly Overview Card */}
                        <ChartCard title="Monthly Overview" className="lg:col-span-2">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-text-muted text-sm mb-1">Total Spent This Month</p>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl font-bold text-text-main">
                                            ₹{dashboardData?.monthlyTotalSpent.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
                                    <div>
                                        <p className="text-text-muted text-sm mb-1">Income</p>
                                        <p className="text-2xl font-bold text-green-primary">
                                            ₹{dashboardData?.monthlyIncome.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-sm mb-1">Saved</p>
                                        <p className="text-2xl font-bold text-blue-primary">
                                            ₹{dashboardData?.totalSaved.toLocaleString() || '0'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ChartCard>

                        {/* Category Chart Card */}
                        <ChartCard title="Where your money goes">
                            {dashboardData?.categoryBreakdown && dashboardData.categoryBreakdown.length > 0 ? (
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={dashboardData.categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {dashboardData.categoryBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            verticalAlign="bottom"
                                            height={36}
                                            formatter={(value) => <span className="text-sm">{value}</span>}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-48 flex items-center justify-center text-text-muted">
                                    No expense data yet
                                </div>
                            )}
                        </ChartCard>

                        {/* AI Insights - Full Width */}
                        <div className="lg:col-span-3">
                            {dashboardData?.aiInsights ? (
                                <AIInsightsDisplay insights={dashboardData.aiInsights} loading={false} />
                            ) : (
                                <AIInsightsDisplay
                                    insights={{
                                        summary: 'Loading insights...',
                                        keyInsights: [],
                                        risks: [],
                                        smartSuggestions: []
                                    }}
                                    loading={true}
                                />
                            )}
                        </div>

                        {/* Goals Card */}
                        <ChartCard title="Savings Goal">
                            <div className="space-y-4">
                                {dashboardData && dashboardData.goalTarget > 0 ? (
                                    <>
                                        <div>
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-text-muted">Progress</span>
                                                <span className="font-semibold text-green-primary">
                                                    {goalProgress.toFixed(0)}% complete
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-primary to-blue-primary h-3 rounded-full transition-all duration-500"
                                                    style={{ width: `${Math.min(goalProgress, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-border-subtle">
                                            <p className="text-text-muted text-sm">
                                                <span className="font-semibold text-text-main">
                                                    ₹{dashboardData.totalSaved.toLocaleString()}
                                                </span>
                                                {' '}of{' '}
                                                <span className="font-semibold text-text-main">
                                                    ₹{dashboardData.goalTarget.toLocaleString()}
                                                </span>
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-4 text-text-muted">
                                        No active goals. Visit Goals page to create one!
                                    </div>
                                )}
                            </div>
                        </ChartCard>

                        {/* Recent Transactions Card */}
                        <ChartCard title="Recent Transactions" className="lg:col-span-2">
                            {dashboardData?.recentTransactions && dashboardData.recentTransactions.length > 0 ? (
                                <div className="space-y-3">
                                    {dashboardData.recentTransactions.slice(0, 5).map((transaction, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'
                                                    }`}>
                                                    {transaction.amount < 0 ? (
                                                        <TrendingDown className="text-red-600" size={20} />
                                                    ) : (
                                                        <TrendingUp className="text-green-600" size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-text-main">
                                                        {transaction.description}
                                                    </p>
                                                    <p className="text-sm text-text-muted">
                                                        {transaction.category}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {transaction.amount < 0 ? '-' : '+'}₹{Math.abs(transaction.amount).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    {new Date(transaction.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-text-muted">
                                    No transactions yet. Click "Add Transaction" to get started!
                                </div>
                            )}
                        </ChartCard>
                    </div>
                </div>
            </div>

            {/* Add Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTransaction}
            />

            {/* CSV Upload Modal */}
            <CSVUploadModal
                isOpen={isCSVModalOpen}
                onClose={() => setIsCSVModalOpen(false)}
                onUploadComplete={fetchDashboardData}
            />
        </div>
    );
};

export default Dashboard;
