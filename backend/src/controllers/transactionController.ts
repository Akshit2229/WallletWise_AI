import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Transaction from '../models/Transaction';

// @desc    Create a new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { type, amount, category, description, date, note, paymentMethod } = req.body;

        // Validate required fields
        if (!type || !amount || !category || !description) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId: req.user?.id,
            type,
            amount,
            category,
            description,
            date: date || new Date(),
            note,
            paymentMethod,
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ message: 'Server error while creating transaction' });
    }
};

// @desc    Get all transactions for logged-in user
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { type, category, startDate, endDate, limit = 100, page = 1 } = req.query;

        // Build query filter
        const filter: any = { userId: req.user?.id };

        if (type) {
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) {
                filter.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                filter.date.$lte = new Date(endDate as string);
            }
        }

        // Calculate pagination
        const limitNum = parseInt(limit as string);
        const pageNum = parseInt(page as string);
        const skip = (pageNum - 1) * limitNum;

        // Fetch transactions
        const transactions = await Transaction.find(filter)
            .sort({ date: -1, createdAt: -1 })
            .limit(limitNum)
            .skip(skip);

        // Get total count for pagination
        const total = await Transaction.countDocuments(filter);

        res.status(200).json({
            transactions,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server error while fetching transactions' });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { type, amount, category, description, date, note, paymentMethod } = req.body;

        // Find transaction and verify ownership
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        // Verify user owns this transaction
        if (transaction.userId.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to update this transaction' });
            return;
        }

        // Update fields
        if (type !== undefined) transaction.type = type;
        if (amount !== undefined) transaction.amount = amount;
        if (category !== undefined) transaction.category = category;
        if (description !== undefined) transaction.description = description;
        if (date !== undefined) transaction.date = new Date(date);
        if (note !== undefined) transaction.note = note;
        if (paymentMethod !== undefined) transaction.paymentMethod = paymentMethod;

        await transaction.save();

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ message: 'Server error while updating transaction' });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        // Find transaction and verify ownership
        const transaction = await Transaction.findById(id);

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        // Verify user owns this transaction
        if (transaction.userId.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to delete this transaction' });
            return;
        }

        await Transaction.findByIdAndDelete(id);

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ message: 'Server error while deleting transaction' });
    }
};
