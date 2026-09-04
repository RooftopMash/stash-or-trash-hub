# Easier judging everywhere + Phase B (CX intelligence)

Three usability fixes you asked for, then the Phase B analytics layer.

## 1. Brand logos fit their picture slots

Logos are currently cropped to fill the square, so wide wordmarks get chopped.

- Logos will be shown whole (fitted, never cropped) on the brand rail, brand list, brand page header and anywhere else a logo appears, on a soft neutral pad so pale logos stay visible.
- Posts with no photo will show the brand's logo in the picture slot instead of a blank card, so the feed never looks empty.

## 2. Choose Stash or Trash while posting

The post box gets a required verdict choice: two big gold STASH / chrome TRASH buttons, in the same style as the feed buttons.

- Your pick is saved as your own vote on the post the moment it goes live, so the meter is never at 0.
- You can still change or remove your verdict afterwards on the card, as today.

## 3. Stash or Trash directly on a brand

After searching a brand and opening it, the verdict is the first thing on the page.

- A prominent "Stash or Trash {Brand}?" panel at the top of the brand page, with the gold/chrome buttons and a live community meter (percentage plus vote count).
- One tap records your verdict on the brand itself — no need to write a post first. Tap again to change it.
- Under it, a one-line prompt to add a photo/story (opens the post box already tied to that brand).
- Signed-out visitors see the panel, and tapping sends them to sign in and returns them to the brand.
- Same panel appears on the brand cards in the feed rail as a compact two-button shortcut.

## 4. Phase B — CX intelligence (brand dashboard)

- **Trends:** volume, sentiment mix and Stash % over time, with 7 / 30 / 90-day switches.
- **Crisis alerts:** when a brand's negative share jumps 30%+ above its trailing baseline, an alert is raised, the team is notified, and a banner shows on the dashboard until dismissed.
- **Top voices:** the users talking about the brand ranked by trust score, followers and engagement received.
- **CSV export:** one click download of the current window.

All new text goes through the existing translation system, so every language keeps working.

## Technical notes

- Migration (additive only): `brand_votes` (user_id, brand_id, verdict, unique per user/brand) with RLS + grants; `brand_crisis_alerts` (brand_id, opened_at, negative_share, baseline, resolved_at) with team-scoped reads via `has_brand_role`; SQL functions `brand_verdict_summary(brand_id)`, `brand_trend(brand_id, days)`, `brand_top_voices(brand_id, days)`; a trigger on vote insert that evaluates the crisis threshold and inserts notifications.
- New `src/components/BrandVerdict.tsx` (panel + compact variant), `src/components/BrandLogo.tsx` (shared fitted-logo renderer used by QuickBrands, brands list, brand header, ItemCard fallback).
- `src/lib/brands.ts` gains `castBrandVote`, `removeBrandVote`, `fetchBrandVerdict`; `src/lib/brand-platform.ts` gains the Phase B analytics readers.
- `SubmitDialog` adds a verdict field; `createItem` in `src/lib/stash.ts` accepts an optional verdict and casts it after insert.
- Dashboard analytics use `recharts` (already available via shadcn chart) and the existing KPI card layout; CSV built client-side, no new deps.
