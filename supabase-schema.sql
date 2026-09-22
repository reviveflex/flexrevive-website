-- Run this once in Supabase: Project -> SQL Editor -> New query -> paste -> Run

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  type text not null,              -- 'appointment' or 'teleconsultation'
  payload jsonb not null,          -- the form fields, as submitted
  created_at timestamptz not null default now()
);

alter table submissions enable row level security;

-- Allow the public (publishable-key) role to insert new submissions —
-- this is what the appointment/teleconsultation forms need.
create policy "Allow inserts from forms"
  on submissions
  for insert
  to anon
  with check (true);

-- Allow the public role to read submissions too. This is safe here because
-- the publishable key is only ever used from server-side Vercel functions
-- (never shipped to the browser), and the /api/submissions endpoint itself
-- is separately locked behind an ADMIN_SECRET check.
create policy "Allow reads for admin viewer"
  on submissions
  for select
  to anon
  using (true);
