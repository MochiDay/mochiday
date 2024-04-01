import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env['SUPABASE_URL']
// const supabaseKey = process.env['SUPABASE_KEY']

const supabaseUrl = "https://bnuvlthmjgpnxezxspoy.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudXZsdGhtamdwbnhlenhzcG95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwODI1MjksImV4cCI6MjAyNjY1ODUyOX0.V-VHBJmD52tBYTSifZo6d1qDEgkLUP9kOmixvQUZvmQ"

if (!supabaseUrl || !supabaseKey)
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY')


export const supabase = createClient(supabaseUrl, supabaseKey)

