import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    amount: number;
    category: string;
    description: string;
    type: 'income' | 'expense';
    note?: string;
    paymentMethod?: 'cash' | 'card' | 'upi' | 'netbanking' | 'other';
    createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    note: {
        type: String,
        trim: true,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'upi', 'netbanking', 'other'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
