# cheatsheet-maker

A Claude Code skill that turns lecture slides, notes and homework into a print-ready exam cheatsheet you can actually read under exam stress.

## What it does

- **Output**: A4 landscape, 3-column Word (.docx) + PDF; fits the exam's page limit (e.g. one sheet double-sided = 2 pages); body text never below 8pt
- **Readable without the slides**: every line is a complete sentence, symbols are defined on first use, no references to "the XYZ example" or slide codes, reasons given after conclusions
- **Fits the limit by cutting, not compressing**: low-value items (worked examples, theory the course only mentions, tool trivia) go first; wording is never squeezed into fragments
- **Instructor-flagged topics are kept in full**: reads announcements, forum answers and the schedule to find what will be tested (e.g. an intro-lecture history timeline)
- **Synthesizes instead of transcribing**: opens with a one-table map of the course, merges scattered concepts, turns "unlike X…" remarks into comparison tables
- **Typography hierarchy**: coloured chapter bars, sub-headings, sans body, monospace for code, bold key terms, highlighted ⚠ exam-trap lines
- **No worked examples** unless you ask for them
- **Chinese mode** (`CJK=1`): Chinese body with technical terms kept in English, DengXian / Microsoft YaHei, exact line spacing and half-width punctuation to work around Word's CJK layout quirks
- **Runnable build template** plus `measure.py`, which reports how full each column is so layout gaps get fixed before content is cut

## Installation

```bash
git clone https://github.com/Kevin88866/cheatsheet-maker-skill.git "%USERPROFILE%\.claude\skills\cheatsheet-maker"
```

Restart Claude Code if this is your first skill; otherwise it hot-reloads.

## Usage

> "Make me a cheatsheet for CG3207 from the lecture PDFs in ./Lecture"

> "把这几章课件做成 cheatsheet，两页一张纸，除了专有名词其它用中文"

> "Extend the cheatsheet with chapters 5 and 6"

Or invoke directly with `/cheatsheet-maker`.

## File structure

```
cheatsheet-maker/
├── SKILL.md                          # Rules and workflow
└── references/
    ├── build-template.js             # docx-js build script (Latin or CJK mode); copy and fill in content
    ├── measure.py                    # Page count and per-column fill of the exported PDF
    ├── layout-spec.md                # Geometry, fonts, CJK quirks, tables, export, tuning loop
    ├── extraction-prompts.md         # Synthesis moves, keep/cut lists, readability self-audit
    ├── comparison-tables.md          # When and how to use tables
    ├── formula-handling.md           # Word-native OMML math
    └── compression-tactics.md        # What to cut, in which order, under a page limit
```

## Layout at a glance

| Parameter | Value |
|-----------|-------|
| Paper | A4 landscape, 0.7 cm margins |
| Columns | 3, 0.4 cm gap, separator rule |
| Headings | Segoe UI / Microsoft YaHei bold, white on chapter colour |
| Body | Calibri / 等线, 8pt floor; CJK uses exact 9.6pt line spacing |
| Tables | fixed layout, relative column weights, coloured header; long tables may split with repeated header |
| Page count | the exam's limit, or as long as the content needs |

## Requirements

- Claude Code with the `docx` npm package (`npm install -g docx`)
- Python with `pymupdf` and `Pillow`
- `pdftotext` (poppler) optional
- PDF export: Microsoft Word (Windows, via COM) or LibreOffice

## Output

`.docx`, `.pdf`, the build script, `measure.py`, the export script and any cropped figures are saved next to your source material in a `cheatsheet_assets/` folder, so the sheet can be rebuilt and extended later.
