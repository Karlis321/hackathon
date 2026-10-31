# Matrica pitch: Climathon 2026

A 3-minute interactive pitch for the Sadales tīkls challenge.

## Present it
- **Online:** https://karlis321.github.io/hackathon/ (GitHub Pages, from the `gh-pages` branch). To update it after `npm run build`, copy `dist/` into `.deploy/`, commit there and push to `gh-pages`.
- **From a USB stick or any folder:** open `dist/index.html` in Chrome or Edge. The deck is fully offline. Keep `dist/` together, because the photos, logos and video sit next to `index.html`.
- **Backup:** `matrica-pitch.pdf`, all 10 pages including the appendix.

## Keys
| Key | Does |
|---|---|
| → / Space / clicker | Next slide |
| ← | Previous slide |
| `S` | Presenter window: timer (3:00), current and next slide, speaker notes |
| `F` | Fullscreen |
| `A` | Appendix (sources, credits, assumptions) |
| `T` (presenter window) | Restart the timer |

Interactive parts: drag the before/after photo (slide 3), click the video to pause (slide 4), hover logos on the map (slide 5), move the price and transformer sliders (slide 6).

## Edit
- Team names: `src/data.ts` → `TEAM.members`. They then show on the last slide.
- Text and speaker notes: `src/slides.tsx`.
- Run locally: `npm install`, then `npm run dev`.
- Rebuild the offline deck: `npm run build`.
- Video: `cd video && npm install && npm run render`. It writes to `public/video/how-it-works.mp4`.
- PDF: build first, then run `node scripts/export-pdf.mjs "file:///<full path>/dist/index.html"` and `python scripts/make-pdf.py`.

Every image, logo and dataset is listed with its licence in `CREDITS.md`.
