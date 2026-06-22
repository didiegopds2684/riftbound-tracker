# Handoff: Riftbound Match Tracker — UI (Hextech / Runeterra)

## Overview
Mobile dark-mode UI for **Riftbound Match Tracker**, a companion app for the physical *Riftbound* TCG. Two product surfaces: a **match journal** (log matches, per-Legend stats, head-to-head matchups) and a **tabletop scoreboard** (face-to-face point counter). Target stack: **React Native + NativeWind (Tailwind)**, dark mode only.

## About the Design Files
The files in this bundle are **design references created in HTML/React-for-browser** — prototypes that show the intended look and behavior. They are **not production code to copy verbatim**. The task is to **recreate these designs in the target React Native + NativeWind codebase** using its established patterns (RN primitives `View`/`Text`/`Pressable`/`Image`, `react-navigation`, NativeWind classes). The original app this was reverse-engineered from is already RN + NativeWind (`didiegopds2684/riftbound-tracker`), so prefer matching that project's conventions where they exist.

Where the references use browser-only CSS (`box-shadow` glows, `clip-path` crystals, `backdrop-filter`, `transform: rotate(180deg)`), map to RN equivalents — see **Interactions & RN mapping** below.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions are specified. Recreate pixel-faithfully using NativeWind, then substitute the licensed fonts (see Assets). All hex values, spacing, and radii below are authoritative.

---

## Design Tokens

### NativeWind / Tailwind theme
Drop into `tailwind.config.js` → `theme.extend`:

```js
colors: {
  bg:            '#010a15', // app background (deepest)
  'bg-2':        '#04101f',
  'surface-sunken': '#06101d',
  surface:       '#0a1428', // card background
  'surface-elevated': '#122039', // inputs / raised / hover
  border:        '#1e2d4a',
  'border-strong': '#2a3a5c',
  gold:          '#c89b3c', // frames, medals, favorite, brand
  'gold-dark':   '#785a28',
  'gold-light':  '#f0e6d2',
  cyan:          '#00bcff', // active / live / glow ("mana")
  'cyan-dark':   '#0a7bb0',
  'cyan-glow':   '#5ed8ff',
  'text-primary':   '#f0e6d2', // warm parchment — main reading text
  'text-secondary': '#8a93b0',
  'text-muted':     '#5a6485',
  win:  '#4caf82', loss: '#e05c5c', draw: '#8b8fa8',
  // Runeterra domains (avatar ring / champion header)
  'domain-body': '#c06020', 'domain-calm': '#4a8090', 'domain-chaos': '#904a90',
  'domain-fury': '#c03030', 'domain-mind': '#6080c0', 'domain-order': '#90a050',
  'domain-colorless': '#706880',
},
borderRadius: { sm: '6px', md: '12px', lg: '20px', full: '999px' },
fontFamily: {
  display: ['BeaufortForLOL', 'Cinzel', 'serif'], // titles, names, big numbers
  body:    ['Spiegel', 'Barlow', 'sans-serif'],   // UI + copy
},
```

### Spacing scale (4px base)
`xs 4 · sm 8 · md 16 · lg 24 · xl 32 · xxl 48` (px). NativeWind: use the default `p-1`(4) … or extend `spacing` if you want named steps.

### Type scale (px)
counter **88** (giant score) · display **30** · h1 **26** · h2 **20** · h3 **16** · body **15** · sm **13** · xs **12** · 2xs **10**.
Weights 400/500/600/700. Display font is wide-tracked caps (`letter-spacing ≈ 0.06em`); overlines/labels are UPPERCASE with `letter-spacing ≈ 0.14em`.

### Effects
- **Card:** `surface` fill, `1px border` (`border` navy hairline; **`gold` hairline for KPI/stat cards**), radius `md`/`lg`, padding `md`–`lg`. Depth comes from the dark field + thin frame, not heavy shadows.
- **Glow (signature):** active elements get a cyan glow. Web value `0 0 16px #00bcff55, 0 0 4px #00bcff88`. In RN use a `shadowColor:'#00bcff'`, `shadowOpacity:0.6`, `shadowRadius:10` (iOS) / `elevation` + a faint cyan border (Android), applied sparingly.
- **Protection gradient** over champion splash: `linear-gradient(180deg, transparent → #010a15)` — use `expo-linear-gradient`.

