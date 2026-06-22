# Riftbound Tracker — Design System

Hextech / Runeterra design system for **Riftbound Match Tracker**, a dark-mode mobile companion app for the physical *Riftbound* TCG (League of Legends' trading card game). The app is a personal match journal + a tabletop digital scoreboard.

> Unofficial fan project. Not affiliated with, endorsed, or sponsored by Riot Games. Card data conceptually sourced from community fan projects (e.g. "Riftcodex").

## Sources

- **GitHub:** [`didiegopds2684/riftbound-tracker`](https://github.com/didiegopds2684/riftbound-tracker) — subtree `design-web/` (the original web/Storybook recreation of the React Native app). This design system lifts its tokens, components, and screens directly from that source.
  - Key files: `src/theme.ts`, `src/global.css`, `src/types.ts`, `src/components/*`, `src/screens/*`.
- **Project SPEC:** the product brief calls for React Native + Tailwind (NativeWind), dark mode, strict Hextech/Runeterra aesthetics. Two flagship screens: **Champion Detail** (§5.2) and **Scoreboard / Point Counter** (§6).

Explore the repo above for deeper context before extending these designs.

---

## What the product is

Two product surfaces, one app:

1. **The Journal** — log physical matches (your Legend vs opponents' Legends), track results, formats (Bo1/Bo3), tournament types, and personal notes. Surfaces per-Legend statistics and head-to-head **matchups**.
2. **The Scoreboard** — a standalone tabletop life/point counter, laid out *face-to-face* (one half rotated 180°) so two players sitting across a table both read their own score upright.

# Core nouns: **Legend** (your champion/commander), **Match**, **Domain** (Runeterra card affinity — Body/Calm/Chaos/Fury/Mind/Order/Colorless), **Matchup** (your win-rate vs a specific opponent Legend).

---

## CONTENT FUNDAMENTALS

- **Language: Brazilian Portuguese (pt-BR).** All UI copy is in Portuguese — "Partidas", "Placar", "Vitória / Derrota / Empate", "Iniciar Placar", "Pontos para vencer".
- **Voice: second person, direct, friendly.** Speaks to the player as "você" implicitly via imperatives — *"Registre sua primeira partida!"*, *"Toque em '+ Nova' para começar!"*. The data is *yours* ("Legend favorita", "suas estatísticas").
- **Tone: concise, functional, a touch of game flavor.** No marketing fluff. Labels are short and literal. Game-world terms (Legend, Domain, Nexus Nights) are kept in their canonical form, mixed with plain Portuguese chrome.
- **Casing:** Screen titles are Title/Sentence case ("Configurar partida"). Small field labels and overlines are **UPPERCASE with wide letter-spacing** ("PONTOS PARA VENCER", "EU", "OPONENTE"). Result badges are Capitalized words.
- **Numbers lead.** Stats are front-and-center: big win-rate percentages, "2V / 1D / 1E", score summaries "2-1". Numbers are the hero of every stats view.
- **Emoji & symbols:** The original uses a few emoji/unicode glyphs as lightweight icons (⚔ 🛡 🔮 🌪 🏆 ↺ ✕ ▲▼ ←). Treat these as *placeholder iconography* — acceptable for prototypes, but prefer a real icon set (see ICONOGRAPHY). The trophy 🏆 and crossed-swords ⚔ carry brand flavor and may stay.
- **Legal footer is always present** on auth/about: "App não-oficial • Não afiliado à Riot Games".

---

## VISUAL FOUNDATIONS

The look is **League of Legends client / Hextech**: deep blue-black space, antique-gold engraved frames, and bright magical-cyan ("mana") for anything live or interactive.

- **Color & vibe:** Cool, dark, premium. Backgrounds are near-black navy (`--bg #010a15`), cards a hair lighter (`--surface #0a1428`). Two accents do all the work: **antique gold** (`--gold #c89b3c`) for frames, medals, favorite-markers, and brand; **mana cyan** (`--cyan #00bcff`) for active states, progress fills, glows, and focus. Text is warm parchment (`--text-primary #f0e6d2`) — a deliberate warm note against the cold field. Result semantics: green win `#4caf82`, red loss `#e05c5c`, grey draw `#8b8fa8`. **Domain colors** tint Legend avatars and headers.
- **Imagery:** Champion splash art (full-bleed, top-aligned, `object-position: top`) from a card-image CDN. On the Champion Detail header the splash sits behind a dark vertical **protection gradient** (transparent → `--bg`) so title text stays legible. Avatars are circular crops with a 2px domain-colored ring. Imagery vibe: rich, painterly, saturated fantasy art — let it bleed, then scrim it.
- **Type:** Display = **Cinzel** (elegant serif caps, wide tracking) for titles, champion names, big numbers — substitute for Riot's *Beaufort for LOL*. Body/UI = **Barlow** (humanist sans) — substitute for *Spiegel*. The giant score counter uses heavy weight, near-`88px`.
- **Borders & frames:** The signature motif is a **thin antique-gold hairline** (`1px solid #c89b3c`) framing KPI cards and medals. Default dividers are cool navy hairlines (`--border #1e2d4a`). Corners are **restrained** — `12px` for cards/buttons, `6px` small, pill (`999px`) only for badges and progress tracks. The aesthetic leans *beveled/sharp*, not soft-rounded.
- **Cards:** `--surface` fill, navy hairline border (gold hairline for stat/KPI cards), `12–20px` radius, generous `16–24px` padding, optional deep cool shadow (`0 2px 12px #00000055`). No drop-shadow-heavy "material" cards — depth comes from the dark field + thin frames.
- **Glow is the special effect.** Active/important elements get a cyan glow (`0 0 16px #00bcff55`) rather than a heavy shadow — progress bars, the active scoreboard side, focus rings. Use sparingly; it should feel like lit mana.
- **Backgrounds:** Mostly flat deep-navy. Accent surfaces use a translucent tint of an accent color (`#c89b3c22`, `#00bcff22`) over the dark field rather than opaque blocks — this keeps the "lit glass" feel.
- **Animation:** Subtle and quick. Opacity/width transitions \~`0.15–0.2s`, ease-out. Progress bars animate width. No bounce, no parallax. Reduced-motion friendly.
- **Hover:** lighten surface to `--surface-elevated`, or brighten an accent border/glow. **Press:** slight opacity drop (\~0.85) and/or scale-down on big touch targets; gold buttons darken.
- **Transparency & blur:** Modal/winner overlays use a `#000000AA` scrim. Accent fills are alpha-tinted. Blur is not heavily used.
- **Layout rules:** Mobile-first, single column, `~390px` design width. Fixed **bottom tab bar** (60px). Stats grids are 2-up. The scoreboard is a fixed full-height split with the top half rotated 180°. Touch targets ≥ 44px (steppers are 52px+).

---

## ICONOGRAPHY

The source app uses **emoji and unicode glyphs as icons** — a pragmatic placeholder system:

- Tab bar: ⚔ (Jogar/Play), 📋 (Partidas), 🏆 (Legends), 👤 (Perfil).
- Affordances: ← (back), ▲▼ (dropdown), ✕ (delete/close), ↺ (reset), ✓ (selected), ＋ / − (steppers), 🏆 (winner).
- Scoreboard avatars: ⚔ 🛡 🔮 🌪 🌊 🌿 💀 (pick-your-crest).

**Recommendation / substitution:** for anything beyond a quick prototype, replace these with a consistent stroked icon set. This system links **[Lucide](https://lucide.dev)** from CDN as the substitute (clean, even stroke, dark-mode friendly): `swords`, `clipboard-list`, `trophy`, `user`, `arrow-left`, `chevron-down`, `x`, `rotate-ccw`, `check`, `plus`, `minus`, `star` (favorite marker), `crown`. The crossed-swords ⚔ and trophy 🏆 may remain as brand flavor where a touch of game personality helps. **Flagged:** Lucide is a substitution — no proprietary icon font ships with the source repo.

No raster PNG icons or SVG sprite exist in the source; nothing to copy. Brand "logo" is wordmark-only (Cinzel "Riftbound Tracker" in gold) plus the ⚔ glyph as an app mark.

---

## Index / Manifest

**Root**

- `styles.css` — entry point (import manifest only).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`, `base.css`.
- `README.md` — this file. `SKILL.md` — Agent-Skill front matter.

**Foundations** (`guidelines/`) — specimen cards for the Design System tab: color palettes, domain colors, type scale, spacing, effects/glows.

**Components** (`components/core/`) — reusable primitives: `Button`, `SegmentControl`, `ResultBadge`, `Badge`, `LegendAvatar`, `MatchupBar`, `KpiCard`, `ScoreStepper`.

**UI Kit** (`ui_kits/app/`) — high-fidelity mobile recreation: interactive `index.html`, Champion Detail (§5.2), Scoreboard (§6), Matches list, Legends list, Auth, Profile, bottom tab shell.

**Assets** (`assets/`) — wordmark + notes (imagery is champion splash art served from a card CDN at runtime; none bundled).
