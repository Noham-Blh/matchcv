-- ============================================================
-- MatchCV — Migration : parrainage + crédits contre suivi réseaux sociaux
-- À exécuter dans le SQL Editor de Supabase, après schema.sql et 002_admin.sql.
-- ============================================================

-- Colonnes de parrainage sur profiles
alter table public.profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by uuid references public.profiles(id),
  add column if not exists referral_credit_granted boolean not null default false;

-- Table des demandes de crédit contre suivi d'un réseau social
create table if not exists public.social_follow_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform text not null check (platform in ('instagram', 'tiktok', 'linkedin')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (user_id, platform)
);

alter table public.social_follow_requests enable row level security;

create policy "Un utilisateur peut voir ses propres demandes"
  on public.social_follow_requests for select
  using (auth.uid() = user_id);

create policy "Un utilisateur peut créer ses propres demandes"
  on public.social_follow_requests for insert
  with check (auth.uid() = user_id);

-- Met à jour le trigger de création de profil : génère un code de parrainage
-- et enregistre le parrain si un code a été transmis à l'inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_referral_code text;
  v_referrer_id uuid;
begin
  -- Code de parrainage court, dérivé de l'identifiant unique du compte.
  v_referral_code := substr(replace(new.id::text, '-', ''), 1, 8);

  -- Si un code de parrainage a été transmis (paramètre ?ref= à l'inscription), on cherche le parrain.
  if new.raw_user_meta_data ->> 'ref' is not null then
    select id into v_referrer_id
    from public.profiles
    where referral_code = new.raw_user_meta_data ->> 'ref'
    limit 1;
  end if;

  insert into public.profiles (id, email, full_name, credits, plan, referral_code, referred_by)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    1,
    'free',
    v_referral_code,
    v_referrer_id
  );
  return new;
end;
$$;

-- Fonction : crédite le parrain une seule fois, appelée après confirmation du compte filleul.
create or replace function public.grant_referral_credit(p_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_referrer_id uuid;
  v_already_granted boolean;
begin
  select referred_by, referral_credit_granted into v_referrer_id, v_already_granted
  from public.profiles
  where id = p_user_id;

  if v_referrer_id is not null and not v_already_granted then
    update public.profiles set credits = credits + 1 where id = v_referrer_id;
    update public.profiles set referral_credit_granted = true where id = p_user_id;
  end if;
end;
$$;
