# Math Formula Handling

Cheatsheet formulas must use Word's native OMML format because:
- Editable and selectable
- Sharp when printed (no fuzziness like images)
- Auto-adapts to font size

## Method 1: docx-js native Math API (recommended — no unpack/repack needed)

`docx` v9 exposes full OMML math components. Use these directly; no zip manipulation required.

### Available math components

```javascript
const {
  Math: M,                // <m:oMath> inline math container — use as Paragraph child
  MathRun: MR,            // <m:r> text run inside math
  MathFraction,           // <m:f> fraction (numerator + denominator)
  MathNumerator,          // <m:num> — used by MathFraction internally
  MathDenominator,        // <m:den> — used by MathFraction internally
  MathSuperScript,        // <m:sSup> superscript
  MathSubScript,          // <m:sSub> subscript
  MathSubSuperScript,     // <m:sSubSup> subscript + superscript simultaneously (e.g. σ_p^2)
  MathRadical,            // <m:rad> square root or n-th root
  MathDegree,             // <m:deg> degree of radical (omit for sqrt)
  MathSum,                // <m:nary accent="∑"> summation with limits
  MathIntegral,           // <m:nary accent="∫"> integral with limits
  MathRoundBrackets,      // <m:d> auto-sized round brackets ( )
  MathSquareBrackets,     // <m:d> auto-sized square brackets [ ]
  MathAngledBrackets,     // <m:d> auto-sized angle brackets ⟨ ⟩
  MathFunction,           // <m:func> named function (sin, cos, etc.)
} = require('docx');
```

### Constructor signatures

```javascript
// Text run in math context
new MR("text")

// Fraction
new MathFraction({ numerator: [/* MathComponent[] */], denominator: [/* MathComponent[] */] })

// Superscript: base^sup
new MathSuperScript({ children: [/* base */], superScript: [/* exponent */] })

// Subscript: base_sub
new MathSubScript({ children: [/* base */], subScript: [/* subscript */] })

// Subscript + Superscript: base_sub^sup  (e.g. σ_p^2)
new MathSubSuperScript({ children: [/* base */], subScript: [/* sub */], superScript: [/* sup */] })

// Square root (degree omitted = sqrt)
new MathRadical({ children: [/* radicand */] })
// N-th root
new MathRadical({ children: [/* radicand */], degree: [new MathDegree([new MR("n")])] })

// Summation  Σ_{subScript}^{superScript} { children }
new MathSum({ subScript: [/* lower */], superScript: [/* upper, optional */], children: [/* expr */] })

// Integral  ∫_{sub}^{sup} { children }
new MathIntegral({ subScript: [...], superScript: [...], children: [...] })

// Auto-sized brackets
new MathRoundBrackets({ children: [/* inner expression */] })  // ( ... )
new MathSquareBrackets({ children: [/* inner expression */] }) // [ ... ]
```

### Inserting Math into a Paragraph

`Math` (i.e. `<m:oMath>`) is a valid child of `Paragraph.children`, alongside `TextRun`. Mix freely:

```javascript
new Paragraph({
  spacing: tight,
  children: [
    new TextRun({ text: "1. Annuity: ", font: "Calibri", size: 11 }),
    new Math({ children: [
      new MathSubScript({ children: [new MR("a")], subScript: [new MR("n|")] }),
      new MR("="),
      new MathFraction({
        numerator: [new MR("1−"), new MathSuperScript({ children: [new MR("v")], superScript: [new MR("n")] })],
        denominator: [new MR("i")]
      })
    ]}),
    new TextRun({ text: "; Annuity-due: ä_n|=(1+i)·a_n|", font: "Calibri", size: 11 })
  ]
})
```

### Recommended helper shortcuts

