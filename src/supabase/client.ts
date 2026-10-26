import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Sanitize the Supabase URL so accidental subpaths like /rest/v1 or trailing slashes don't break endpoint construction
function sanitizeSupabaseUrl(raw?: string): string {
  const fallback = 'https://vmracftfhqqigfvenrtg.supabase.co';
  if (!raw || !raw.trim()) {
    return fallback;
  }
  let cleaned = raw.trim();
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  // If the user or env accidentally included /rest/v1 or /storage/v1 or /auth/v1
  cleaned = cleaned.replace(/\/(rest|storage|auth)(\/v\d+)?.*$/i, '');
  cleaned = cleaned.replace(/\/+$/, '');
  return cleaned || fallback;
}

// Official KC NEXUS Supabase Project URL
export const SUPABASE_URL = sanitizeSupabaseUrl(
  import.meta.env.VITE_SUPABASE_URL || 'https://vmracftfhqqigfvenrtg.supabase.co'
);

// Public publishable anon key from Vite env
export const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
).trim();

// Primary authorized administrator email
export const PRIMARY_ADMIN_EMAIL = 'okoobenikelechisalvation@gmail.com';

// Storage bucket for portfolio media
export const PORTFOLIO_STORAGE_BUCKET = 'portfolio-media';

/**
 * Check whether Supabase is configured with an active publishable key.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 10);
}

/**
 * Initialized Supabase client instance.
 * If key is not yet provided, a client is created with fallback/placeholder to avoid app crashes.
 */
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