---

## Screens / Views

### 1. Champion Detail (SPEC §5.2) — flagship
**Purpose:** the logged-in user's private stats + matchups for one Legend.
**File:** `ChampionDetailScreen.jsx`

- **Header (height ≈ 220):** full-bleed champion splash (`Image`, `resizeMode:'cover'`, top-aligned), with a bottom **protection gradient** (transparent → `bg`). A 2px **domain-colored** hairline sits at the art's bottom edge.
  - Back button: top-left, 38×38 circle, `surface@55%` bg, `border-strong`, blur.
  - Bottom-left overlay: a **domain pill** (`bg #010a15@50%`, `1px border` in the domain color, an 8px dot in the domain color, UPPERCASE label e.g. "CALM") + a gold **"★ Favorito"** badge if this is the favorite Legend. Below it the **champion name** in display font, ~38px, with a dark text-shadow.
- **KPI grid (2×2, `gap 16`):** four **gold-framed cards** (`KpiCard`): `Win Rate` (value tinted win/loss, sub `9V / 4D / 1E`), `Partidas` (count), `Jogando 1º` (cyan %), `Jogando 2º` (cyan %). Each: uppercase 10px overline, display-font 28px value, 12px muted sub.
- **Matchups section:** display-font "Matchups" + muted subtitle. Then two list cards:
  - **Top Vantagens** — green accent bar, 3 rows of highest win-rate rivals.
  - **Principais Desafios** — red accent bar, 3 rows of lowest win-rate rivals.
  - Each row (`MatchupBar`): 36px rival avatar (domain ring) · name + `7V / 2D` muted count · a 7px **horizontal proportion bar** (green wins / optional grey draws / red losses, `radius full`, track `surface-sunken`) · win-rate % at right (display font, green ≥50% else red).

### 2. Scoreboard / Point Counter (SPEC §6) — flagship
**Purpose:** standalone tabletop counter, phone laid flat between two players.
**File:** `ScoreboardScreen.jsx`

- **Setup phase:** title "Placar"; a card with "Configurar partida", a `SegmentControl` Formato (Bo1/Bo3), a "Pontos para vencer" row of 4 buttons (15/20/25/30 — selected one is **cyan-glowing**), and a large **cyan** "Iniciar Placar" button. Helper caption about placing the phone between players.
- **Play phase (face-to-face):** vertical split into two equal zones.
  - **Top zone = Oponente, rotated 180°** (`transform:[{rotate:'180deg'}]`).
  - **Bottom zone = Você.**
  - Each zone (`ScoreStepper`): a slim **glowing cyan progress rail** on the left edge that fills bottom-up toward `winTarget`; centered **giant counter** (display font ~88px); below it two **large faceted Hextech-crystal buttons** — **+** is cyan-glowing (`#00bcff` border + glow, octagon `clip-path`), **−** is a neutral faceted button. Buttons ≥ 76px; press scales to 0.92.
  - **Center divider:** a thin gold gradient line with a discreet **"↺ Resetar · {game}/{max}"** gold pill centered on it.
  - **Overlays:** winner overlay (🏆 + "{name} venceu!" gold, "Nova partida" cyan button, "Voltar ao setup"); reset-confirm overlay (Cancelar / Resetar danger). Both `bg #010a15@82%` + blur.
  - RN notes: the octagon crystal → use an SVG (`react-native-svg`) polygon or a rotated square, since RN has no `clip-path`. The 180° zone → `rotate` transform on the whole zone View.

### 3. New Match (registrar partida)
**File:** `NewMatchScreen.jsx`. Sticky header (back + "Nova Partida"); scrollable card sections — Legend + opponent selectors (tap expands a 5-col avatar grid, selected = cyan outline; focused field = cyan glow), Modo/Formato segments + Torneio `select`, colored Resultado toggle (Vitória green / Empate grey / Derrota red), Placar input (display font, centered), Notas textarea; sticky bottom **cyan** "Salvar partida" (disabled until both Legends chosen).

### 4. Legends list
**File:** `LegendsScreen.jsx`. Title "Legends", search input, list of cards: 52px avatar (favorite shows gold star) · name + optional gold "Mais jogada" badge · `3V/1D/1E · N partidas` · big win-rate % (green/red) + "winrate" overline. Tapping a card → Champion Detail.

