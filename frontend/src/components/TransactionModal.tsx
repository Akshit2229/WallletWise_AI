import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Transaction } from '../services/api';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (transaction: Transaction) => Promise<void>;
    initialData?: Transaction;
}

const TransactionModal = ({ isOpen, onClose, onSubmit, initialData }: TransactionModalProps) => {
    const [formData, setFormData] = useState<Transaction>({
        type: 'expense',
        amount: 0,
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
        note: '',
        payment_method: 'cash',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: initialData.date.split('T')[0],
            });
        } else {
            setFormData({
                type: 'expense',
                amount: 0,
                category: 'Food',
                description: '',
                date: new Date().toISOString().split('T')[0],
                note: '',
                payment_method: 'cash',
            });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'amount' ? parseFloat(value) || 0 : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-text-main mb-6">
                    {initialData ? 'Edit Transaction' : 'Add Transaction'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-2">
                            Description *
                        </label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            placeholder="e.g., Grocery Shopping"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Type *
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Amount (₹) *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                                placeholder="1000"
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            >
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

                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Payment Method
                            </label>
                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                                <option value="netbanking">Net Banking</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-2">
                            Note
                        </label>
                        <textarea
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all resize-none"
                            placeholder="Add any additional notes..."
                            rows={3}
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-border-subtle text-text-main rounded-lg font-semibold hover:bg-gray-50 transition-all"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-primary to-blue-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add Transaction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
