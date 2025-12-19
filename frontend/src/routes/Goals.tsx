import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import GoalForm from '../components/GoalForm';
import EmptyState from '../components/EmptyState';
import { Target, TrendingUp, Calendar, Edit2, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import * as api from '../services/api';
import { showSuccess, showError } from '../utils/toast';

const Goals = () => {
    const [goals, setGoals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState<any>(null);

    const fetchGoals = async () => {
        try {
            setIsLoading(true);
            const data = await api.getGoals();
            setGoals(data || []);
        } catch (error: any) {
            console.error('Failed to fetch goals:', error);
            showError(error.message || 'Failed to load goals');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleCreateGoal = async (goal: api.Goal) => {
        try {
            await api.createGoal(goal);
            showSuccess('Goal created successfully!');
            fetchGoals();
        } catch (error: any) {
            showError(error.message || 'Failed to create goal');
            throw error;
        }
    };

    const handleUpdateGoal = async (goal: api.Goal) => {
        try {
            if (!editingGoal) return;
            await api.updateGoal(editingGoal.id, goal);
            showSuccess('Goal updated successfully!');
            setEditingGoal(null);
            fetchGoals();
        } catch (error: any) {
            showError(error.message || 'Failed to update goal');
            throw error;
        }
    };

    const handleDeleteGoal = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this goal?')) return;

        try {
            await api.deleteGoal(id);
            showSuccess('Goal deleted successfully!');
            fetchGoals();
        } catch (error: any) {
            showError(error.message || 'Failed to delete goal');
        }
    };

    const handleEdit = (goal: any) => {
        setEditingGoal(goal);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingGoal(null);
    };

    const getGoalStatus = (goal: any) => {
        const progress = goal.progress || 0;
        const daysLeft = goal.daysLeft || 0;
        const timeProgress = daysLeft > 0 ? 100 - (daysLeft / 180) * 100 : 100; // Assume 6 months max

        if (progress >= 100) {
            return { text: 'Completed', color: 'text-green-600', icon: CheckCircle, bgColor: 'bg-green-100' };
        } else if (progress >= timeProgress - 20) {
            return { text: 'On Track', color: 'text-green-600', icon: TrendingUp, bgColor: 'bg-green-100' };
        } else {
            return { text: 'At Risk', color: 'text-orange-600', icon: AlertCircle, bgColor: 'bg-orange-100' };
        }
    };

    const getGoalColor = (goalType: string) => {
        switch (goalType) {
            case 'emergency':
                return 'from-red-500 to-orange-500';
            case 'investment':
                return 'from-purple-600 to-blue-600';
            case 'saving':
            default:
                return 'from-green-primary to-blue-primary';
        }
    };

    return (
        <div className="flex h-screen bg-bg-light">
            <Sidebar />

            <div className="flex-1 ml-64 overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-navy to-purple-primary text-white py-8 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">Savings Goals</h1>
                                <p className="text-blue-soft">Track your financial goals and progress</p>
                            </div>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-primary to-blue-primary rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                <Target size={20} />
                                <span>Add New Goal</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {isLoading ? (
                        <div className="text-center py-12 text-text-muted">Loading goals...</div>
                    ) : goals.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <EmptyState
                                icon={Target}
                                title="No goals yet"
                                description="Set your first financial goal to start tracking your progress and stay motivated"
                                actionButton={
                                    <button
                                        onClick={() => setIsFormOpen(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-green-primary to-blue-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                    >
                                        Create Your First Goal
                                    </button>
                                }
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {goals.map((goal) => {
                                const status = getGoalStatus(goal);
                                const StatusIcon = status.icon;
                                const colorClass = getGoalColor(goal.goal_type);

                                return (
                                    <div
                                        key={goal.id}
                                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow relative"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                                                <Target className="text-white" size={24} />
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(goal)}
                                                    className="p-2 text-blue-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-text-main mb-1">
                                            {goal.goal_name}
                                        </h3>
                                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 capitalize mb-4">
                                            {goal.goal_type}
                                        </span>

                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="text-text-muted">Progress</span>
                                                <span className="font-semibold text-green-primary">
                                                    {Math.min(goal.progress || 0, 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-500`}
                                                    style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-sm text-text-muted">Saved</p>
                                                <p className="text-lg font-bold text-text-main">
                                                    ₹{goal.current_amount.toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-text-muted">Target</p>
                                                <p className="text-lg font-bold text-text-main">
                                                    ₹{goal.target_amount.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-border-subtle">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center text-sm text-text-muted">
                                                    <Calendar size={16} className="mr-1" />
                                                    <span>
                                                        {goal.daysLeft > 0 ? `${goal.daysLeft} days left` : 'Deadline passed'}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center text-sm ${status.color}`}>
                                                    <StatusIcon size={16} className="mr-1" />
                                                    <span className="font-semibold">{status.text}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Goal Form Modal */}
            <GoalForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
                initialData={editingGoal}
            />
        </div>
    );
};

export default Goals;
