REVOKE EXECUTE ON FUNCTION public.trg_notify_like() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_notify_repost() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_notify_comment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_notify_comment_like() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_notify_follow() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.trg_extract_hashtags() FROM PUBLIC, anon, authenticated;