import { createClient } from "@supabase/supabase-js";

// Replace these with YOUR values from Step 1.5
const SUPABASE_URL = "https://hwmbymnlfvrzsbpfhbfq.supabase.co";  // ← paste your Project URL here
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3bWJ5bW5sZnZyenNicGZoYmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMjQwMzAsImV4cCI6MjA4NzcwMDAzMH0.ci1tJT-bkLPX6L-tB_-g-qBvO10qEUBBwIg1EXLfits";                // ← paste your anon key here

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);