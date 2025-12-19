import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Goal from '../models/Goal';

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
export const createGoal = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { goalName, targetAmount, currentAmount, deadline, goalType } = req.body;

        // Validate required fields
        if (!goalName || !targetAmount || !deadline || !goalType) {
            res.status(400).json({ message: 'Please provide all required fields' });
            return;
        }

        // Create goal
        const goal = await Goal.create({
            userId: req.user?.id,
            goalName,
            targetAmount,
            currentAmount: currentAmount || 0,
            deadline: new Date(deadline),
            goalType,
            status: 'active',
        });

        res.status(201).json(goal);
    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({ message: 'Server error while creating goal' });
    }
};

// @desc    Get all goals for logged-in user
// @route   GET /api/goals
// @access  Private
export const getGoals = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { status } = req.query;

        // Build query filter
        const filter: any = { userId: req.user?.id };

        if (status) {
            filter.status = status;
        }

        // Fetch goals
        const goals = await Goal.find(filter).sort({ createdAt: -1 });

        // Calculate progress for each goal
        const goalsWithProgress = goals.map((goal) => {
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            const daysLeft = Math.ceil(
                (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            // Determine status
            let goalStatus = goal.status;
            if (goal.status === 'active') {
                if (progress >= 100) {
                    goalStatus = 'completed';
                }
            }

            return {
                ...goal.toObject(),
                progress: Math.min(progress, 100),
                daysLeft,
                goalStatus,
            };
        });

        res.status(200).json(goalsWithProgress);
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({ message: 'Server error while fetching goals' });
    }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
export const updateGoal = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { goalName, targetAmount, currentAmount, deadline, goalType, status } = req.body;

        // Find goal and verify ownership
        const goal = await Goal.findById(id);

        if (!goal) {
            res.status(404).json({ message: 'Goal not found' });
            return;
        }

        // Verify user owns this goal
        if (goal.userId.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to update this goal' });
            return;
        }

        // Update fields
        if (goalName !== undefined) goal.goalName = goalName;
        if (targetAmount !== undefined) goal.targetAmount = targetAmount;
        if (currentAmount !== undefined) goal.currentAmount = currentAmount;
        if (deadline !== undefined) goal.deadline = new Date(deadline);
        if (goalType !== undefined) goal.goalType = goalType;
        if (status !== undefined) goal.status = status;

        // Auto-update status if progress is 100%
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        if (progress >= 100 && goal.status === 'active') {
            goal.status = 'completed';
        }

        await goal.save();

        res.status(200).json(goal);
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ message: 'Server error while updating goal' });
    }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
export const deleteGoal = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        // Find goal and verify ownership
        const goal = await Goal.findById(id);

        if (!goal) {
            res.status(404).json({ message: 'Goal not found' });
            return;
        }

        // Verify user owns this goal
        if (goal.userId.toString() !== req.user?.id) {
            res.status(403).json({ message: 'Not authorized to delete this goal' });
            return;
        }

        await Goal.findByIdAndDelete(id);

        res.status(200).json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({ message: 'Server error while deleting goal' });
    }
};
