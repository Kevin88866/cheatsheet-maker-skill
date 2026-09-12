# Layout Specification — A4 landscape, 3 columns, readable

The template that implements all of this is `build-template.js`. This file explains the numbers.

## Page geometry

| Parameter | Value | Notes |
|-----------|-------|-------|
| Paper | A4 landscape | pass `width: 11906, height: 16838, orientation: LANDSCAPE` — **portrait numbers**; docx-js swaps them. Passing 16838×11906 plus the flag gives a portrait page. |
| Margins | 1 cm = 560 DXA | all sides; 0.5 cm looks cramped when printed |
| Columns | 3, `separate: true` | a thin rule between columns helps scanning |
| Column gap | 0.6 cm = 340 DXA | |
| Usable column width | ≈ 8.84 cm = 5013 DXA | tables must total ≤ 8.5 cm |

Sections, in order:
1. Title — single column, continuous.
2. Body — 3 columns, continuous.
3. Optional full-width figure — single column, continuous, **last**. Word balances the body columns above it.

## Fonts

| Element | Font | Size (half-points) |
|---------|------|--------------------|
| Chapter heading (`h1`) | Microsoft YaHei Bold, white on chapter colour | BODY + 5 |
| Sub-heading (`h2`) | Microsoft YaHei Bold, chapter colour, bottom rule | BODY + 2 |
| Body Latin | Calibri | BODY (default 17 = 8.5pt; 18 = 9pt) |
| Body CJK | 等线 (DengXian) via `eastAsia` | BODY |
| Code / mnemonics / bit fields | Consolas | BODY − 1 |
| Table text | same as body | BODY − 1 |
| Formula line | body, slightly larger | BODY + 1 |

Rules:
- **BODY never below 16 (8pt).**
- Set `font: { ascii, hAnsi, eastAsia, cs }` on every run, otherwise CJK falls back to SimSun and looks wrong.
- Inline markup handled by the template: `**bold**` for key terms, `` `code` `` for mnemonics and signals.
- Body text is black. Colour is reserved for headings, the ⚠ trap line (yellow fill, red mark) and code (dark blue).

## Colours

One colour per chapter, used for its `h1` bar, `h2` text and table header fill. Defaults in the template: slate, navy, green, brown, purple, teal, dark red. Keep them dark enough for white text.

## Spacing

- Paragraphs: `line: 240` (single), `after: 14–20`.
- `h1`: `before: 90, after: 40`, `keepNext`.
- `h2`: `before: 70, after: 20`, `keepNext`.
- Bullets: hanging indent 170 DXA with a tab stop, "•" glyph.
- Code blocks: light grey fill, `line: 220`.

## Tables

- `layout: TableLayoutType.FIXED`, explicit `columnWidths` (DXA = cm × 567), table `width` = sum of columns.
- Cell margins 8 / 8 / 25 / 25 DXA. Thin grey borders (`size: 4, color: 999999`).
- Header row: chapter colour fill, white bold text, `tableHeader: true`.
- Zebra rows (`F7F7F7`) for tables longer than ~6 rows.
- Rows `cantSplit`; cell paragraphs `keepNext` so a short table stays in one column.
- Monospace columns for encodings / mnemonics; centre narrow numeric columns.

## Figures

- Crop from slides with pymupdf at ≥ 200 dpi, then Pillow `crop`. Save PNGs into `cheatsheet_assets/` next to the output.
- Inline figure width ≤ 4 cm. Full-width figure 17–20 cm in the final single-column section.
- Never crop slide tables; rebuild them.

## Build and export

```bash
BODY=17 LINE=240 IMGW=20 node build.js      # BODY half-points, LINE spacing, IMGW figure width in cm
```

Windows (Word installed, no LibreOffice) — `topdf.ps1`:
```powershell
param($in,$out)
$w = New-Object -ComObject Word.Application; $w.Visible=$false
$d = $w.Documents.Open($in)
"PAGES=" + $d.ComputeStatistics(2)
$d.ExportAsFixedFormat($out, 17)
$d.Close(0); $w.Quit()
```
```bash
powershell -ExecutionPolicy Bypass -File topdf.ps1 "D:\path\sheet.docx" "D:\path\sheet.pdf"
```
If the export throws a COM error, a previous Word instance still holds the file; rerun.

macOS / Linux:
```bash
soffice --headless --convert-to pdf sheet.docx
```

Render pages for inspection:
```python
import fitz
d = fitz.open("sheet.pdf")
for i, p in enumerate(d): p.get_pixmap(dpi=110).save(f"pg{i+1}.png")
```

## Page-count tuning loop

1. Build at BODY=17. Note pages and how full the last page is.
2. Last page under ~60% full → raise BODY to 18 (or LINE to 264) and rebuild. If that is not enough, grow the trailing figure instead.
3. Last page overflows by a few lines → lower LINE to 230 or trim one low-value bullet; do not drop below BODY=16.
4. A full-width figure that lands on its own page: reduce IMGW until it fits below the balanced columns, or accept the extra page if the figure is essential.
5. Always look at the rendered PNGs after every change; page count alone hides overflowing tables.
