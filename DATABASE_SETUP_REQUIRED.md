# 🚀 Supabase Database Setup - REQUIRED

Your Supabase credentials are configured, but **you need to create the database tables** first!

## ⚠️ Why Add Task Isn't Working

You haven't created the `tasks` and `completions` tables in your Supabase database yet. Without these tables, the app can't save any data.

## ✅ Quick Fix (5 minutes)

### Step 1: Open Supabase SQL Editor

Go to: https://app.supabase.com/project/qcytkxfxtowgpgnmamfh/sql/new

### Step 2: Copy & Run the SQL

1. Open the file: `SUPABASE_SETUP.sql` (in this project)
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button

### Step 3: Verify Tables Created

Go to: https://app.supabase.com/project/qcytkxfxtowgpgnmamfh/editor

You should see:
- ✅ `tasks` table
- ✅ `completions` table

### Step 4: Enable Google OAuth (Optional)

Go to: https://app.supabase.com/project/qcytkxfxtowgpgnmamfh/auth/providers

1. Find **Google** provider
2. Click **Enable**
3. It's pre-configured and ready to use!

### Step 5: Test Your App

1. Refresh your app
2. Try adding a task
3. It should work! 🎉

## 🔍 What the SQL Does

The `SUPABASE_SETUP.sql` file creates:

1. **`tasks` table** - Stores all your tasks
   - Columns: id, user_id, title, notes, date, is_recurring, recur_type, recur_days, completed, created_at

2. **`completions` table** - Tracks when you complete recurring tasks
   - Columns: id, user_id, task_id, date, completed, created_at

3. **Row Level Security (RLS)** - Ensures users only see their own data
   - Each user can only access their own tasks
   - Automatic data isolation

4. **Performance Indexes** - Makes queries fast
   - Optimized for date-based queries
   - Fast task lookups

## ❓ Still Not Working?

Check the browser console (F12) for errors. Common issues:

1. **"relation does not exist"** → You didn't run the SQL yet
2. **"permission denied"** → RLS policies not created correctly
3. **"null value in column"** → Missing required fields

Run the SQL and you're good to go! 🚀
