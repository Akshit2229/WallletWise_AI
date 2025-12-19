import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// @route   GET /api/dashboard/summary
// @access  Private
router.get('/summary', authMiddleware, getDashboardSummary);

export default router;
