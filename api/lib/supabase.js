// Shared Supabase client, used by every /api function.
//
// Uses the publishable key (Project Settings -> API in Supabase) rather
// than the secret service_role key. This is safe here because:
//   1. This key is only ever used from server-side Vercel functions,
//      never shipped to the browser or embedded in index.html.
//   2. The submissions table has Row Level Security policies that only
//      allow exactly what these functions need (insert new submissions,
//      read them back) — nothing else.
//   3. The /api/submissions viewer is separately locked behind
//      ADMIN_SECRET, regardless of what the database key allows.

const { createClient } = require('@supabase/supabase-js');

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    'SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY are not set. ' +
    'Add them in Vercel -> Settings -> Environment Variables.'
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY
);

module.exports = { supabase };
