# Yes — and here is how

Short answer to your question: **Yes.** Everything you listed is buildable on this stack — social feed, real-time broadcasts, global brand coverage, full translation, awards, reliability scores, and AI authenticity checks on uploads. It is more than one sitting of work, so the plan below is ordered so the app is live and usable at every step.

## Step 0 — Fix the broken preview (first, immediately)

The preview fails because half a social layer was added without its foundations:

- `src/lib/social.ts` does not exist, but `TrendingHashtags`, `/hashtags/$tag`, `/notifications` and `ItemCardActions` all import it.
- Those screens also reference database tables that were never created (likes, comments, reposts, hashtags, notifications, follows).

Fix: create the missing tables + security rules, then write `src/lib/social.ts` with the like/unlike, repost, comment, hashtag and notification functions those screens expect, and clean up the type errors in the notifications and hashtag routes.

## Step 1 — Real social layer (so people can live on the app)

- Likes, reposts, threaded comments on every verdict post.
- Follow users and follow brands; a "Following" feed tab next to "Latest" and "Trending".
- @mentions and #hashtags that link to real pages, with a live trending sidebar.
- Notifications inbox: someone voted, commented, followed, replied, or claimed your brand.
- Direct messages already exist — add real-time typing/read state and brand-to-user threads.

## Step 2 — Brands people can actually find and trash

Today a user cannot trash a brand because there is nothing to search. Fix that:

- A prominent search box on the home page and in the post dialog: type "Coca-Cola", pick it, verdict it.
- If a brand is not there yet, "Add this brand" creates it instantly (unverified) so the verdict is never blocked.
- Auto-fill from the world's open brand databases by the user's country, so lists are populated before anyone arrives — the importer exists; it gets run per country and the results published, not left sitting in a queue.
- Brand pages get Stash %, verdict volume, trend over time, category rank and country rank.

## Step 3 — Live incident broadcasting

- "Go Live / Report Now" button: capture photo, video or voice note straight from the phone, with timestamp and optional location, posted as a live incident against a brand.
- Incidents appear in a real-time feed that updates without refresh, so others can corroborate or dispute.
- Brands get an alert on their dashboard the moment an incident names them.

## Step 4 — Authenticity: the AI audit layer

- Every uploaded photo, video or audio is checked on upload for AI-generation and manipulation traces, and gets a badge: Verified capture / Unverified / Likely synthetic.
- Content flagged as likely synthetic is de-weighted in brand scores and visibly labelled — brands never get punished by a fake.
- Cross-checks: duplicate/reused media detection, burst-voting detection, and account age weighting.

## Step 5 — Ratings that behave like a rating agency

- Brand Barometer grade per brand (letter grade + Stash %), weighted by verifier reliability, not raw vote count.
- User Reliability Score: rises with corroborated, authentic, consistent contributions; falls with pranks, synthetic media and flagged posts. Published on the profile.
- Country and sector indices — the "social narrative for economic performance" angle.

## Step 6 — Awards

- Awards page with live standings: Most Stashed, Most Trashed, Biggest Turnaround, Most Reliable Voice, and a public method note explaining how each is computed.

## Step 7 — Translation for real customers, everywhere

- Complete the remaining language bundles so every screen — not just the menu — reads natively, and auto-select language from the visitor's browser/country on first visit with a manual override.

## Technical notes

- New tables: `follows`, `post_likes`, `post_comments`, `reposts`, `hashtags`, `post_hashtags`, `notifications`, `incidents`, `media_audits`, `brand_scores`. Each gets row-level security scoped to the owner plus public read where the content is public, and explicit grants.
- Real-time via the database's realtime channels for the incident feed, notifications and DM threads.
- AI authenticity checks and grading run through the built-in AI gateway inside server functions, never in the browser.
- Scores stay computed in the database (extending the existing trust triggers) so they cannot be tampered with from the client.

## Suggested build order for our remaining sessions

1. Step 0 + Step 1 (preview fixed, social layer live).
2. Step 2 + Step 6 (brand discovery + awards standings).
3. Step 3 + Step 4 (live incidents + AI audit).
4. Step 5 + Step 7 (grades, reliability, full translation).
