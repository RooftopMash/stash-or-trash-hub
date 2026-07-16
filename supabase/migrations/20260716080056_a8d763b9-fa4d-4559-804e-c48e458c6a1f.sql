-- Revoke direct API execute rights on internal SECURITY DEFINER helpers.
-- These are only invoked by triggers or via SECURITY DEFINER internals; nothing
-- in the app calls them over PostgREST, so anon/authenticated should not have EXECUTE.

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_brand_role() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_votes_recompute() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_items_recompute() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_brand_trust(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recompute_user_trust(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_brand_privileged_fields() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_trust() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- has_role must remain callable by authenticated users because RLS policies
-- evaluate it in the querying role's context. Revoke from anon and PUBLIC only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
