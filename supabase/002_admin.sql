-- ============================================================
-- MatchCV — Migration : ajout du rôle admin
-- À exécuter dans le SQL Editor de Supabase (une seule fois),
-- après avoir déjà appliqué supabase/schema.sql.
-- ============================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

-- Passe TON compte en admin : remplace l'e-mail ci-dessous par le tien,
-- puis exécute uniquement cette ligne (sélectionne-la et fais "Run selection").
update public.profiles set is_admin = true where email = noham-bellahssan@outlook.com;
