import { supabase } from '../lib/supabaseClient'
import type { Transaction, Goal } from '../lib/supabaseClient'

// Fixed demo user ID (no authentication required)
const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001'

// ==================== TRANSACTION CRUD ====================

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    const { data, error } = await supabase
        .from('transactions')
        .insert([{ ...transaction, user_id: DEMO_USER_ID }])
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export const getTransactions = async (filters?: {
    type?: string
    category?: string
    startDate?: string
    endDate?: string
    limit?: number
    page?: number
}) => {
    let query = supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', DEMO_USER_ID)
        .order('date', { ascending: false })

    if (filters?.type) query = query.eq('type', filters.type)
    if (filters?.category) query = query.eq('category', filters.category)
    if (filters?.startDate) query = query.gte('date', filters.startDate)
    if (filters?.endDate) query = query.lte('date', filters.endDate)

    // Pagination
    if (filters?.limit && filters?.page) {
        const from = (filters.page - 1) * filters.limit
        const to = from + filters.limit - 1
        query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw new Error(error.message)

    return {
        transactions: data || [],
        pagination: {
            total: count || 0,
            page: filters?.page || 1,
            limit: filters?.limit || 100,
            pages: Math.ceil((count || 0) / (filters?.limit || 100))
        }
    }
}

export const updateTransaction = async (id: string, updates: Partial<Omit<Transaction, 'id' | 'user_id'>>) => {
    const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', id)
        .eq('user_id', DEMO_USER_ID)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export const deleteTransaction = async (id: string) => {
    const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', DEMO_USER_ID)

    if (error) throw new Error(error.message)
}

// ==================== GOAL CRUD ====================

export const createGoal = async (goal: Omit<Goal, 'id' | 'user_id'>) => {
    const { data, error } = await supabase
        .from('goals')
        .insert([{ ...goal, user_id: DEMO_USER_ID }])
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export const getGoals = async (status?: string) => {
    let query = supabase
        .from('goals')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query

    if (error) throw new Error(error.message)

    // Calculate progress for each goal
    return (data || []).map(goal => {
        const progress = (parseFloat(goal.current_amount as any) / parseFloat(goal.target_amount as any)) * 100
        const daysLeft = Math.ceil(
            (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        return { ...goal, progress, daysLeft, goalStatus: goal.status }
    })
}

export const updateGoal = async (id: string, updates: Partial<Omit<Goal, 'id' | 'user_id'>>) => {
    const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', DEMO_USER_ID)
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export const deleteGoal = async (id: string) => {
    const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)
        .eq('user_id', DEMO_USER_ID)

    if (error) throw new Error(error.message)
}

// ==================== DASHBOARD (computed from Supabase) ====================

export const getDashboardSummary = async () => {
    // Get current month range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    // Fetch this month's transactions
    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

    if (error) throw new Error(error.message)

    // Calculate totals
    let monthlyIncome = 0
    let monthlyExpense = 0
    const categoryMap: { [key: string]: number } = {}

    transactions?.forEach(t => {
        const amount = parseFloat(t.amount as any)
        if (t.type === 'income') {
            monthlyIncome += amount
        } else {
            monthlyExpense += amount
            categoryMap[t.category] = (categoryMap[t.category] || 0) + amount
        }
    })

    // Get goals
    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .eq('status', 'active')

    const goalTarget = goals?.reduce((sum, g) => sum + parseFloat(g.target_amount as any), 0) || 0

    // Get recent transactions
    const { data: recentTransactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', DEMO_USER_ID)
        .order('date', { ascending: false })
        .limit(10)

    // Format category breakdown
    const colors = ['#10B981', '#3B82F6', '#6D28D9', '#F59E0B', '#EF4444', '#8B5CF6']
    const categoryBreakdown = Object.entries(categoryMap).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
    }))


    // Get AI insights from backend
    let aiInsights: any = null
    try {
        console.log('Fetching AI insights...')
        const response = await fetch('http://localhost:5001/api/ai/insights')

        if (response.ok) {
            const data = await response.json()
            aiInsights = data // Full structured insights object
            console.log('AI insights received:', aiInsights)
        } else {
            console.error('AI insights request failed:', response.status, await response.text())
        }
    } catch (error) {
        console.error('Failed to fetch AI insights:', error)
    }

    return {
        monthlyTotalSpent: monthlyExpense,
        monthlyIncome,
        totalSaved: monthlyIncome - monthlyExpense,
        goalTarget,
        categoryBreakdown,
        aiInsights,
        recentTransactions: recentTransactions?.map(t => ({
            id: t.id,
            description: t.description,
            category: t.category,
            amount: t.type === 'expense' ? -parseFloat(t.amount as any) : parseFloat(t.amount as any),
            date: t.date,
            type: t.type,
            note: t.note,
            paymentMethod: t.payment_method
        })) || []
    }
}

// ==================== AI INSIGHTS ====================

export type AIInsights = {
    summary: string
    keyInsights: string[]
    risks: string[]
    smartSuggestions: string[]
    dataQualityIssues?: string[]
}

export const getAIInsights = async (): Promise<AIInsights | null> => {
    try {
        const response = await fetch('http://localhost:5001/api/ai/insights')
        if (response.ok) {
            return await response.json()
        }
        return null
    } catch (error) {
        console.error('Failed to fetch AI insights:', error)
        return null
    }
}

export const uploadCSVForAnalysis = async (file: File): Promise<AIInsights & { csvInfo?: any } | null> => {
    try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('http://localhost:5001/api/ai/analyze-csv', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to analyze CSV')
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to upload CSV:', error)
        throw error
    }
}

// Export types
export type { Transaction, Goal }
