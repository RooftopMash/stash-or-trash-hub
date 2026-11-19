# SOT Roadmap

## Done
- [x] Store-compliance migration applied (`ugc_reports`, `user_blocks`, `account_deletion_requests`, `user_consents`, `content_appeals`, `items.dispute_*`)
- [x] Admin moderation policies + appeals queue alignment
- [x] Admin UGC reports moderation queue (`AdminReportsQueue` in `/admin` and `/dashboard`)
- [x] Dashboard brand-picker rewrite (searchable brand catalog picker + custom identity editor) & grounded real KPIs
- [x] Private calling & live room unification (unified `/src/lib/rtc-signaling.ts` + Agora/WebRTC screen share track replacement + hardware device switcher + incoming ringtone + call decline propagation + persisted desk threads)
- [x] Gemini AI verification & barcode scan truthfulness (valid Gemini 4 models, zero hallucinated fallback receipts/scores, honest error states when `GEMINI_API_KEY` is absent)
- [x] Firestore list rule hardening (`/messages` and `/notifications` owner-scoped list rules + query alignment)
- [x] CI E2E Preview SSO detection + port 3000 alignment (`playwright.config.ts`, `preview-e2e.yml`, `public.smoke.spec.ts`)
- [x] Watermarks: wired gold coins + trash can artwork into home hero and index

## Open (Production Credentials & Next-Phase Ops)
- [ ] Verify watermark visuals & full E2E suite against live production domain once Vercel Deployment Protection SSO is bypassed or disabled for public previews
- [ ] Production secrets setup on hosting environment: `AGORA_APP_ID`, `AGORA_APP_CERTIFICATE`, `TURN_URL`/`TURN_USERNAME`/`TURN_CREDENTIAL`, and `GEMINI_API_KEY`
- [ ] Push Supabase RLS admin policy for moderators on `public.ugc_reports` and real B2B billing payment gateway webhooks
- [ ] Dual-backend consolidation (optional future bundle optimization removing legacy Firebase/Firestore overlap)
- [ ] Real teammate invitations (need email addresses from Rooftop)
