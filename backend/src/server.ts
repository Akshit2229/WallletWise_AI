import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Only AI routes now (Supabase handles CRUD)
app.use('/api/ai', aiRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'WalletWise AI Backend - AI Insights Service',
        status: 'running',
        note: 'Authentication and CRUD operations are handled by Supabase'
    });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 WalletWise AI Backend running on port ${PORT}`);
    console.log(`📊 AI Insights endpoint: http://localhost:${PORT}/api/ai/insights`);
    console.log(`🔐 Using Supabase for auth and database`);
});

export default app;
