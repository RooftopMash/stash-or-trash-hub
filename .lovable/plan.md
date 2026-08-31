# Restyle the Stash / Trash vote buttons to match the SOT logo

The logo (favicon set) has a very specific look: a deep charcoal/near-black badge with a red outline, bold italic white lettering with red underscores, gold coins on the "Stash" side and a chrome/silver bin on the "Trash" side.

Right now the two vote buttons are generic outline buttons — thin green and thin red. They will be rebuilt so they read as if they were cut straight out of the logo.

## What changes

**Stash button — the "gold coins" side**
- Gold gradient face (warm amber to deep gold), like the coins in the mark
- Dark charcoal bold italic label with a subtle raised highlight along the top edge
- Coin-stack icon instead of the thumbs-up
- Thin dark outline, matching the logo's black keyline

**Trash button — the "chrome bin" side**
- Brushed chrome/silver gradient face with the logo's red keyline
- Dark bold italic label, same type treatment as Stash
- Bin icon kept, drawn in the logo's metal tones

**Shared treatment**
- Bold italic uppercase labels with a slight skew, echoing the logo's lettering
- Dark keyline + soft drop shadow so both buttons sit on the card like badges
- Tactile press: presses down slightly and the highlight dims
- Selected verdict locks in: the chosen side stays fully lit with a glow, the other side desaturates so your vote is unmistakable

Nothing else on the card moves — the verdict meter, title, and the comment/like/repost/share row stay exactly as they are. Voting behaviour is untouched.

## Technical notes

- New semantic tokens in `src/styles.css` sampled from the logo: gold (base/light/dark), chrome (base/light/dark), logo keyline black, logo red — plus gradient and shadow tokens built on them. No hardcoded hex in components.
- Two new `buttonVariants` entries in `src/components/ui/button.tsx` (`stash` and `trash`) so the styling is reusable and theme-safe.
- `src/components/ItemCard.tsx` swaps the two `Button` calls to the new variants and applies the selected/unselected state classes; icons swapped to `Coins` and `Trash2` from lucide.
- Labels keep coming from `t("vote.stash")` / `t("vote.trash")`, so all 20 languages still work; the italic/uppercase styling is CSS only.
