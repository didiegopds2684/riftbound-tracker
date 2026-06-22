Head-to-head matchup row — the core of the Champion-Detail analysis. Rival avatar + name, a horizontal green-wins / red-losses proportion bar, and the win-rate %. Stack in "Top Vantagens" and "Principais Desafios" lists.

```jsx
<MatchupBar legend={jinx} wins={7} total={9} />
<MatchupBar legend={yasuo} wins={1} total={6} draws={1} />
```

Win-rate % turns green at ≥50%, red below. Pass `draws` for a grey middle segment.
