# Layout Specification — A4 landscape, 3 columns, readable

The template that implements all of this is `build-template.js`. This file explains the numbers.

## Page geometry

| Parameter | Value | Notes |
|-----------|-------|-------|
| Paper | A4 landscape | pass `width: 11906, height: 16838, orientation: LANDSCAPE` — **portrait numbers**; docx-js swaps them. |
| Margins | 0.7 cm (template default) | 1 cm when pages are not limited; never below 0.6 cm (printers clip) |
| Columns | 3, `separate: true` | a thin rule between columns helps scanning |
| Column gap | 0.4 cm | 0.6 cm when pages are not limited |
| Usable column width | ≈ 9.2 cm at 0.7 / 0.4 | the template scales table weights to it |

## Fonts

| Element | Latin | Chinese (CJK=1) | Size (half-points) |
|---------|-------|-----------------|--------------------|
| Chapter bar (`h1`) | Segoe UI bold, white on colour | Microsoft YaHei bold | BODY + 4 |
| Sub-heading (`h2`) | Segoe UI bold, chapter colour | Microsoft YaHei bold | BODY + 2 |
| Body | Calibri | 等线 (DengXian) via `eastAsia` | BODY (16 = 8pt floor) |
| Code / mnemonics | Consolas | Consolas | BODY − 1 |
| Table text | Calibri | 等线 | BODY − 1 |
| √ ⊕ ⌈ ⌉ | Cambria Math (Calibri draws them badly) | same | — |

Rules:
- **BODY never below 16 (8pt).**
- Set `font: { ascii, hAnsi, eastAsia, cs }` on every run, otherwise CJK falls back to SimSun.
- Inline markup: `**bold**`, `!!red bold!!`, `` `code` ``, `_{subscript}`, `^{superscript}` (nesting inside bold works; no nested braces).
- Possessives in English terms inside Chinese text: use a straight apostrophe (`Occam's`), curly ones may render full-width.

## Chinese (CJK) text — three Word quirks

1. **Line height.** Under "auto" spacing Word gives CJK fonts about 1.3× leading (8pt DengXian → 10.4pt lines) even though DengXian's own metrics are 1.04 em. Use **exact** spacing: 192 twips (9.6pt) for 8pt body, 180 for 7.5pt table text. Check superscripts are not clipped in the render.
2. **Full-width punctuation is never compressed.** `characterSpacingControl = compressPunctuation` in settings.xml had no effect in testing. Convert （），；： to half-width plus a space (`hwPunct()` in the template); keep 。 and 、. This saves about half an em per mark.
3. **Automatic CJK/Latin spacing.** Word adds space between Chinese and Latin text; the template turns it off (`autoSpaceDE/DN = 0`) and relies on spaces typed in the content.

Chinese content is not automatically shorter than English: full-width characters, mixed terms and punctuation made a translated sheet about 15% longer. Plan for it.

## Colours

One colour per chapter, used for its `h1` bar, `h2` text and table header fill. Keep them dark enough for white text. Body text is black; colour is reserved for headings, ⚠ lines and code.

## Spacing

- Latin: `line: 230` auto. CJK: exact 192.
- Paragraph `after: 6`; `h1` `before 60 / after 24`; `h2` `before 40 / after 12`, both `keepNext`.
- Bullets: hanging indent 150 DXA with a tab stop.

## Tables

- `layout: TableLayoutType.FIXED`, explicit `columnWidths`; the template takes relative weights.
- Cell margins 4 / 4 / 28 / 28 DXA; thin grey borders; header row in chapter colour with `tableHeader: true` (repeats when split).
- Rows `cantSplit`. Tables with ≤ `SPLIT_ROWS` rows (default 4) are kept whole; longer tables may break between rows so they do not jump a whole column and leave a gap.
- Put the column the reader searches by first; widen the column that holds the longest token.

## Figures

- Crop from slides with pymupdf at ≥ 200 dpi, then Pillow `crop`. Save PNGs into `cheatsheet_assets/`.
- Inline figure width ≤ 4 cm. Full-width figure 17–20 cm in a final single-column section.
- Never crop slide tables; rebuild them.

## Build and export

```bash
node build.js            # Latin
CJK=1 node build.js      # Chinese body
BODY=17 LINE=200 node build.js   # overrides
```

Windows (Word installed) — `topdf.ps1`:
```powershell
param($in,$out)
$w = New-Object -ComObject Word.Application; $w.Visible=$false; $w.DisplayAlerts = 0
try {
  $d = $w.Documents.Open($in, $false, $true)
  "PAGES=" + $d.ComputeStatistics(2)
  $d.ExportAsFixedFormat($out, 17)
  $d.Close(0)
} finally { $w.Quit() }
```
Never kill WINWORD processes you did not start; a Word instance killed mid-export can make the next hidden instance hang on a recovery dialog.

macOS / Linux: `soffice --headless --convert-to pdf sheet.docx`

Check fill and render pages:
```bash
python measure.py sheet.pdf ./png     # prints where each column's text ends, saves pgN.png
```

## Page-count tuning loop

1. Build, export, run `measure.py`, look at every page.
2. **Column gaps first.** A column ending 40+ pt above the others means a heading + table chain jumped. Fixes, in order: shorten one or two lines just before the chain; let the table split (lower `SPLIT_ROWS`); restructure the table (fewer columns, shorter cells); reorder sections so a table does not land at a column bottom.
3. Over the limit → cut low-value items (see `compression-tactics.md`). Never compress wording.
4. Under the limit → restore knowledge points cut earlier; only then consider BODY 17 / looser LINE.
5. A bullet split across the front/back page break: pass `keep = true` to that one `b()`. Global `KEEP=1` costs a lot of space.
6. Always look at the rendered PNGs after every change; page count alone hides overflowing tables and unparsed markup.
