-- Mutual connection ('friends') table supporting pending, accepted, and blocked states
CREATE TABLE IF NOT EXISTS public.friends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  bond_tag text NOT NULL DEFAULT 'stranger',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT friends_no_self_connection CHECK (requester_id <> addressee_id),
  CONSTRAINT friends_unique_pair UNIQUE (requester_id, addressee_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS friends_canonical_pair_idx
  ON public.friends (least(requester_id, addressee_id), greatest(requester_id, addressee_id));

CREATE INDEX IF NOT EXISTS friends_requester_status_idx ON public.friends (requester_id, status);
CREATE INDEX IF NOT EXISTS friends_addressee_status_idx ON public.friends (addressee_id, status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.friends TO authenticated;
GRANT ALL ON public.friends TO service_role;

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own friend connections" ON public.friends;
CREATE POLICY "Users can view their own friend connections" ON public.friends
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = requester_id OR (SELECT auth.uid()) = addressee_id);

DROP POLICY IF EXISTS "Users can send friend requests" ON public.friends;
CREATE POLICY "Users can send friend requests" ON public.friends
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT auth.uid()) = requester_id
    AND requester_id <> addressee_id
    AND status IN ('pending', 'blocked')
  );

DROP POLICY IF EXISTS "Participants can update friend status" ON public.friends;
CREATE POLICY "Participants can update friend status" ON public.friends
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = requester_id OR (SELECT auth.uid()) = addressee_id)
  WITH CHECK (
    ((SELECT auth.uid()) = requester_id OR (SELECT auth.uid()) = addressee_id)
    AND status IN ('pending', 'accepted', 'blocked')
  );

DROP POLICY IF EXISTS "Participants can delete friend connections" ON public.friends;
CREATE POLICY "Participants can delete friend connections" ON public.friends
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid()) = requester_id OR (SELECT auth.uid()) = addressee_id);

DROP TRIGGER IF EXISTS update_friends_updated_at ON public.friends;
CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON public.friends
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.friends IS 'Mutual friend connections between users with pending, accepted, and blocked states.';
