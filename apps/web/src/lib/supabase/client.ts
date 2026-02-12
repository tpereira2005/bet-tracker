import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your-supabase-url') {
        // Return a minimal mock client when Supabase is not configured
        // This allows the app to render without crashing
        return createBrowserClient(
            'https://placeholder.supabase.co',
            'placeholder-key',
        );
    }

    return createBrowserClient(supabaseUrl, supabaseKey);
}
