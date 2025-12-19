import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TransactionModal from '../components/TransactionModal';
import EmptyState from '../components/EmptyState';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2, Receipt } from 'lucide-react';
import * as api from '../services/api';
import { showSuccess, showError } from '../utils/toast';

const Transactions = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<any>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const fetchTransactions = async () => {
        try {
            setIsLoading(true);
            const filters: any = {};
            if (filterType !== 'all') filters.type = filterType;
            if (filterCategory !== 'all') filters.category = filterCategory;

            const response = await api.getTransactions(filters);
            setTransactions(response.transactions || []);
        } catch (error: any) {
            console.error('Failed to fetch transactions:', error);
            showError(error.message || 'Failed to load transactions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filterType, filterCategory]);

    const handleAddTransaction = async (transaction: api.Transaction) => {
        try {
            await api.createTransaction(transaction);
            showSuccess('Transaction added successfully!');
            fetchTransactions();
        } catch (error: any) {
            showError(error.message || 'Failed to add transaction');
            throw error;
        }
    };

    const handleUpdateTransaction = async (transaction: api.Transaction) => {
        try {
            if (!editingTransaction) return;
            await api.updateTransaction(editingTransaction.id, transaction);
            showSuccess('Transaction updated successfully!');
            setEditingTransaction(null);
            fetchTransactions();
        } catch (error: any) {
            showError(error.message || 'Failed to update transaction');
            throw error;
        }
    };

    const handleDeleteTransaction = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await api.deleteTransaction(id);
            showSuccess('Transaction deleted successfully!');
            fetchTransactions();
        } catch (error: any) {
            showError(error.message || 'Failed to delete transaction');
        }
    };

    const handleEdit = (transaction: any) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
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
                                <h1 className="text-3xl font-bold mb-2">Transactions</h1>
                                <p className="text-blue-soft">Manage your income and expenses</p>
                            </div>
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

                {/* Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">
                                    Type
                                </label>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none"
                                >
                                    <option value="all">All Types</option>
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-main mb-2">
                                    Category
                                </label>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="px-4 py-2 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none"
                                >
                                    <option value="all">All Categories</option>
                                    <option value="Food">Food</option>
                                    <option value="Bills">Bills</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Education">Education</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>
                        </div>

                        {/* Transactions List */}
                        {isLoading ? (
                            <div className="text-center py-12 text-text-muted">Loading transactions...</div>
                        ) : transactions.length === 0 ? (
                            <EmptyState
                                icon={Receipt}
                                title="No transactions yet"
                                description="Start tracking your finances by adding your first transaction"
                                actionButton={
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-green-primary to-blue-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                                    >
                                        Add Transaction
                                    </button>
                                }
                            />
                        ) : (
                            <div className="space-y-3">
                                {transactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4 flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                                                }`}>
                                                {transaction.type === 'expense' ? (
                                                    <TrendingDown className="text-red-600" size={24} />
                                                ) : (
                                                    <TrendingUp className="text-green-600" size={24} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-text-main text-lg">
                                                    {transaction.description}
                                                </p>
                                                <div className="flex items-center space-x-4 text-sm text-text-muted">
                                                    <span className="px-2 py-1 bg-white rounded-md border border-border-subtle">
                                                        {transaction.category}
                                                    </span>
                                                    {transaction.payment_method && (
                                                        <span className="capitalize">{transaction.payment_method}</span>
                                                    )}
                                                    <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                                </div>
                                                {transaction.note && (
                                                    <p className="text-sm text-text-muted mt-1">{transaction.note}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className={`text-2xl font-bold ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                                    }`}>
                                                    {transaction.type === 'expense' ? '-' : '+'}₹{Math.abs(transaction.amount).toLocaleString()}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(transaction)}
                                                    className="p-2 text-blue-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTransaction(transaction.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Transaction Modal */}
            <TransactionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                initialData={editingTransaction}
            />
        </div>
    );
};

export default Transactions;
