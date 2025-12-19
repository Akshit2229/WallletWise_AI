import express from 'express';
import {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal,
} from '../controllers/goalController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// All routes are protected with authentication
router.post('/', authMiddleware, createGoal);
router.get('/', authMiddleware, getGoals);
router.put('/:id', authMiddleware, updateGoal);
router.delete('/:id', authMiddleware, deleteGoal);

export default router;
