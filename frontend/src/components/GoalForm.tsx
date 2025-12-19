import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Goal } from '../services/api';

interface GoalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (goal: Goal) => Promise<void>;
    initialData?: any;
}

const GoalForm = ({ isOpen, onClose, onSubmit, initialData }: GoalFormProps) => {
    const [formData, setFormData] = useState<Goal>({
        goal_name: '',
        target_amount: 0,
        current_amount: 0,
        deadline: '',
        goal_type: 'saving',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                goal_name: initialData.goal_name,
                target_amount: initialData.target_amount,
                current_amount: initialData.current_amount,
                deadline: new Date(initialData.deadline).toISOString().split('T')[0],
                goal_type: initialData.goal_type,
            });
        } else {
            setFormData({
                goal_name: '',
                target_amount: 0,
                current_amount: 0,
                deadline: '',
                goal_type: 'saving',
            });
        }
    }, [initialData, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'target_amount' || name === 'current_amount' ? parseFloat(value) || 0 : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting goal:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold text-text-main mb-6">
                    {initialData ? 'Edit Goal' : 'Add New Goal'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-2">
                            Goal Name *
                        </label>
                        <input
                            type="text"
                            name="goal_name"
                            value={formData.goal_name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            placeholder="e.g., Emergency Fund"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Target Amount (₹) *
                            </label>
                            <input
                                type="number"
                                name="target_amount"
                                value={formData.target_amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                                placeholder="50000"
                                required
                                min="0"
                                step="100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Current Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="current_amount"
                                value={formData.current_amount}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                                placeholder="0"
                                min="0"
                                step="100"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Goal Type *
                            </label>
                            <select
                                name="goal_type"
                                value={formData.goal_type}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                            >
                                <option value="saving">Saving</option>
                                <option value="emergency">Emergency</option>
                                <option value="investment">Investment</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-2">
                                Deadline *
                            </label>
                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-border-subtle focus:border-blue-primary focus:ring-2 focus:ring-blue-primary/20 outline-none transition-all"
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
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
                            {isSubmitting ? 'Saving...' : initialData ? 'Update Goal' : 'Create Goal'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GoalForm;
