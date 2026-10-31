# Prompt: Matrica pitch for Climathon 2026

Paste everything below the line into Claude Code, opened in `C:\hackathon`.

---

You are building the final pitch for team **Matrica** at **Climathon 2026** (RTU, Rīga, 30 Oct – 1 Nov 2026), challenge by **AS "Sadales tīkls"**: *"Otrā dzīve elektrotīkla materiāliem"* (second life for power-grid materials). The pitch is presented live in **3 minutes** to a jury, in **English**. Build it as a premium, interactive web presentation that runs offline from a laptop.

## Source material (read all of it first)

- `Otra_dzive_elektrotikla_materiliem_RTU.docx.pdf`: the challenge brief and what the jury wants to see.
- `Otra_dzive_elektrotikla_materialiem_RTU_dati.xlsx - Kabeli, stabi un pastabi.pdf`: Sadales tīkls stock list of cables, poles and sub-poles.
- `README.md`: event facts, judging criteria, prizes, schedule.
- `research/grid-shield.html`: our full business research. **This is the source of truth for every number and claim.** Do not invent figures. Anything the research marks as an estimate or hypothesis is labelled "estimate" on the slide too.

## Our idea in one line

Matrica turns cable offcuts and dismantled concrete poles that Sadales tīkls has to dispose of into **drone-protection screens around small critical infrastructure**: first 110/20 kV substation transformers, then the grid batteries and gas stations.

## The product (show exactly this design)

- **Posts:** intact dismantled concrete poles and reusable concrete sub-poles (PT 4–6 m), set about 2 m out from the transformer.
- **Screen:** whole cables, insulation kept on, **laid straight and tied at every crossing**, in a grid of about 10 cm. No stripping, bending or weaving.
- **Thick cables** run horizontally across the lower part, in front of the radiators.
- **Overhead AMKA cable** is used whole as the top and bottom tension rope.
- **Broken concrete poles** are crushed into a low gabion wall at the base.
- **Safety:** the lattice is earthed and kept outside the 110 kV clearance zone.
- **Limits, stated honestly:** it stops FPV and small drones and debris. It does not stop Shahed-class drones or missiles. Version 1 covers the sides only.

**Process, six steps:**
1. Collect: crews throw offcuts in one bin, so no new work for them.
2. Check: only metal that has melted or crumbles is rejected.
3. Sort by thickness: thin → grid, thick → low slats, AMKA bundles → rope.
4. Set the concrete posts and fill the base wall.
5. Build the lattice.
6. Earth it and inspect it yearly.

## Slide structure and timing (3:00 total)

Put a live presenter timer on screen in presenter mode, with a target time per slide.

| # | Slide | Time | Content |
|---|---|---|---|
| 1 | **Title** | 0:00–0:10 | Matrica logo, the line "Grid waste becomes grid shield", Climathon 2026 · Sadales tīkls challenge. |
| 2 | **Problem** | 0:10–0:35 | Two problems at once. (a) **Waste:** cable offcuts too short to reuse, concrete poles that crumble on removal with no reuse today (from the brief). (b) **Threat:** drones attack grid transformers. Ukraine evidence, and Lithuania spending €48M+ to harden one substation. **BEFORE image** full-bleed. |
| 3 | **Solution** | 0:35–1:05 | The cable lattice on concrete posts around one transformer. **AFTER image.** Three material callouts: cable → screen, concrete → posts and wall, AMKA → rope. |
| 4 | **How it works** | 1:05–1:30 | **The video** (below) plus the six steps. Say it plainly: "Crews only throw cable in a bin." |
| 5 | **Where** | 1:30–1:50 | **Real Baltic map** with the target sites and company logos (see Map). The scored list of small critical objects, top three highlighted. |
| 6 | **Economics** | 1:50–2:20 | Per transformer: our cost €10–14k, price €18–25k, service ~10% a year, **all labelled estimates**. Market: ~250–300 transformers in Latvia ≈ €5–6M, about 3× across the Baltics. Value to Sadales tīkls: lower disposal cost plus protection. An interactive slider for price and number of transformers that updates revenue. |
| 7 | **Practical** | 2:20–2:35 | Safety rules, what it stops and doesn't, and the pilot: 2–5 transformers in Latgale (eastern border region) with Sadales tīkls. |
| 8 | **Partners and funding** | 2:35–2:50 | Logo wall in three groups: **material suppliers**, **buyers**, **delivery partners**. Under it, EU programmes: Latvian dual-use (LIAA/ALTUM), LIFE, Horizon Europe Cluster 3, EIC Accelerator, Interreg Baltic Sea Region. |
| 9 | **Future** | 2:50–3:00 | A Baltic take-back network: three hubs (Rīga, Tallinn, Vilnius/Kaunas), every grid, telecom and renewables company as a supplier, screens built in the country the material came from. The ask: **"Pilot with Sadales tīkls on 2–5 transformers."** |

Add an **appendix** after slide 9, not presented and reached by key: sources, image and logo credits, assumptions behind the economics, and the full scored object table.

## Logos and honesty

- **No company has agreed to work with us yet.** Title the logo wall and map legend **"Target suppliers, customers and partners"**. Never write "partners" or "clients" on its own. Put a small footnote: "No agreements yet. Logos belong to their owners."
- Companies:
  - **Suppliers and buyers:** Sadales tīkls, AST, Latvenergo, Conexus Baltic Grid, Gaso, LVRTC, Tet, LMT, Tele2, Bite, LDz, Elektrilevi, Elering, ESO, Litgrid, Ignitis, Telia.
  - **Delivery partners:** Eltel, Energofirma "Jauda", VINCI Energies, Eco Baltia, NKT, Prysmian, Origin Robotics, SAF Tehnika.
