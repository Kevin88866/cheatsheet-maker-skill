# Math Formula Handling

Cheatsheet formulas must use Word's native format (OMML), because:
- Editable and selectable
- Sharp when printed (no fuzziness like images)
- Auto-adapts to font size

## Method 1: Write OMML XML directly (recommended)

docx-js has limited OMML support; for complex formulas the most reliable approach is **unpack → edit XML → repack**.

### Steps

1. Generate the base version with docx-js, using placeholders where formulas go (e.g., `{{FORMULA_1}}`)
2. Unpack the generated .docx:
   ```bash
   python /mnt/skills/public/docx/scripts/office/unpack.py cheatsheet.docx unpacked/
   ```
3. Open `unpacked/word/document.xml` and replace placeholders with OMML formula blocks
4. Repack:
   ```bash
   python /mnt/skills/public/docx/scripts/office/pack.py unpacked/ cheatsheet.docx
   ```

## Common formula OMML templates

### Fraction a/b
```xml
<m:oMath>
  <m:f>
    <m:num><m:r><m:t>a</m:t></m:r></m:num>
    <m:den><m:r><m:t>b</m:t></m:r></m:den>
  </m:f>
</m:oMath>
```

### Subscript and superscript (x_i^2)
```xml
<m:oMath>
  <m:sSubSup>
    <m:e><m:r><m:t>x</m:t></m:r></m:e>
    <m:sub><m:r><m:t>i</m:t></m:r></m:sub>
    <m:sup><m:r><m:t>2</m:t></m:r></m:sup>
  </m:sSubSup>
</m:oMath>
```

### Summation Sigma
```xml
<m:oMath>
  <m:nary>
    <m:naryPr><m:chr m:val="∑"/></m:naryPr>
    <m:sub><m:r><m:t>i=1</m:t></m:r></m:sub>
    <m:sup><m:r><m:t>n</m:t></m:r></m:sup>
    <m:e>
      <m:sSub>
        <m:e><m:r><m:t>x</m:t></m:r></m:e>
        <m:sub><m:r><m:t>i</m:t></m:r></m:sub>
      </m:sSub>
    </m:e>
  </m:nary>
</m:oMath>
```

### Integral
```xml
<m:oMath>
  <m:nary>
    <m:naryPr><m:chr m:val="∫"/></m:naryPr>
    <m:sub><m:r><m:t>a</m:t></m:r></m:sub>
    <m:sup><m:r><m:t>b</m:t></m:r></m:sup>
    <m:e><m:r><m:t>f(x)dx</m:t></m:r></m:e>
  </m:nary>
</m:oMath>
```

### Square root
```xml
<m:oMath>
  <m:rad>
    <m:radPr><m:degHide m:val="1"/></m:radPr>
    <m:deg/>
    <m:e><m:r><m:t>x</m:t></m:r></m:e>
  </m:rad>
</m:oMath>
```

### Matrix (2x2)
```xml
<m:oMath>
  <m:d>
    <m:dPr>
      <m:begChr m:val="["/>
      <m:endChr m:val="]"/>
    </m:dPr>
    <m:e>
      <m:m>
        <m:mPr><m:mcs><m:mc><m:mcPr><m:count m:val="2"/></m:mcPr></m:mc></m:mcs></m:mPr>
        <m:mr>
          <m:e><m:r><m:t>a</m:t></m:r></m:e>
          <m:e><m:r><m:t>b</m:t></m:r></m:e>
        </m:mr>
        <m:mr>
          <m:e><m:r><m:t>c</m:t></m:r></m:e>
          <m:e><m:r><m:t>d</m:t></m:r></m:e>
        </m:mr>
      </m:m>
    </m:e>
  </m:d>
</m:oMath>
```

## Method 2: Unicode for simple formulas

For simple formulas, **Unicode symbols + italic variables** are enough and much simpler:

| Symbol | Unicode | Example |
|--------|---------|---------|
| Σ | U+03A3 | Σxᵢ |
| ∫ | U+222B | ∫f(x)dx |
| √ | U+221A | √x |
| ≤ ≥ | U+2264 U+2265 | x ≤ 5 |
| ≠ | U+2260 | a ≠ b |
| ± | U+00B1 | x ± σ |
| × ÷ | U+00D7 U+00F7 | a × b |
| ∞ | U+221E | x → ∞ |
| ∂ | U+2202 | ∂f/∂x |
| ∇ | U+2207 | ∇f |
| α β γ δ ε θ λ μ σ π φ ω | Greek letters | α = 0.05 |
| ₁₂₃ᵢⱼₙ | Subscripts | xᵢ |
| ¹²³ⁱⁿ | Superscripts | x² |

### Insertion in docx-js

```javascript
new TextRun({
  text: "Σ(xᵢ - μ)² / n",
  font: "Cambria Math",   // Font designed for math
  size: 13,
  italics: true            // Italicize variables
})
```

## Decision guide

| Scenario | Use |
|----------|-----|
| Single-line simple formula (mean, variance) | Unicode + italic variables |
| Multi-line derivations / matrices / nested fractions | OMML |
| Students need to select/edit | OMML |
| Just displaying a result | Unicode |

## Font size pairing

**Formulas slightly larger than body text** (for readability):
- Body 5.5pt → Formulas 6-6.5pt
- Body 6.5pt → Formulas 7pt
