-- Migration for User Profile Media Storage & Friends System

-- 1. USER MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.user_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video', 'audio')),
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_media_user_id_idx ON public.user_media (user_id);

GRANT SELECT, INSERT, DELETE ON public.user_media TO authenticated;
GRANT SELECT ON public.user_media TO anon;
GRANT ALL ON public.user_media TO service_role;
ALTER TABLE public.user_media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "User media public select" ON public.user_media;
CREATE POLICY "User media public select" ON public.user_media FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users manage own media" ON public.user_media;
CREATE POLICY "Users manage own media" ON public.user_media FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. FRIENDS TABLE
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT friends_user_friend_key UNIQUE (user_id, friend_id)
);

CREATE INDEX IF NOT EXISTS friends_user_id_idx ON public.friends (user_id);
CREATE INDEX IF NOT EXISTS friends_friend_id_idx ON public.friends (friend_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.friends TO authenticated;
GRANT ALL ON public.friends TO service_role;
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Friends viewable by participants" ON public.friends;
CREATE POLICY "Friends viewable by participants" ON public.friends FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

DROP POLICY IF EXISTS "Users can send friend requests" ON public.friends;
CREATE POLICY "Users can send friend requests" ON public.friends FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can accept friend requests" ON public.friends;
CREATE POLICY "Users can accept friend requests" ON public.friends FOR UPDATE TO authenticated
  USING (auth.uid() = friend_id OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete friendship" ON public.friends;
CREATE POLICY "Users can delete friendship" ON public.friends FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- 3. STORAGE BUCKET FOR USER MEDIA
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-media', 'user-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "user media public read" ON storage.objects;
CREATE POLICY "user media public read" ON storage.objects FOR SELECT
  USING (bucket_id = 'user-media');

DROP POLICY IF EXISTS "user media insert" ON storage.objects;
CREATE POLICY "user media insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-media' AND auth.role() = 'authenticated');