```javascript
const mr   = t      => new MR(t);
const frac = (n, d) => new MathFraction({ numerator: n, denominator: d });
const sup  = (b, s) => new MathSuperScript({ children: b, superScript: s });
const sub  = (b, s) => new MathSubScript({ children: b, subScript: s });
const ssup = (b, sb, sp) => new MathSubSuperScript({ children: b, subScript: sb, superScript: sp });
const sqrt = inner  => new MathRadical({ children: inner });
const Sig  = (sb, sp, expr) => new MathSum({ subScript: sb, superScript: sp, children: expr });
const rbr  = ch     => new MathRoundBrackets({ children: ch });
const sbr  = ch     => new MathSquareBrackets({ children: ch });
const math = ch     => new M({ children: ch });

// Mixed paragraph helper: string → TextRun, array → Math
function mp(segs, color, size = 11) {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: 220, lineRule: "auto" },
    children: segs.map(s =>
      typeof s === 'string'
        ? new TextRun({ text: s, font: "Calibri", size, color: color || "000000" })
        : new M({ children: s })
    )
  });
}
```

### Common formula examples

```javascript
// vⁿ = 1/(1+i)ⁿ
[frac([mr("1")], [sup([mr("(1+i)")], [mr("n")])])]

// aₙ| = (1−vⁿ)/i
[sub([mr("a")],[mr("n|")]), mr("="), frac([mr("1−"), sup([mr("v")],[mr("n")])],[mr("i")])]

// (1 + i^(m)/m)^m
[sup([rbr([mr("1+"), frac([sup([mr("i")],[mr("(m)")])],[mr("m")])])], [mr("m")])]

// σ_p^2 = w^T Σ w
[ssup([mr("σ")],[mr("p")],[mr("2")]), mr("="), sup([mr("w")],[mr("T")]), mr("Σw")]

// β = Cov(Ri,Rm) / Var(Rm)
[mr("β="), frac([mr("Cov(Ri,Rm)")],[mr("Var(Rm)")])]

// u = e^(σ√Δt)
[mr("u="), sup([mr("e")],[mr("σ"), sqrt([mr("Δt")])])]

// Σ_{t} CF_t · v^t
[Sig([mr("t")], null, [sub([mr("CF")],[mr("t")]), mr("·"), sup([mr("v")],[mr("t")])])]

// q = (R−d)/(u−d)
[mr("q="), frac([mr("R−d")],[mr("u−d")])]

// C + K·e^(−rT) = P + S₀
[mr("C+K·"), sup([mr("e")],[mr("−rT")]), mr("=P+"), sub([mr("S")],[mr("0")])]
```

### Math inside TableCell

Wrap in a Paragraph:

```javascript
new TableCell({
  children: [new Paragraph({
    spacing: tight,
    children: [new M({ children: [/* formula */] })]
  })]
})
```

## Method 2: Unicode for simple inline expressions (fallback only)

Use only when there is no fraction, sqrt, or multi-level sub/superscript:

```javascript
new TextRun({
  text: "σ²=(1/T)Σ(Rₜ−R̄)²",
  font: "Cambria Math",
  size: 11
})
```

## Decision guide

| Scenario | Use |
|----------|-----|
| Contains fraction | OMML (MathFraction) |
| Contains sqrt | OMML (MathRadical) |
| Summation with limits | OMML (MathSum) |
| Nested sub+superscript (e.g. σ_p^2) | OMML (MathSubSuperScript) |
| Simple variable with superscript (e.g. (1+i)^t) | Unicode acceptable |
| Plain text with symbols (≤, ≥, ≠) | Unicode TextRun |

## Method 3: Unpack-inject-repack (last resort)

Only use when the docx-js Math API cannot express a formula (e.g. custom OMML not exposed by the library).

1. Generate docx with placeholder text `{{FORMULA_X}}`
2. Unpack: `python -c "import zipfile; zipfile.ZipFile('out.docx').extractall('unpacked')"`
3. Edit `unpacked/word/document.xml` — replace `<w:r><w:t>{{FORMULA_X}}</w:t></w:r>` with `<m:oMath>...</m:oMath>`
4. Repack: `cd unpacked && zip -r ../out.docx .`
