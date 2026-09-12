# cheatsheet-maker

A Claude Code skill that turns lecture slides, notes and homework into a print-ready exam cheatsheet you can actually read under exam stress.

## What it does

- **Output**: A4 landscape, 3-column Word (.docx) + PDF, page count driven by content, body text 8.5–9pt and never below 8pt
- **Synthesizes instead of transcribing**: opens with a one-table map of the whole course, merges concepts the slides scatter across chapters, turns "unlike X…" remarks into side-by-side tables, writes "principle → consequences" chains and "how to derive it" rules
- **Typography hierarchy**: coloured chapter bars, sub-headings, sans body, monospace for mnemonics / encodings / signals, bold key terms, highlighted ⚠ exam-trap lines
- **Tables for everything two-dimensional**: encodings, control signals, register conventions, flag semantics, A-vs-B comparisons
- **No filler, no invented abbreviations, no worked numeric examples** unless you ask for them
- **Bilingual**: Chinese body with technical terms kept in English when you write in Chinese
- **Figures** cropped from slides at high resolution; full-width figures placed in a balanced final section
- **Fills the pages by growing the font**, not by cramming or padding
- **Runnable build template** (`references/build-template.js`) so a sheet can be extended chapter by chapter as the course goes on

## Installation

```bash
git clone https://github.com/Kevin88866/cheatsheet-maker-skill.git "%USERPROFILE%\.claude\skills\cheatsheet-maker"
```

Restart Claude Code if this is your first skill; otherwise it hot-reloads.

## Usage

> "Make me a cheatsheet for CG3207 from the lecture PDFs in ./Lecture"

> "把这几章课件做成 cheatsheet，中文为主，关键术语保留英文"

> "Extend the cheatsheet with chapters 5 and 6"

Or invoke directly with `/cheatsheet-maker`.

## File structure

```
cheatsheet-maker/
├── SKILL.md                          # Rules and workflow
└── references/
    ├── build-template.js             # Complete docx-js build script; copy and fill in content
    ├── layout-spec.md                # Geometry, fonts, tables, figures, PDF export, page tuning
    ├── extraction-prompts.md         # Synthesis moves, keep/cut lists, per-slide checklist
    ├── comparison-tables.md          # When and how to use tables
    ├── formula-handling.md           # Word-native OMML math
    └── compression-tactics.md        # Only for exams with an enforced page limit
```

## Layout at a glance

| Parameter | Value |
|-----------|-------|
| Paper | A4 landscape, 1 cm margins |
| Columns | 3, 0.6 cm gap, separator rule |
| Headings | Microsoft YaHei bold, white on chapter colour |
| Body | Calibri / 等线 8.5–9pt (floor 8pt) |
| Code, encodings | Consolas |
| Tables | fixed layout, ≤ 8.5 cm wide, coloured header, zebra rows |
| Page count | as long as the content needs; font grows to fill the last page |

## Requirements

- Claude Code with the `docx` npm package (`npm install -g docx`)
- Python with `pymupdf` and `Pillow` (slide text and figure extraction)
- `pdftotext` (poppler) optional
- PDF export: Microsoft Word (Windows, via COM) or LibreOffice

## Output

`.docx`, `.pdf`, the build script and a `cheatsheet_assets/` folder with cropped figures are saved next to your source material, so the sheet can be rebuilt and extended later.
