# UI Kit — Riftbound Tracker (mobile app)

High-fidelity, click-through recreation of the Riftbound Match Tracker mobile app, recreated from the source repo (`didiegopds2684/riftbound-tracker`, `design-web/src/screens/*`) and the project SPEC.

## Run
Open `index.html`. It renders a 390px phone shell on the dark Hextech field. Flow:

1. **Auth** → tap *Entrar* to enter the app.
2. **Bottom tabs:** Jogar · Partidas · Legends · Perfil.
3. **Legends** → tap a Legend (Ahri has full data) → **Champion Detail** (§5.2).
4. **Jogar** → configure → *Iniciar Placar* → **Scoreboard** (§6) face-to-face counter; the + crystal scores, central gold pill resets.

## Files
- `index.html` — phone shell, status bar, tab nav, auth gate, Legend→Detail routing.
- `data.js` — mock Legends / Matches / Profile / per-Legend stats (`window.RBData`).
- `ChampionDetailScreen.jsx` — **§5.2** splash header + domain + favorite, gold KPI grid, Top Vantagens / Principais Desafios matchups.
- `ScoreboardScreen.jsx` — **§6** setup + face-to-face play (top half rotated 180°), crystal steppers, cyan win rail, reset/winner overlays.
- `NewMatchScreen.jsx` — register a match: Legend/opponent avatar-grid selectors, mode/format/tournament, colored result toggle, score + notes, sticky save.
- `LegendsScreen.jsx` · `MatchesScreen.jsx` · `AuthScreen.jsx` · `ProfileScreen.jsx`.

## Components used
`Button`, `SegmentControl`, `ResultBadge`, `Badge`, `LegendAvatar`, `MatchupBar`, `KpiCard`, `ScoreStepper` — all from the design-system bundle (`window.RiftboundTrackerDesignSystem_994af1`). Screens compose the primitives; they don't re-implement them.

## Notes
- Champion splash art loads from the ddragon CDN at runtime — needs network.
- This is a visual/interaction recreation, not production code. The original target is React Native + NativeWind; here it's React + CSS custom properties for browser preview.
