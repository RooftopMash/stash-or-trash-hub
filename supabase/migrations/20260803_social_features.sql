-- ===== SOCIAL MEDIA FEATURES MIGRATION =====
-- Adds: Follow graph, Likes, Comments, Mentions, Notifications, Hashtags, Reposts

-- 1. FOLLOW SYSTEM (with Stash/Trash for users)
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verdict text DEFAULT 'stash', -- 'stash' = follow, 'trash' = blocked/muted
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.follows TO authenticated;
GRANT ALL ON public.follows TO service_role;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow/unfollow" ON public.follows FOR INSERT, UPDATE, DELETE TO authenticated
  USING (auth.uid() = follower_id) WITH CHECK (auth.uid() = follower_id);

-- 2. COMMENTS (nested posts within items)
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  parent_comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE, -- for nested replies
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT ALL ON public.comments TO service_role;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.comments FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. COMMENT LIKES (hearts on comments)
CREATE TABLE public.comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (comment_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.comment_likes TO authenticated;
GRANT ALL ON public.comment_likes TO service_role;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are viewable by everyone" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like/unlike comments" ON public.comment_likes FOR INSERT, DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 4. POST LIKES (hearts on items)
CREATE TABLE public.item_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.item_likes TO authenticated;
GRANT ALL ON public.item_likes TO service_role;
ALTER TABLE public.item_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes are viewable by everyone" ON public.item_likes FOR SELECT USING (true);
CREATE POLICY "Users can like/unlike posts" ON public.item_likes FOR INSERT, DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 5. HASHTAGS
CREATE TABLE public.hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tag text NOT NULL UNIQUE,
  use_count integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hashtags TO anon, authenticated;
GRANT ALL ON public.hashtags TO service_role;
ALTER TABLE public.hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hashtags are viewable by everyone" ON public.hashtags FOR SELECT USING (true);
CREATE TRIGGER update_hashtags_updated_at BEFORE UPDATE ON public.hashtags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. ITEM-HASHTAG JOIN TABLE
CREATE TABLE public.item_hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  hashtag_id uuid NOT NULL REFERENCES public.hashtags(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, hashtag_id)
);
GRANT SELECT, INSERT ON public.item_hashtags TO authenticated;
GRANT ALL ON public.item_hashtags TO service_role;
ALTER TABLE public.item_hashtags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Item hashtags are viewable by everyone" ON public.item_hashtags FOR SELECT USING (true);

-- 7. MENTIONS (tag users in posts/comments)
CREATE TABLE public.mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentioned_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.items(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  mentioned_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((item_id IS NOT NULL AND comment_id IS NULL) OR (item_id IS NULL AND comment_id IS NOT NULL))
);
GRANT SELECT, INSERT ON public.mentions TO authenticated;
GRANT ALL ON public.mentions TO service_role;
ALTER TABLE public.mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentions are viewable by everyone" ON public.mentions FOR SELECT USING (true);

-- 8. NOTIFICATIONS (activity feed)
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'follow', 'like_post', 'like_comment', 'comment', 'mention', 'repost'
  actor_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid REFERENCES public.items(id) ON DELETE CASCADE,
  comment_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can mark notifications read" ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- 9. REPOSTS (share posts to your followers)
CREATE TABLE public.reposts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (item_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.reposts TO authenticated;
GRANT ALL ON public.reposts TO service_role;
ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reposts are viewable by everyone" ON public.reposts FOR SELECT USING (true);
CREATE POLICY "Users can repost/unrepost" ON public.reposts FOR INSERT, DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 10. HELPER FUNCTIONS FOR FOLLOW COUNTS
CREATE OR REPLACE FUNCTION public.get_follower_count(_user_id uuid)
RETURNS int LANGUAGE sql STABLE AS $$
  SELECT COUNT(*) FROM public.follows
  WHERE following_id = _user_id AND verdict = 'stash';
$$;

CREATE OR REPLACE FUNCTION public.get_following_count(_user_id uuid)
RETURNS int LANGUAGE sql STABLE AS $$
  SELECT COUNT(*) FROM public.follows
  WHERE follower_id = _user_id AND verdict = 'stash';
$$;

CREATE OR REPLACE FUNCTION public.is_following(_follower_id uuid, _following_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.follows
    WHERE follower_id = _follower_id AND following_id = _following_id AND verdict = 'stash'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_blocked(_user_id uuid, _blocked_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.follows
    WHERE follower_id = _user_id AND following_id = _blocked_user_id AND verdict = 'trash'
  );
$$;

-- 11. NOTIFICATION TRIGGER FOR FOLLOWS
CREATE OR REPLACE FUNCTION public.trg_notify_on_follow()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.verdict = 'stash' THEN
    INSERT INTO public.notifications (user_id, type, actor_id, created_at)
    VALUES (NEW.following_id, 'follow', NEW.follower_id, now())
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_on_follow AFTER INSERT OR UPDATE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_follow();

-- 12. NOTIFICATION TRIGGERS FOR LIKES
CREATE OR REPLACE FUNCTION public.trg_notify_on_item_like()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE post_owner uuid;
BEGIN
  SELECT user_id INTO post_owner FROM public.items WHERE id = NEW.item_id;
  IF post_owner IS NOT NULL AND post_owner != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, actor_id, item_id, created_at)
    VALUES (post_owner, 'like_post', NEW.user_id, NEW.item_id, now())
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_on_item_like AFTER INSERT ON public.item_likes
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_item_like();

CREATE OR REPLACE FUNCTION public.trg_notify_on_comment_like()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE comment_author uuid;
BEGIN
  SELECT user_id INTO comment_author FROM public.comments WHERE id = NEW.comment_id;
  IF comment_author IS NOT NULL AND comment_author != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, actor_id, comment_id, created_at)
    VALUES (comment_author, 'like_comment', NEW.user_id, NEW.comment_id, now())
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_on_comment_like AFTER INSERT ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_comment_like();

-- 13. NOTIFICATION TRIGGER FOR COMMENTS
CREATE OR REPLACE FUNCTION public.trg_notify_on_comment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE post_owner uuid;
BEGIN
  SELECT user_id INTO post_owner FROM public.items WHERE id = NEW.item_id;
  IF post_owner IS NOT NULL AND post_owner != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, actor_id, item_id, comment_id, created_at)
    VALUES (post_owner, 'comment', NEW.user_id, NEW.item_id, NEW.id, now())
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_on_comment AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_comment();

-- 14. NOTIFICATION TRIGGER FOR REPOSTS
CREATE OR REPLACE FUNCTION public.trg_notify_on_repost()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE post_owner uuid;
BEGIN
  SELECT user_id INTO post_owner FROM public.items WHERE id = NEW.item_id;
  IF post_owner IS NOT NULL AND post_owner != NEW.user_id THEN
    INSERT INTO public.notifications (user_id, type, actor_id, item_id, created_at)
    VALUES (post_owner, 'repost', NEW.user_id, NEW.item_id, now())
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_on_repost AFTER INSERT ON public.reposts
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_repost();

-- 15. NOTIFICATION TRIGGER FOR MENTIONS
CREATE OR REPLACE FUNCTION public.trg_notify_on_mention()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, actor_id, item_id, comment_id, created_at)
  VALUES (
    NEW.mentioned_user_id,
    'mention',
    NEW.mentioned_by,
    NEW.item_id,
    NEW.comment_id,
    now()
  )
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER notify_on_mention AFTER INSERT ON public.mentions
  FOR EACH ROW EXECUTE FUNCTION public.trg_notify_on_mention();
