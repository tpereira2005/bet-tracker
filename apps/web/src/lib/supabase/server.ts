import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Check if Supabase credentials are properly configured */
export function isSupabaseConfigured(): boolean {
    return (
        SUPABASE_URL.length > 0 &&
        SUPABASE_ANON_KEY.length > 0 &&
        SUPABASE_URL.startsWith('https://') &&
        !SUPABASE_URL.includes('placeholder')
    );
}

export async function createClient() {
    if (!isSupabaseConfigured()) {
        throw new Error(
            'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
        );
    }

    const cookieStore = await cookies();

    return createServerClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll().map((cookie) => ({
                        name: cookie.name,
                        value: cookie.value,
                    }));
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    try {
                        for (const { name, value, options } of cookiesToSet) {
                            cookieStore.set(name, value, options);
                        }
                    } catch {
                        // This can be called from a Server Component where cookies
                        // can't be set. This is fine because middleware will handle
                        // the session refresh.
                    }
                },
            },
        },
    );
}
