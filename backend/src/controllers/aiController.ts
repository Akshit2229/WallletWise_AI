import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { analyzeTransactions } from '../services/aiAnalysisEngine';
import { parseCSV, validateCSVFile } from '../services/csvParser';
import { Transaction, Goal } from '../types/aiTypes';

// Load environment variables first
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Fixed demo user ID (no authentication required)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';

// @desc    Get AI-powered financial insights from database
// @route   GET /api/ai/insights
// @access  Public
export const getAIInsights = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Get last 30 days transactions from Supabase
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: transactions, error: transError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', DEMO_USER_ID)
            .gte('date', thirtyDaysAgo.toISOString().split('T')[0]);

        if (transError) {
            console.error('Error fetching transactions:', transError);
            res.status(500).json({ message: 'Failed to fetch transactions' });
            return;
        }

        const { data: goals, error: goalsError } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', DEMO_USER_ID)
            .eq('status', 'active');

        if (goalsError) {
            console.error('Error fetching goals:', goalsError);
        }

        // Use comprehensive analysis engine
        const insights = analyzeTransactions(
            transactions as Transaction[] || [],
            goals as Goal[] || []
        );

        res.json(insights);
    } catch (error) {
        console.error('AI insights error:', error);
        res.status(500).json({ message: 'Failed to generate insights' });
    }
};

// @desc    Analyze uploaded CSV file
// @route   POST /api/ai/analyze-csv
// @access  Public
export const analyzeCSV = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            res.status(400).json({ message: 'No CSV file uploaded' });
            return;
        }

        // Validate file
        const validation = validateCSVFile(req.file);
        if (!validation.valid) {
            res.status(400).json({ message: validation.error });
            return;
        }

        // Parse CSV content
        const fileContent = req.file.buffer.toString('utf-8');
        const { transactions, qualityReport, mapping } = parseCSV(fileContent);

        console.log('CSV parsed successfully:');
        console.log('- Total rows:', qualityReport.totalRows);
        console.log('- Valid transactions:', transactions.length);
        console.log('- Errors:', qualityReport.rowsWithErrors);
        console.log('- Column mapping:', mapping);

        // Optionally fetch goals for goal impact analysis
        const { data: goals } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', DEMO_USER_ID)
            .eq('status', 'active');

        // Insert transactions into database
        if (transactions.length > 0) {
            const transactionsToInsert = transactions.map(t => ({
                user_id: DEMO_USER_ID,
                type: t.type,
                amount: t.amount,
                category: t.category,
                description: t.description,
                date: t.date,
                payment_method: t.payment_method || null,
                note: t.note || ''
            }));

            const { error: insertError } = await supabase
                .from('transactions')
                .insert(transactionsToInsert);

            if (insertError) {
                console.error('Error inserting transactions:', insertError);
                res.status(500).json({
                    message: 'Failed to save transactions to database',
                    error: insertError.message
                });
                return;
            }

            console.log(`Successfully inserted ${transactions.length} transactions into database`);
        }

        // Analyze transactions
        const insights = analyzeTransactions(
            transactions,
            goals as Goal[] || [],
            qualityReport.issues.length > 0 ? qualityReport.issues : undefined
        );

        res.json({
            ...insights,
            csvInfo: {
                totalRows: qualityReport.totalRows,
                validTransactions: transactions.length,
                rowsWithErrors: qualityReport.rowsWithErrors,
                columnMapping: mapping
            },
            saved: true,
            savedCount: transactions.length
        });
    } catch (error) {
        console.error('CSV analysis error:', error);
        res.status(500).json({
            message: 'Failed to analyze CSV file',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
