import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const createSafeClient = () => {
    try {
        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_PROJECT_URL' || !supabaseUrl.startsWith('http')) {
            throw new Error('Invalid or missing Supabase credentials')
        }
        return createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
        console.warn('Supabase initialization deferred until credentials are set:', error.message)
        // Return a mock client that doesn't crash the app
        return {
            from: () => ({
                select: () => ({
                    order: () => Promise.resolve({ data: [], error: null }),
                    eq: () => Promise.resolve({ data: [], error: null }),
                    insert: () => Promise.resolve({ data: [], error: null }),
                    delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
                    then: (fn) => fn({ data: [], error: null })
                }),
                insert: () => Promise.resolve({ data: [], error: null }),
                delete: () => ({ eq: () => Promise.resolve({ data: [], error: null }) })
            })
        }
    }
}

export const supabase = createSafeClient()