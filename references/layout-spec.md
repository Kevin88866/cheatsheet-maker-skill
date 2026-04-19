# Layout Specification — A4 Three-Column Cheatsheet

Strictly follows the proven max-space-utilization layout.

## Page specifications

| Parameter | Value | Notes |
|-----------|-------|-------|
| Paper | A4 landscape | 11906 x 16838 DXA; landscape maximizes content width |
| Page margins | 0.5 cm = 283 DXA | All four sides |
| Columns | 3 (default) | Use 4 if content is very dense |
| Column spacing | 0.5 cm = 283 DXA | |

## Font specifications

| Element | Font | Size |
|---------|------|------|
| Chinese body | DengXian | 5.5 pt (docx-js size = 11) |
| English body | Calibri | 6.5 pt (docx-js size = 13) |
| Chinese heading | SimHei | 7 pt (size = 14) |
| English heading | Calibri Bold | 7.5 pt (size = 15) |
| Extreme compression | English 5pt (size=10), Chinese 5pt | Legible but tiring; avoid unless necessary |

**Note: docx-js uses half-points, so 5.5pt = 11, 6.5pt = 13.**

## Line spacing

- **Minimum**: `line: 240, lineRule: "auto"` (single line)
- Zero spacing before/after paragraphs: `spacing: { before: 0, after: 0, line: 240, lineRule: "auto" }`
- Slight breathing room between sections: 60 DXA

## Images

- **Tight wrap**: wrap tight
- **Image-to-text distance**: 0 (adjust to 5-10 DXA if it overlaps text)

## Tables

- **Minimum width/height**: cells auto-fit content
- **Cell padding**: 0 (when borders are solid) or 20 DXA (borderless)
- **Borders**: 1pt light gray CCCCCC

## Complete docx-js code template

```javascript
const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, PageOrientation, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, SectionType, PageBreak
} = require('docx');

// ===== Colors (for chapter differentiation) =====
const COLORS = {
  chapter1: "C00000",   // Dark red
  chapter2: "0070C0",   // Blue
  chapter3: "00B050",   // Green
  chapter4: "7030A0",   // Purple
  example: "000000",    // Example problems: black
  answer: "C00000",     // Answers: red
  formula: "0070C0",    // Formulas: blue
  highlight: "FFFF00"   // Highlight background
};

// ===== Font sizes (half-points) =====
const SIZE = {
  bodyCn: 11,        // Chinese 5.5pt
  bodyEn: 13,        // English 6.5pt
  headingCn: 14,     // Chinese heading 7pt
  headingEn: 15,     // English heading 7.5pt
  compressCn: 10,    // Compression mode 5pt
  compressEn: 10     // Compression mode 5pt
};

// ===== Tight paragraph spacing =====
const tightSpacing = { before: 0, after: 0, line: 240, lineRule: "auto" };

// ===== Helper: body text =====
function bodyText(text, opts = {}) {
  return new Paragraph({
    spacing: tightSpacing,
    children: [new TextRun({
      text,
      font: opts.isEnglish ? "Calibri" : "DengXian",
      size: opts.isEnglish ? SIZE.bodyEn : SIZE.bodyCn,
      bold: opts.bold || false,
      color: opts.color,
      italics: opts.italic || false,
      underline: opts.underline ? {} : undefined
    })]
  });
}

// ===== Helper: section heading =====
function sectionHeading(text, color, isEnglish = false) {
  return new Paragraph({
    spacing: { before: 60, after: 20, line: 240, lineRule: "auto" },
    children: [new TextRun({
      text,
      font: isEnglish ? "Calibri" : "SimHei",
      size: isEnglish ? SIZE.headingEn : SIZE.headingCn,
      bold: true,
      color
    })]
  });
}

// ===== Main document =====
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "DengXian", size: SIZE.bodyCn } }
    }
  },
  sections: [{
    properties: {
      page: {
        // A4 landscape — docx-js swaps internally, pass portrait dimensions
        size: {
          width: 11906,
          height: 16838,
          orientation: PageOrientation.LANDSCAPE
        },
        margin: {
          top: 283, right: 283, bottom: 283, left: 283  // 0.5cm on all sides
        }
      },
      column: {
        count: 3,
        space: 283,     // 0.5cm column spacing
        equalWidth: true
      }
    },
    children: [
      // Chapter 1
      sectionHeading("Chapter 1 Descriptive Stats", COLORS.chapter1, true),
      bodyText("Mean = Sum(xi)/n", { isEnglish: true }),
      bodyText("Var = Sum((xi-mu)^2)/n", { isEnglish: true }),
      // ... more content

      // Chapter 2
      sectionHeading("Chapter 2 Hypothesis Tests", COLORS.chapter2, true),
      // ...
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/mnt/user-data/outputs/cheatsheet.docx", buffer);
  console.log("Done!");
});
```

## 4-column mode (for very dense content)

Change `column.count` to 4, `space` to 200 DXA. Font sizes can stay the same or shrink slightly.

## Double-sided mode

Add a second section; docx-js automatically creates a new page:

```javascript
sections: [
  { properties: {...}, children: [ /* Page 1 */ ] },
  {
    properties: { /* same specs */ },
    children: [ /* Page 2 */ ]
  }
]
```

## Validation

After generating, always validate:
```bash
python /mnt/skills/public/docx/scripts/office/validate.py /mnt/user-data/outputs/cheatsheet.docx
```

And convert to PDF for preview (compare with actual A4 printout):
```bash
python /mnt/skills/public/docx/scripts/office/soffice.py --headless --convert-to pdf cheatsheet.docx
```
