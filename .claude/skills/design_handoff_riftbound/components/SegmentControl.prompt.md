Segmented control for 2–3 short exclusive options (mode, format, filters). Active segment is gold-tinted.

```jsx
<SegmentControl
  label="Formato"
  options={[{ value: 'bo1', label: 'Bo1' }, { value: 'bo3', label: 'Bo3' }]}
  value={format}
  onChange={setFormat}
/>
```

Pass an optional uppercase `label` overline. For many/long options use a dropdown instead.
