-- ============================================================
-- MatchCV — Schéma Supabase
-- À exécuter dans l'éditeur SQL du dashboard Supabase (une seule fois)
-- ============================================================

-- Extension nécessaire pour uuid_generate_v4() (généralement déjà activée)
create extension if not exists "uuid-ossp";

-- ── Table profiles ─────────────────────────────────────────
-- Un profil par utilisateur Supabase Auth, créé automatiquement à l'inscription.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  credits integer not null default 1,
  plan text not null default 'free' check (plan in ('free', 'credits', 'subscription')),
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Un utilisateur peut lire son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Un utilisateur peut modifier son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Table generations ──────────────────────────────────────
-- Historique des CV / lettres générés par utilisateur.
create table if not exists public.generations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_title text,
  company_name text,
  job_offer_text text not null,
  original_cv_text text not null,
  generated_cv text not null,
  generated_cover_letter text not null,
  match_score integer,
  template text not null default 'classic' check (template in ('classic', 'modern')),
  created_at timestamptz not null default now()
);

alter table public.generations enable row level security;

create policy "Un utilisateur peut lire ses propres générations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Un utilisateur peut créer ses propres générations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "Un utilisateur peut supprimer ses propres générations"
  on public.generations for delete
  using (auth.uid() = user_id);

-- ── Trigger : création automatique du profil (1 crédit offert) ─
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, credits, plan)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    1,
    'free'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Fonction : décrément atomique d'un crédit ─────────────────
-- Utilisée côté serveur après chaque génération réussie (évite les races conditions).
create or replace function public.decrement_credit(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set credits = credits - 1
  where id = p_user_id and credits > 0;

  if not found then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;
end;
$$;

-- ── Fonction : crédit de crédits après achat Stripe (pack) ───
create or replace function public.add_credits(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set credits = credits + p_amount,
      plan = case when plan = 'free' then 'credits' else plan end
  where id = p_user_id;
end;
$$;

-- ── Index utiles ───────────────────────────────────────────
create index if not exists idx_generations_user_id on public.generations(user_id, created_at desc);
create index if not exists idx_profiles_stripe_customer on public.profiles(stripe_customer_id);