### 5. Matches list
**File:** `MatchesScreen.jsx`. Title "Partidas" + gold "+ Nova" button (→ New Match). Cards: date + `1V1 · BO3` + tournament outline badge; centered row of **my avatar (Eu)** · gold score `2-1` + result pill · **opponent avatar(s) (Oponente)**; optional italic notes.

### 6. Auth
**File:** `AuthScreen.jsx`. Centered ⚔ gold glyph + "Riftbound Tracker" (gold display) + tagline; card with Email/Senha fields, cyan "Entrar"/"Criar conta", links (Criar conta / Esqueci a senha); legal footer "App não-oficial • Não afiliado à Riot Games".

### 7. Profile
**File:** `ProfileScreen.jsx`. Identity card (80px favorite avatar + name + @nick + gold "Favorita · X" badge); Editar perfil / Sair; "Sobre" disclaimer card.

### App shell
**File:** `index.html`. Status bar + content + **bottom tab bar** (64px, `surface`, top hairline): Jogar · Partidas · Legends · Perfil. Active tab = cyan icon (glow) + cyan label. Use `react-navigation` bottom tabs; icons from `lucide-react-native`.

---

## Interactions & Behavior
- **Tabs:** switch root screens. Active = cyan + glow; inactive = `text-muted`.
- **Legends → Detail:** push navigation; back button pops.
- **Scoreboard:** `+` increments; reaching `winTarget` awards a game and (Bo3) resets points / advances game; reaching games-needed shows winner overlay. `−` floors at 0. Reset pill → confirm overlay. Transitions: progress width/height `~0.2s` ease-out; counter has a faint cyan text-shadow.
- **New Match:** selectors expand inline; save disabled until valid; on save, prepend to Matches list.
- **Press states:** big touch targets scale to ~0.92; gold buttons darken; cyan buttons keep glow. Hover (web only) lightens surface to `surface-elevated`.
- **Reduced motion:** keep transitions short and optional.

## State Management
- `auth` (logged in?) → gates Auth vs app.
- `activeTab`, `detailLegendId` (or navigation stack).
- Scoreboard: `phase` (setup|play), `format`, `winTarget`, `p1`/`p2` points, `g1`/`g2` games, `gameNum`, `winner`, `confirmReset`.
- New Match: `mine`, `opp`, `mode`, `format`, `tournament`, `result`, `score`, `notes`.
- Matches: list state (prepend new). Data shapes in `data.js` / repo `src/types.ts`.

## Assets
- **Champion splash art:** loaded at runtime from the ddragon CDN, e.g. `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/<Champion>_0.jpg`. For production, cache per `champions_cache.image_url`.
- **Fonts (SUBSTITUTE — flagged):** references use **Cinzel** (display) + **Barlow** (body) from Google Fonts as stand-ins for Riot's licensed **Beaufort for LOL** + **Spiegel**. Swap in the licensed faces; the `fontFamily` config above lists the licensed name first.
- **Icons:** **Lucide** (`lucide-react-native`) — substitute, the source repo used emoji glyphs. ⚔ / 🏆 may remain as brand flavor.
- **Logo:** type-only wordmark (Cinzel gold) + ⚔ app mark. No raster logo in source.

## Files
- `index.html` — interactive app shell (tabs, auth gate, routing). Open in a browser to click through the real reference.
- `ChampionDetailScreen.jsx`, `ScoreboardScreen.jsx`, `NewMatchScreen.jsx`, `LegendsScreen.jsx`, `MatchesScreen.jsx`, `AuthScreen.jsx`, `ProfileScreen.jsx` — per-screen references.
- `data.js` — mock Legends / Matches / Profile / per-Legend stats + matchups.
- `styles.css` + `tokens/` — the authoritative token values (colors, type, spacing, effects).
- `components/` — the 8 primitives (Button, SegmentControl, ResultBadge, Badge, LegendAvatar, MatchupBar, KpiCard, ScoreStepper) with `.d.ts` props contracts and `.prompt.md` usage.
- `DESIGN_SYSTEM_README.md` — the full design system guide (content voice, visual foundations, iconography).

> Tip: the whole design system also ships as an **Agent Skill** (`SKILL.md`). Drop this folder into `.claude/skills/riftbound-tracker-design/` in your repo and Claude Code can read the tokens/components directly while implementing.
