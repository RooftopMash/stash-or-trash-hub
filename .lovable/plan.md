# SOT Enterprise Edition — build the roadmap into this app

Important context first: the roadmap's ticked Phase 1–4 items exist in the GitHub repo Copilot pushed to, not in this app. This project has no brand workspaces, team roles, sentiment tagging, brand responses, analytics dashboard, crisis alerts, webhooks, or service worker — I checked. This app is not connected to that repo, so nothing arrives automatically; the enterprise layer gets rebuilt here, on the backend that already holds your live data (brands, posts, votes, comments, follows, incidents, messages, imports).

Nothing existing is removed. All schema work is additive.

## Phase A — Brand platform (the core of the pitch)

- **Team members with roles.** New `brand_members` table (brand + user + role: admin / analyst / viewer) sitting alongside today's single-owner `brands`. Owners are treated as admins. Invite by email from the dashboard; pending invites resolve when that person signs up.
- **Brand responses.** Brand teams reply officially to any post about their brand. Replies render on the post with a verified-brand badge, distinct from ordinary comments, and notify the post author.
- **Sentiment + category tagging.** Every post gets a category (feedback / support / complaint / praise) and a sentiment (positive / neutral / negative / unknown). Set automatically at post time from the vote and the text, overridable by the brand team.
- **Dashboard KPIs.** `/dashboard` gains: post volume, Stash %, sentiment split, unanswered posts, median response time — scoped to the brands the signed-in user has a role on.

## Phase B — CX intelligence

- **Analytics view.** 90-day trend charts (volume, sentiment mix, Stash % over time) with 7/30/90-day switches.
- **Crisis detection.** When negative share for a brand jumps 30%+ over its trailing baseline, raise a crisis alert row and notify every team member of that brand. Visible as a banner on the dashboard.
- **Influencer ranking.** Rank the users talking about a brand by trust score, follower count and engagement received.
- **CSV export.** One click export of the current analytics window.

## Phase C — Scale & polish

- **PWA.** Service worker with offline shell caching, installable manifest, offline fallback page.
- **Webhooks.** Per-brand webhook URLs with a shared secret; signed POST on new post, new crisis alert, new response. Public endpoint for inbound integrations plus a health check.
- **Performance.** Route-level code splitting and vendor chunking, image lazy-loading, Core Web Vitals pass.

## Explicitly not in this plan

- X / Facebook / Instagram / TikTok / LinkedIn sign-in — each needs credentials and app review from you. Google and email stay as-is. Say the word and I add providers once you have keys.
- Slack / Jira / Zapier, SSO/SAML, white-label, billing tiers, React Native. These are Week 3–4 items and each is a project of its own.
- Multi-language support is already live here (50+ languages); new UI strings get added to the English bundle and fall back cleanly.

## Technical notes

- Migrations: `brand_members`, `brand_responses`, `crisis_alerts`, `brand_webhooks`; additive columns `items.category` (already present), `items.sentiment`, `items.responded_at`. Each new public table ships GRANTs plus RLS — reads scoped to brand membership via a `has_brand_role(brand_id, role)` security-definer function, writes scoped to `auth.uid()`. Public read stays on `brand_responses` only.
- Membership checks go through the security-definer function, never a direct policy read of `brand_members`, to avoid recursive RLS.
- Analytics aggregation runs as SQL functions called from authenticated server functions, not client-side row scans.
- Crisis evaluation runs on insert of a vote/post via trigger writing to `crisis_alerts`, deduped per brand per 24h.
- Webhook delivery goes through a TanStack server route under `src/routes/api/public/`, HMAC-signed, with signature verification on inbound.
- Dashboard/analytics routes live under `_authenticated/`; public post and brand pages stay SSR for shareable OG previews.

## Order of work

Phase A first and deployed on its own, since it is what a board demo needs: a brand team logging in, seeing their KPIs, and replying to a real customer post. Then B, then C.
