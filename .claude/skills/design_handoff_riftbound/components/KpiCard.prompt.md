Gold-framed statistic card — the KPI grid on Champion Detail (Win Rate, Total V/D/E, 1st vs 2nd). Big display-font value, uppercase overline, optional sub-line.

```jsx
<KpiCard label="Win Rate" value="64%" sub="9V / 4D / 1E" accent="win" />
<KpiCard label="Partidas" value={14} accent="gold" />
```

Lay out in a 2-column grid with `gap: var(--sp-md)`. Tint the value via `accent`.
