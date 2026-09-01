# Vote buttons: real logo artwork icons

Replace the thin outline icons on the vote buttons with artwork lifted from your S·O·T logo: the gold coin for STASH, the chrome trash can for TRASH.

## What you'll see

- STASH button: the gold dollar coin from the logo (same bevel, shine and dark keyline) sitting left of the italic STASH label.
- TRASH button: the ribbed chrome trash can from the logo, left of the italic TRASH label.
- Both icons crisp on the existing gold and chrome button faces, scaled to sit on the same baseline as the text, with a soft drop shadow so they read against the gradients.
- Icons stay put in the picked / dimmed states — the coin brightens slightly when STASH is your verdict, the can does the same on TRASH.

## How it's built

1. Crop the coin and the trash can out of `public/icons/web-app-manifest-512x512.png` using the image edit tool, cleaned to transparent PNGs:
   - `src/assets/icon-coin.png` — single gold coin, front-facing, transparent background.
   - `src/assets/icon-bin.png` — chrome trash can with lid, transparent background.
2. In `src/components/ItemCard.tsx`, drop the Lucide `Coins` and `Trash2` imports and render `<img>` tags for the two assets at roughly 20px, with `alt=""` and `aria-hidden` (the button text carries the label).
3. Add a small `verdict-icon` utility in `src/styles.css` for sizing, drop shadow and the brightness lift used in the picked state.
4. Verify in the preview that both buttons render the logo artwork and remain legible at mobile widths.

No behaviour, voting logic, or data changes.
