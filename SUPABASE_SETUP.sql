-- ============================================
-- Daily Tracker - Supabase Database Setup
-- ============================================
-- Run this SQL in Supabase SQL Editor:
-- https://app.supabase.com/project/qcytkxfxtowgpgnmamfh/sql/new

-- 1. Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  notes TEXT,
  date DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recur_type TEXT DEFAULT 'once',
  recur_days INTEGER[],
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create completions table (for recurring task tracking)
CREATE TABLE IF NOT EXISTS completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(task_id, date)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for tasks table
-- Allow users to read their own tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own tasks
CREATE POLICY "Users can insert their own tasks"
  ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Create RLS Policies for completions table
-- Allow users to read their own completions
CREATE POLICY "Users can view their own completions"
  ON completions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own completions
CREATE POLICY "Users can insert their own completions"
  ON completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own completions
CREATE POLICY "Users can update their own completions"
  ON completions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own completions
CREATE POLICY "Users can delete their own completions"
  ON completions
  FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
CREATE INDEX IF NOT EXISTS idx_completions_user_id ON completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_task_id ON completions(task_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON completions(date);

-- ============================================
-- Setup Complete! ✅
-- ============================================
-- Now enable Google OAuth:
-- 1. Go to Authentication > Providers
-- 2. Enable Google (it's pre-configured)
-- 3. Or add custom credentials if needed
-- ============================================
