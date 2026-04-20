# Compression Tactics: What to do when content won't fit

Try these in order; check after each step whether the content fits.

## Phase 1: Content trimming (do first; doesn't hurt readability)

### 1. Cut textual redundancy

- **Remove verbal filler**:
  - ❌ "In this situation, we typically use..."
  - ✅ "Case: use..."
- **Keep only conclusions, drop derivations** (keep one line of the key step)
- **Drop examples**: unless the example is itself an exam variant
- **Compress conjunctions**:
  - "because...therefore..." → "∵...∴..."
  - "if...then..." → "If... ⇒..."
  - "for all..." → "∀..."

### 2. Symbolic substitution

| Verbose | Compact |
|---------|---------|
| greater than or equal to | ≥ |
| infinity | ∞ |
| belongs to set | ∈ |
| therefore | ∴ |
| because | ∵ |
| implies / yields | ⇒ |
| equivalent to | ⇔ |
| approximately | ≈ |

### 3. Compress definition format

From multi-line to single-line:
```
❌ Definition 3.2: Let X be a continuous random variable. Then its probability density function f(x) satisfies:
   (1) f(x) ≥ 0
   (2) ∫f(x)dx = 1

✅ PDF f(x): f(x)≥0, ∫f(x)dx=1
```

## Phase 2: Layout adjustments

### 4. Increase columns

3 columns → 4 columns:
```javascript
column: { count: 4, space: 200, equalWidth: true }
```
More columns = narrower columns; good for short knowledge points; **long formulas and wide tables get harder to lay out**.

### 5. Reduce font size

Watch out for legibility:
- English: Calibri 5pt (size = 10) — tiring but readable
- Chinese: DengXian 5pt (size = 10) — don't go below this

### 6. Remove section spacing

Change `sectionHeading` `spacing: { before: 60, after: 20 }` to `{ before: 20, after: 0 }`.

### 7. Line spacing adjustment

Confirm `lineRule: "auto", line: 240` (single line) is already the minimum. Smaller requires `lineRule: "exact"`:
```javascript
spacing: { before: 0, after: 0, line: 200, lineRule: "exact" }
```
**Risk: may clip descenders of characters. Always PDF-preview before using.**

## Phase 3: Structural changes

### 8. Double-sided print

If the exam allows double-sided:
```javascript
sections: [
  { properties: {...}, children: [/* Front */] },
  { properties: {...}, children: [/* Back */] }  // Auto new page
]
```

### 9. Remove secondary chapters

Proactively ask the user: "Are any of these chapters lower-priority? They can move to the back side or be cut: ..."

### 10. Replace examples with formulas

If a full example problem won't fit, **keep only the formula template and key step skeleton**:
```
❌ Example: A factory produces parts, n=100, μ=5, σ=0.1, find P(4.9≤X≤5.1)
   Z₁=(4.9-5)/0.1=-1, Z₂=(5.1-5)/0.1=1
   P = Φ(1)-Φ(-1) = 0.6826

✅ Normal probability: Z=(X-μ)/σ, P = Φ(Z₂)-Φ(Z₁)
```

## Phase 4: Print optimization

### 11. High-resolution printer

With 300+ dpi home printers, 5pt is readable. For older 150dpi lasers, don't go below 6pt.

### 12. Handwritten supplementation strategy

**Tell the user clearly**: Some extra-long formula derivations can intentionally be left blank and filled in by hand after printing. Handwriting is more readable than printed 5pt.

## Decision tree

```
Content won't fit?
  ├── First try content trimming (1-3) → Fits ✓
  └── Still won't fit
      ├── Still have long text → Back to 1-3
      ├── Text already minimal → Try 4 (more columns)
      │   └── Tables/formulas look bad → Back to 3 columns, try 5 (font size)
      ├── Font already at 5pt → Consider 8 (double-sided)
      └── Still won't fit double-sided → Discuss 9 (cut content) or 12 (handwrite) with user
```

## Do after every adjustment

1. **Save**: Remind user to Ctrl+S; Word can crash after formula/table edits
2. **PDF preview**: Use LibreOffice — `soffice --headless --convert-to pdf cheatsheet.docx` (works on Windows/macOS/Linux if LibreOffice is installed)
3. **A4 comparison**: Tell user to print and test on actual A4 paper
