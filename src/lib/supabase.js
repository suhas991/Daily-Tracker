import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
// You can get these from: https://app.supabase.com/project/_/settings/api
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qcytkxfxtowgpgnmamfh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeXRreGZ4dG93Z3Bnbm1hbWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NzE3NDksImV4cCI6MjA3ODI0Nzc0OX0.v8a4LhIR0zLHQt50m0PGEabPeoX0Z-hfCs87JdcKv4Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
