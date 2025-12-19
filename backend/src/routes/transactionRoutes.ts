import express from 'express';
import {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from '../controllers/transactionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected with authentication
router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getTransactions);
router.put('/:id', authMiddleware, updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

export default router;