- Get each logo as SVG, or PNG if SVG doesn't exist, from **Wikimedia Commons** first, then the company's own press or media page. Save to `public/logos/` with the source URL in `CREDITS.md`. If you can't find an official logo, show a clean text wordmark instead. **Never draw or imitate a company logo.**
- Show logos in one neutral treatment (monochrome or on a light tile) so the wall looks consistent.

## Map

- A real map of Latvia, Lithuania and Estonia from **Natural Earth** country data (GitHub repo `nvkelso/natural-earth-vector`, or `mledoze/countries` for single-country GeoJSON). Render it with **d3-geo** as SVG so it works offline. No online tile servers.
- Plot the target sites from `research/grid-shield.html` (the `sites` array in its script): grid batteries, eastern 110 kV substations, the hydro plants, Inčukalns and so on, plus the three future hubs.
- Place each company's logo at its head-office city. On hover or click, show the company, its role (supplier, buyer or partner) and what it would supply or buy.
- Mark the eastern border pilot region.
- Positions are approximate, at town level. Say so in a small note.

## Images: one BEFORE, one AFTER, both real photographs

- **BEFORE:** a real photo of an **unprotected 110 kV substation transformer in open country**, or of a **scrap pile of cable offcuts and broken concrete poles**. Search **Wikimedia Commons** first (CC BY / CC BY-SA / public domain). The Unsplash and Pexels licences are also acceptable.
- **AFTER:** we have no photo of our own product yet. Use a **real photo of anti-drone netting protecting infrastructure in Ukraine** as the reference. Wikimedia Commons, Ukrainian Ministry of Defence or ArmyInform material under CC BY 4.0 are good sources. Caption it: **"Reference: anti-drone protection in Ukraine. Matrica builds this from grid waste."**
- Make slide 2→3 an interactive **before/after drag slider** between the two images.
- Record every image's author, licence and URL in `CREDITS.md`, and show a one-line credit on the slide.

## Video: how the product works

- Build a **20–30 second animated explainer** with **Remotion** (GitHub `remotion-dev/remotion`), rendered to MP4 at `public/video/how-it-works.mp4`, 1920×1080, 30 fps, no audio.
- Storyboard:
  1. A Sadales tīkls crew drops cable into a bin.
  2. The bin arrives at the Matrica workshop.
  3. Cables are sorted by thickness into three piles.
  4. Concrete posts are set around a transformer.
  5. Cables are laid straight in a 10 cm grid and tied at the crossings.
  6. AMKA rope goes along the top.
  7. A small drone approaches, hits the lattice 2 m out, and the transformer is untouched.
  8. End card: "Grid waste becomes grid shield."
- Style: clean isometric or flat technical illustration in the deck's colours, with smooth easing.
- Embed it on slide 4: autoplay, muted, loop, with a play/pause control.
- If you can find a short, properly licensed real clip of anti-drone nets in Ukraine on Wikimedia Commons, you may add it to the appendix with credits. The main video is our own Remotion animation.

## Matrica logo (generate it)

- Make an original SVG logo. The idea is a **matrix of crossing lines**: a 3×3 lattice whose lines form an "M", echoing the cable grid. Add the wordmark **MATRICA** in a strong geometric sans.
- Deliver a full-colour version, a one-colour white version for dark backgrounds, and a square icon for the favicon.
- Save to `public/brand/`.

## Design: premium, not template

- 16:9 stage, scaled to any screen. Dark theme: deep graphite background, one signal accent (high-visibility orange, the colour of grid safety gear), a cool steel-blue second colour, off-white text.
- Typography: a characterful display face (for example **Archivo** at 800) with a clean body face (**Public Sans** or **Inter**) and a mono for numbers (**JetBrains Mono**). Load them from Google Fonts and also bundle them locally for offline use.
- Big type, one idea per slide, numbers as the hero on the economics slide. No clip-art, no stock icons, no purple gradients, no emoji.
- Motion: one orchestrated entrance per slide (Framer Motion). Lattice lines drawing themselves on the title and solution slides. Respect `prefers-reduced-motion`.

## Interactivity and presenting

- Arrow keys, space and a clicker move between slides. A progress bar runs along the bottom.
- `S` opens presenter mode in a second window: current and next slide, **speaker notes**, and a 3:00 countdown with a per-slide target.
- `F` for fullscreen, `A` for the appendix.
- Map hover and click, the before/after slider, the economics slider, video controls.
- Everything works **offline**: all fonts, images, logos, map data and video are stored in the project.

## Speaker notes

Write a speaker script for every slide that fits its time slot when read at a natural pace, about 130 words per minute, so roughly 390 words in total. Plain, confident English. End on the ask.

## Tech and deliverables

- Vite + React + TypeScript + Framer Motion + d3-geo. Remotion in a separate `video/` folder.
- Create it in `pitch/`. Run with `npm install` and `npm run dev`. `npm run build` produces a static `dist/` that opens from a USB stick.
- Export a **PDF backup** of the slides with Playwright (`pitch/matrica-pitch.pdf`) in case the laptop fails.
- `CREDITS.md`: every logo, image, video clip and dataset, with source URL and licence.
- At the end, open the presentation in the browser, click through all slides at 1920×1080, and fix anything that overflows, overlaps or fails to load.

## Rules

- Every number comes from `research/grid-shield.html` or the RTU PDFs. Estimates are labelled "estimate".
- No fake partnerships, quotes or testimonials.
- Don't use military imagery of weapons. Show protection of civilian infrastructure only.
- Before you start, **ask me**:
  - the team members' names and roles for the title or closing slide
  - who presents which slides
  - whether I have my own photos (for example of the actual offcuts at the event) to use instead of the stock BEFORE image
