-- Remove Authentication and Foreign Key Constraints
-- Run this in Supabase SQL Editor to allow public access without authentication

-- ==================== DISABLE ROW LEVEL SECURITY ====================

ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals DISABLE ROW LEVEL SECURITY;

-- ==================== DROP ALL RLS POLICIES ====================

-- Drop transaction policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transactions;

-- Drop goal policies
DROP POLICY IF EXISTS "Users can view own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can insert own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete own goals" ON public.goals;

-- ==================== REMOVE FOREIGN KEY CONSTRAINTS ====================

-- Drop foreign key constraints (they require auth.users which we're not using)
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.goals DROP CONSTRAINT IF EXISTS goals_user_id_fkey;

-- Make user_id nullable and set default to demo user ID
ALTER TABLE public.transactions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.transactions ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000001';

ALTER TABLE public.goals ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.goals ALTER COLUMN user_id SET DEFAULT '00000000-0000-0000-0000-000000000001';

-- ==================== DONE ====================
-- Successfully removed authentication requirements!
-- The app will now work without foreign key constraints.
