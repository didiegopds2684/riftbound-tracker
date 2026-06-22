A full player zone for the tabletop scoreboard (§6): glowing cyan side rail, giant counter, and faceted Hextech-crystal +/- buttons. Two of these stacked (top one `flipped`) make the face-to-face board.

```jsx
<ScoreStepper name="Oponente" points={p2} winTarget={20} meta="Games: 1" flipped onAdd={addP2} onSub={subP2} />
<ScoreStepper name="Você" points={p1} winTarget={20} onAdd={addP1} onSub={subP1} />
```

The + button is the glowing cyan crystal; − is a neutral faceted button. `winTarget` fills the side rail.
