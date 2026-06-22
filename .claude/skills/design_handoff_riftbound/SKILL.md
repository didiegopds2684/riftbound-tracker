---
name: riftbound-tracker-design
description: Use this skill to generate well-branded interfaces and assets for Riftbound Tracker (a Hextech / Runeterra dark-mode mobile match-tracker for the physical Riftbound TCG), either for production or throwaway prototypes/mocks. Contains design guidelines, colors, type, fonts, assets, and UI-kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `styles.css` — link this once; it `@import`s all tokens + fonts.
- `tokens/` — colors (deep navy surfaces, antique gold, mana cyan, result + domain colors), typography (Cinzel display / Barlow body), spacing, effects (glows, gold frames).
- `components/core/` — Button, SegmentControl, ResultBadge, Badge, LegendAvatar, MatchupBar, KpiCard, ScoreStepper. Each has a `.prompt.md`.
- `ui_kits/app/` — full mobile recreation incl. Champion Detail (§5.2) and Scoreboard (§6).
- `guidelines/` — foundation specimen cards.

## Non-negotiables
- Dark mode only. `--bg #010a15`, cards `--surface #0a1428`.
- Gold (`#c89b3c`) for frames/medals/favorite; cyan (`#00bcff`) for active/live/glow — used sparingly as "lit mana".
- Warm parchment text (`#f0e6d2`) on the cold field. Restrained radii; thin hairline frames, not heavy shadows.
- Copy is Brazilian Portuguese, concise, second-person imperative. Numbers lead.
- Fonts Cinzel + Barlow are substitutes for Riot's Beaufort for LOL / Spiegel — swap for licensed faces in production.
