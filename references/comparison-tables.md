# Concept Comparison Tables

Comparison tables are the highest-lookup-efficiency layout for exam day. Use them for confusable concepts.

## When to use

Strongly recommend comparison tables for:

- **Two similar methods/models**: t-test vs z-test, Ridge vs Lasso, Precision vs Recall
- **Case-by-case distinctions**: discrete vs continuous, biased vs unbiased, parametric vs non-parametric
- **Similar formulas with different conditions**: density functions across distributions, variances of different estimators
- **Pros/cons comparisons**: time/space complexity across algorithms
- **Definition + formula + condition**: classic three-column structure

## Template 1: Two-column comparison (A vs B)

```javascript
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

new Table({
  width: { size: 3000, type: WidthType.DXA },   // Roughly one column wide
  columnWidths: [1500, 1500],
  rows: [
    // Header
    new TableRow({
      tableHeader: true,
      children: [
        new TableCell({
          borders,
          width: { size: 1500, type: WidthType.DXA },
          shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
          margins: { top: 20, bottom: 20, left: 40, right: 40 },
          children: [new Paragraph({
            spacing: tightSpacing,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "t-test", bold: true, size: 11, font: "Calibri" })]
          })]
        }),
        new TableCell({
          borders,
          width: { size: 1500, type: WidthType.DXA },
          shading: { fill: "F2F2F2", type: ShadingType.CLEAR },
          margins: { top: 20, bottom: 20, left: 40, right: 40 },
          children: [new Paragraph({
            spacing: tightSpacing,
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "z-test", bold: true, size: 11, font: "Calibri" })]
          })]
        })
      ]
    }),
    // Data row
    new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 1500, type: WidthType.DXA },
          margins: { top: 20, bottom: 20, left: 40, right: 40 },
          children: [new Paragraph({
            spacing: tightSpacing,
            children: [new TextRun({ text: "sigma unknown, small n (<30)", size: 11, font: "Calibri" })]
          })]
        }),
        new TableCell({
          borders,
          width: { size: 1500, type: WidthType.DXA },
          margins: { top: 20, bottom: 20, left: 40, right: 40 },
          children: [new Paragraph({
            spacing: tightSpacing,
            children: [new TextRun({ text: "sigma known OR n>=30", size: 11, font: "Calibri" })]
          })]
        })
      ]
    })
  ]
})
```

## Template 2: Three-column comparison (concept | formula | condition)

Best for quick lookups:

| Distribution | Density | Use case |
|--------------|---------|----------|
| Normal | (1/σ√2π)exp(-(x-μ)²/2σ²) | Symmetric continuous variable |
| Poisson | λᵏe⁻λ/k! | Count data, rare events |
| Binomial | C(n,k)pᵏ(1-p)ⁿ⁻ᵏ | n independent trials |

Generate with a three-column Table; bold the concept column.

## Template 3: Multi-attribute comparison (model/algorithm comparison)

Attributes across the top (complexity, space, assumptions, pros, cons), methods down the side:

| Algorithm | Time | Space | Assumptions | When |
|-----------|------|-------|-------------|------|
| Linear Reg | O(np²) | O(p²) | Linear, normal errors | Continuous target |
| Logistic | O(np) | O(p) | Linear log-odds | Binary classification |
| Random Forest | O(n log n·p·B) | O(Bnp) | None | General purpose |

## Color strategy

- **Header**: Light gray background (F2F2F2) or a lightened version of the chapter color
- **Key column** (leftmost concept name): Bold, use the chapter's primary color
- **Critical differences**: Red highlight (color C00000)

## Space-saving tips

1. **Abbreviate headers**: Shorten where possible ("Time Complexity" → "Time")
2. **Remove borders**: Alignment alone can create comparison effect
   ```javascript
   borders: {
     top: { style: BorderStyle.NONE },
     bottom: { style: BorderStyle.NONE },
     left: { style: BorderStyle.NONE },
     right: { style: BorderStyle.NONE }
   }
   ```
3. **Minimize cell padding**: `margins: { top: 10, bottom: 10, left: 30, right: 30 }`
4. **Span columns**: If a table is critical, it can span two columns (adjust section properties)
