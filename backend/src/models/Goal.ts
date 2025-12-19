import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
    userId: mongoose.Types.ObjectId;
    goalName: string;
    targetAmount: number;
    currentAmount: number;
    deadline: Date;
    goalType: 'saving' | 'emergency' | 'investment';
    status: 'active' | 'completed' | 'cancelled';
    createdAt: Date;
    updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        goalName: {
            type: String,
            required: [true, 'Please provide a goal name'],
            trim: true,
        },
        targetAmount: {
            type: Number,
            required: [true, 'Please provide a target amount'],
            min: [0, 'Target amount must be positive'],
        },
        currentAmount: {
            type: Number,
            default: 0,
            min: [0, 'Current amount must be positive'],
        },
        deadline: {
            type: Date,
            required: [true, 'Please provide a deadline'],
        },
        goalType: {
            type: String,
            enum: ['saving', 'emergency', 'investment'],
            required: [true, 'Please provide a goal type'],
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
    },
    {
        timestamps: true, // Automatically creates createdAt and updatedAt
    }
);

// Index for faster queries
goalSchema.index({ userId: 1, status: 1 });

const Goal = mongoose.model<IGoal>('Goal', goalSchema);

export default Goal;
