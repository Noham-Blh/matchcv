-- ============================================================
-- MatchCV — Migration : ajout de Facebook comme plateforme valide
-- (remplace LinkedIn dans l'interface, mais on garde les deux valeurs
-- possibles en base pour ne rien casser si des lignes existent déjà).
-- ============================================================

alter table public.social_follow_requests
  drop constraint if exists social_follow_requests_platform_check;

alter table public.social_follow_requests
  add constraint social_follow_requests_platform_check
  check (platform in ('instagram', 'tiktok', 'linkedin', 'facebook'));
