Gold-framed action button — use for any tap action; reach for `variant="cyan"` for the one glowing hero/active action per screen (Iniciar Placar, confirm).

```jsx
<Button label="Iniciar Placar" variant="cyan" size="lg" fullWidth onClick={start} />
<Button label="Salvar" onClick={save} />
<Button label="Cancelar" variant="ghost" />
```

Variants: `primary` (gold, default), `cyan` (glowing mana), `secondary` (elevated surface), `danger` (red), `ghost`. Sizes `sm | md | lg`. Supports `loading`, `disabled`, `fullWidth`, leading `icon`.
