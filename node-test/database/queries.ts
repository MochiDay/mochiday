import { supabase } from "./supabase.js"

export async function getUserDetails(user_id: string) {
    return supabase
        .from('user_details')
        .select('*')
        .eq('user_id', user_id)
}


