# Items 1–3: Finish and wire up the social layer

Goal: get the social layer (likes, reposts, threaded comments, follows, hashtags, notifications) actually visible and working in the app, with every new string translated, and the build/typecheck fully green.

## 1. Fix the two remaining code errors

- `src/routes/hashtags.$tag.tsx` calls the database client without importing it, and mixes two different ways of finding tagged posts. Rewrite it to use the hashtag tables through the existing social library, then render the matching posts from the feed. Show trending tags as suggestions when a tag has no posts.
- `src/routes/_authenticated/notifications.tsx` builds links as raw strings (`/items/...`, `/users/...`) to routes that do not exist yet. Switch to typed links pointing at the new routes below.

## 2. Add the two missing destination pages

- **Post detail** (`/items/$id`): public page showing one post, its verdict meter, Stash/Trash buttons, like/repost actions and the full comment thread. Own head metadata (title/description/og) built from the post so shared links preview correctly.
- **Public profile** (`/users/$id`): display name, bio, avatar, trust score, follower count, Follow/Unfollow button, and that person's posts.

## 3. Make the social layer visible in the feed

- Render the existing `ItemCardActions` (like, repost, comment, share) and a collapsible `CommentThread` inside `ItemCard`, so every post in the feed can be liked, reposted and discussed.
- Show `TrendingHashtags` in the home page sidebar/section, linking to `/hashtags/$tag`.
- Turn `#tags` and `@mentions` inside post text into links.
- Add a notifications bell with unread badge to the header (reusing the existing unread-count hook pattern) so the inbox is reachable.

## 4. International: no new English-only strings

Every label, button, toast and empty state added above goes through `t()`, with keys added to the master English table and translated into all languages already bundled in the project (currently 20). Notification sentences ("X liked your post", "X started following you", etc.) become translated templates with the actor name interpolated, replacing the current hardcoded English.

## 5. Verify before handing over

- Typecheck clean and build green.
- Drive the running app in a browser to confirm: feed renders with actions, a comment posts and appears, a like/repost toggles, a hashtag page loads, a post detail page loads, notifications page renders with working links.

## Technical notes

- Route files: new `src/routes/items.$id.tsx` and `src/routes/users.$id.tsx` (public, SSR on, no auth gate; sign-in-required actions render an inline "Sign in to…" CTA instead of redirecting). Each gets `errorComponent` + `notFoundComponent`.
- Data reads reuse `src/lib/social.ts` and `src/lib/stash.ts`; no new tables needed — the social schema is already migrated with RLS and grants.
- Translations extend `src/lib/locale-en.ts` and `src/lib/locales.ts`; `i18n.ts` already falls back per key to English, so any language not yet filled degrades gracefully rather than showing blank labels.

## Not in this batch (next up)

Brand discovery/search, live incident broadcasting, AI media-authenticity audit, user reliability scores, live awards standings, remaining languages.
