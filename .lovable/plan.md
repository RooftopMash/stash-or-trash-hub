# Finish the backend the app already expects — no data loss

Short answer to your question: **no, you lose nothing.** We are not rebuilding or wiping anything. Everything currently in the database (your post, users, brands, votes, follows, comments, likes, notifications, messages, import candidates) stays exactly as it is. The work is purely additive: create the two things that are missing and leave the rest untouched.

## What's actually missing (verified against the live database)

The app code was already written for these, but the database never got them — that's why those screens fail:

- **Live incidents** — `src/components/LiveIncidents.tsx` and `src/lib/incidents.ts` read and write an `incidents` table and an `incident-media` storage bucket. Neither exists.
- **Media audit / AI-trace check** — `src/lib/stash.ts` reads and writes `audit` and `phash` on posts (used by the AI-audit badge and duplicate-image detection). Those two columns don't exist on the posts table, so the code silently falls back to "no audit".

Everything else from that runbook's list of tables already exists here and is correct. There is nothing to migrate to another project — the app is pointed at the right database; the schema was just incomplete.

## What I'll do

1. **Add the `incidents` table** (author, optional brand, title, description, media path, media type, latitude/longitude, timestamp) with row-level security: anyone can read, signed-in users create their own, authors and admins can delete. Enable realtime so the Live Incidents strip updates as reports come in.
2. **Create the private `incident-media` storage bucket** with upload/read policies matching the existing image bucket, so incident photos, video and audio work through signed URLs.
3. **Add `audit` (JSON) and `phash` (text) to posts** as nullable columns, plus an index for the duplicate-image lookup. Existing posts stay valid with empty audit data; new uploads get a real audit badge and reused-image detection.
4. **Wire the incident reporter UI** — a "Report live incident" composer on the feed (title, optional brand, media capture, optional location) that calls the existing `createIncident`, so the Live Incidents panel has a way to be filled.
5. **Regenerate database types and verify** — build check, then a browser pass on the feed to confirm incidents render, an incident can be posted, and the audit badge appears on a new upload.

## Technical notes

- One additive migration: `CREATE TABLE public.incidents` with GRANTs to `authenticated`/`anon` (read) and `service_role`, RLS enabled with policies, plus `ALTER TABLE public.items ADD COLUMN audit jsonb`, `ADD COLUMN phash text` and a `phash` index. No drops, no renames, no type changes.
- `incidents.media_url` stores the storage path (not a public URL); `src/lib/incidents.ts` already signs it for 7 days.
- Storage bucket `incident-media` stays private, with per-user folder-prefixed insert policy like `item-images`.
- Realtime: add `incidents` to the publication so `subscribeToIncidents` receives changes.
- After the migration, regenerate `src/integrations/supabase/types.ts` so the `as never` / fallback casts in `stash.ts` and `incidents.ts` can rely on real types.
