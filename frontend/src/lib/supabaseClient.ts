import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database type definitions
export interface Transaction {
    id?: string
    user_id?: string
    type: 'income' | 'expense'
    amount: number
    category: string
    description: string
    date: string
    note?: string
    payment_method?: 'cash' | 'card' | 'upi' | 'netbanking' | 'other'
    created_at?: string
    updated_at?: string
}

export interface Goal {
    id?: string
    user_id?: string
    goal_name: string
    target_amount: number
    current_amount: number
    deadline: string
    goal_type: 'saving' | 'emergency' | 'investment'
    status?: 'active' | 'completed' | 'cancelled'
    created_at?: string
    updated_at?: string
}

// Helper types
export interface Database {
    public: {
        Tables: {
            transactions: {
                Row: Transaction
                Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
            }
            goals: {
                Row: Goal
                Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Goal, 'id' | 'created_at' | 'updated_at'>>
            }
        }
    }
}
