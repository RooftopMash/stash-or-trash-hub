-- FOLLOWS
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followee_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.brands(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT follows_target_chk CHECK (
    (followee_id IS NOT NULL AND brand_id IS NULL) OR (followee_id IS NULL AND brand_id IS NOT NULL)
  )
);
CREATE UNIQUE INDEX follows_user_uniq ON public.follows (follower_id, followee_id) WHERE followee_id IS NOT NULL;
CREATE UNIQUE INDEX follows_brand_uniq ON public.follows (follower_id, brand_id) WHERE brand_id IS NOT NULL;
GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated;
GRANT SELECT ON public.follows TO anon;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are public" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users create own follows" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = follower_id AND followee_id IS DISTINCT FROM auth.uid());
CREATE POLICY "Users delete own follows" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = follower_id);

-- POST LIKES
CREATE TABLE public.post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;
GRANT SELECT ON public.post_likes TO anon;
GRANT ALL ON public.post_likes TO service_role;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are public" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users like as themselves" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own likes" ON public.post_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- REPOSTS
CREATE TABLE public.reposts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.reposts TO authenticated;
GRANT SELECT ON public.reposts TO anon;
GRANT ALL ON public.reposts TO service_role;
ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reposts are public" ON public.reposts FOR SELECT USING (true);
CREATE POLICY "Users repost as themselves" ON public.reposts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own reposts" ON public.reposts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COMMENTS
CREATE TABLE public.post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX post_comments_item_idx ON public.post_comments (item_id, created_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_comments TO authenticated;
GRANT SELECT ON public.post_comments TO anon;
GRANT ALL ON public.post_comments TO service_role;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are public" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users comment as themselves" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND length(btrim(body)) > 0);
CREATE POLICY "Users edit own comments" ON public.post_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own comments" ON public.post_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- COMMENT LIKES
CREATE TABLE public.comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.post_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.comment_likes TO authenticated;
GRANT SELECT ON public.comment_likes TO anon;
GRANT ALL ON public.comment_likes TO service_role;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comment likes are public" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users like comments as themselves" ON public.comment_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own comment likes" ON public.comment_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- HASHTAGS
CREATE TABLE public.hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL UNIQUE,
  use_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hashtags TO authenticated, anon;
GRANT ALL ON public.hashtags TO service_role;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hashtags are public" ON public.hashtags FOR SELECT USING (true);

CREATE TABLE public.post_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, hashtag_id)
);
GRANT SELECT ON public.post_hashtags TO authenticated, anon;
GRANT ALL ON public.post_hashtags TO service_role;
ALTER TABLE public.post_hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Post hashtags are public" ON public.post_hashtags FOR SELECT USING (true);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  item_id uuid REFERENCES public.items(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.post_comments(id) ON DELETE CASCADE,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications (user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- notification fan-out (trigger-owned so clients cannot forge notifications)
CREATE OR REPLACE FUNCTION public.notify(_user_id uuid, _actor_id uuid, _type text, _item_id uuid, _comment_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF _user_id IS NULL OR _user_id = _actor_id THEN RETURN; END IF;
  INSERT INTO public.notifications (user_id, actor_id, type, item_id, comment_id)
  VALUES (_user_id, _actor_id, _type, _item_id, _comment_id);
END; $$;
REVOKE EXECUTE ON FUNCTION public.notify(uuid, uuid, text, uuid, uuid) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.trg_notify_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid;
BEGIN
  SELECT user_id INTO owner FROM public.items WHERE id = NEW.item_id;
  PERFORM public.notify(owner, NEW.user_id, 'like_post', NEW.item_id, NULL);
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_like AFTER INSERT ON public.post_likes FOR EACH ROW EXECUTE FUNCTION public.trg_notify_like();

CREATE OR REPLACE FUNCTION public.trg_notify_repost() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid;
BEGIN
  SELECT user_id INTO owner FROM public.items WHERE id = NEW.item_id;
  PERFORM public.notify(owner, NEW.user_id, 'repost', NEW.item_id, NULL);
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_repost AFTER INSERT ON public.reposts FOR EACH ROW EXECUTE FUNCTION public.trg_notify_repost();

CREATE OR REPLACE FUNCTION public.trg_notify_comment() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid; parent_owner uuid;
BEGIN
  SELECT user_id INTO owner FROM public.items WHERE id = NEW.item_id;
  PERFORM public.notify(owner, NEW.user_id, 'comment', NEW.item_id, NEW.id);
  IF NEW.parent_id IS NOT NULL THEN
    SELECT user_id INTO parent_owner FROM public.post_comments WHERE id = NEW.parent_id;
    PERFORM public.notify(parent_owner, NEW.user_id, 'comment', NEW.item_id, NEW.id);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_comment AFTER INSERT ON public.post_comments FOR EACH ROW EXECUTE FUNCTION public.trg_notify_comment();

CREATE OR REPLACE FUNCTION public.trg_notify_comment_like() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid; iid uuid;
BEGIN
  SELECT user_id, item_id INTO owner, iid FROM public.post_comments WHERE id = NEW.comment_id;
  PERFORM public.notify(owner, NEW.user_id, 'like_comment', iid, NEW.comment_id);
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_comment_like AFTER INSERT ON public.comment_likes FOR EACH ROW EXECUTE FUNCTION public.trg_notify_comment_like();

CREATE OR REPLACE FUNCTION public.trg_notify_follow() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid;
BEGIN
  IF NEW.followee_id IS NOT NULL THEN
    PERFORM public.notify(NEW.followee_id, NEW.follower_id, 'follow', NULL, NULL);
  ELSE
    SELECT owner_id INTO owner FROM public.brands WHERE id = NEW.brand_id;
    PERFORM public.notify(owner, NEW.follower_id, 'follow', NULL, NULL);
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_follow AFTER INSERT ON public.follows FOR EACH ROW EXECUTE FUNCTION public.trg_notify_follow();

-- hashtag extraction from item title/description
CREATE OR REPLACE FUNCTION public.trg_extract_hashtags() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE m text; hid uuid;
BEGIN
  DELETE FROM public.post_hashtags WHERE item_id = NEW.id;
  FOR m IN
    SELECT DISTINCT lower(x[1]) FROM regexp_matches(
      coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,''), '#([A-Za-z0-9_]{2,40})', 'g'
    ) AS x
  LOOP
    INSERT INTO public.hashtags (tag) VALUES (m)
    ON CONFLICT (tag) DO UPDATE SET tag = EXCLUDED.tag
    RETURNING id INTO hid;
    INSERT INTO public.post_hashtags (item_id, hashtag_id) VALUES (NEW.id, hid)
    ON CONFLICT DO NOTHING;
  END LOOP;
  UPDATE public.hashtags h SET use_count = (
    SELECT count(*) FROM public.post_hashtags ph WHERE ph.hashtag_id = h.id
  ) WHERE h.id IN (SELECT hashtag_id FROM public.post_hashtags WHERE item_id = NEW.id);
  RETURN NEW;
END; $$;
CREATE TRIGGER extract_hashtags AFTER INSERT OR UPDATE OF title, description ON public.items
FOR EACH ROW EXECUTE FUNCTION public.trg_extract_hashtags();

-- realtime for the social feed
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.post_comments REPLICA IDENTITY FULL;
ALTER TABLE public.items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;