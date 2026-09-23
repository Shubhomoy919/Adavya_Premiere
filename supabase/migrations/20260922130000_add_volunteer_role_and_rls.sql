-- =====================================================================
-- Volunteer role + real row-level security
--
-- Context for whoever runs this:
--   * public.admin_roles was created in the Supabase dashboard and never
--     had a migration, so migration history does not match the live
--     schema. Step 0 recreates it defensively (no-op on the live DB).
--   * public.students is currently governed by "Allow all for admin app"
--     (FOR ALL USING (true) WITH CHECK (true)) from 20260108203903, which
--     lets anyone holding the public anon key write to the leaderboard.
--     Step 3 replaces it.
--   * Steps 3 and 4 drop EVERY existing policy on students and
--     admin_roles first, including any created by hand in the dashboard,
--     then recreate a known-good set. Review before running.
-- =====================================================================


-- ---------------------------------------------------------------------
-- 0. Bring admin_roles into migration history (no-op if it exists)
-- ---------------------------------------------------------------------
create table if not exists public.admin_roles (
  id         uuid primary key references auth.users (id) on delete cascade,
  roll_no    text not null,
  role       text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;


-- ---------------------------------------------------------------------
-- 1. ROLE MODEL
--    Extend the existing role column rather than adding a parallel table:
--    'main' and 'admin' already live here, 'volunteer' joins them.
-- ---------------------------------------------------------------------
alter table public.admin_roles
  drop constraint if exists admin_roles_role_check;

alter table public.admin_roles
  add constraint admin_roles_role_check
  check (role in ('main', 'admin', 'volunteer'));


-- ---------------------------------------------------------------------
-- 2. Role lookup helper
--    SECURITY DEFINER is load-bearing: it bypasses RLS on admin_roles.
--    Without it, a policy ON admin_roles that SELECTs admin_roles
--    recurses infinitely and every query errors out.
-- ---------------------------------------------------------------------
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.admin_roles where id = auth.uid();
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;


-- ---------------------------------------------------------------------
-- 3. STUDENTS (points / leaderboard)
-- ---------------------------------------------------------------------
alter table public.students enable row level security;

-- Clear every existing policy, including dashboard-created ones.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'students'
  loop
    execute format('drop policy if exists %I on public.students', p.policyname);
  end loop;
end $$;

-- The /leaderboard page reads this table with no session, so reads stay
-- public. Everything below is scoped `to authenticated`, which means an
-- anonymous caller matches no write policy at all and is refused.
create policy "students_select_public"
  on public.students for select
  using (true);

-- Volunteers exist to do exactly this: add players and award points.
create policy "students_insert_staff"
  on public.students for insert to authenticated
  with check (public.current_user_role() in ('main', 'admin', 'volunteer'));

create policy "students_update_staff"
  on public.students for update to authenticated
  using       (public.current_user_role() in ('main', 'admin', 'volunteer'))
  with check  (public.current_user_role() in ('main', 'admin', 'volunteer'));

-- Removing a player from the leaderboard is destructive: admins only.
create policy "students_delete_admin"
  on public.students for delete to authenticated
  using (public.current_user_role() in ('main', 'admin'));


-- ---------------------------------------------------------------------
-- 4. ADMIN_ROLES (who may sign in, and as what)
-- ---------------------------------------------------------------------
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'admin_roles'
  loop
    execute format('drop policy if exists %I on public.admin_roles', p.policyname);
  end loop;
end $$;

-- Every signed-in user must read their OWN row — AuthProvider looks the
-- role up on login. One row, their own: a volunteer cannot enumerate
-- admins or see anyone else's account.
create policy "admin_roles_select_own"
  on public.admin_roles for select to authenticated
  using (id = auth.uid());

-- Main admins see the whole list (the Manage Admins page).
create policy "admin_roles_select_main"
  on public.admin_roles for select to authenticated
  using (public.current_user_role() = 'main');

-- Granting, changing and revoking roles is main-admin only.
create policy "admin_roles_insert_main"
  on public.admin_roles for insert to authenticated
  with check (public.current_user_role() = 'main');

create policy "admin_roles_update_main"
  on public.admin_roles for update to authenticated
  using      (public.current_user_role() = 'main')
  with check (public.current_user_role() = 'main');

create policy "admin_roles_delete_main"
  on public.admin_roles for delete to authenticated
  using (public.current_user_role() = 'main');


-- ---------------------------------------------------------------------
-- 5. Legacy public.admins
--    Unused since the move to Supabase Auth, but it still carries a
--    plaintext `password` column and the wide-open policy from
--    20260108203903. Strip the policy; RLS stays enabled with no policy,
--    which denies everyone. Table and rows are left untouched — drop it
--    separately once you have confirmed nothing reads it.
-- ---------------------------------------------------------------------
do $$
declare p record;
begin
  if to_regclass('public.admins') is not null then
    execute 'alter table public.admins enable row level security';
    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = 'admins'
    loop
      execute format('drop policy if exists %I on public.admins', p.policyname);
    end loop;
  end if;
end $$;
