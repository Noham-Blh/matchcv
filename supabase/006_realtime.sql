-- ============================================================
-- MatchCV — Active le "temps réel" sur la table profiles.
-- Sans ça, le nombre de crédits affiché ne se met pas à jour tout seul
-- côté utilisateur : il faut recharger la page pour voir le changement.
-- ============================================================

alter publication supabase_realtime add table public.profiles;
