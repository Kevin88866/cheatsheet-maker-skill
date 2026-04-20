# cheatsheet-maker

A Claude Code skill that turns your lecture slides, homework, and notes into a print-ready exam cheatsheet — maximizing every square centimeter of A4 paper.

## What it does

- **Default output**: 2-page double-sided A4 landscape Word (.docx), 3 columns, 0.5cm margins
- **Auto-extracts** key points from uploaded PPTs, PDFs, and notes
- **Adaptive density**: fills space intelligently — adds explanations when under 2 pages, compresses to formula-only when over
- **Precise page-count estimation**: counts every `h()`, `np()`, `p()`, `img()` entry against a calculated capacity (≈49 lines/column, 6 columns for 2-page A4 landscape = 294 lines) before delivery
- **Auto "PROBLEM-SOLVING WALKTHROUGH"**: when under page count, appends compact worked examples (≤5 lines each) for every major topic before filling remaining space with sub-lines
- **Cross-platform toolchain**: unpack/repack docx and PDF preview commands provided for Windows, macOS, and Linux
- **Math formulas**: Word-native OMML format (selectable, editable, prints sharp)
- **Concept comparison tables**: automatically suggests tables for easily-confused concepts
- **Color-coded sections**: each chapter gets its own color; examples and answers in different colors
- **Diagrams and images**: crops diagrams from lecture slides (PDF < 25 MB), draws box diagrams with docx tables, or falls back to ASCII-art
- **PDF size-aware**: automatically switches to text-only extraction for large PDFs (≥ 25 MB) to avoid memory issues
- **Compression strategies**: step-by-step playbook when content won't fit

## Example

<img width="2559" height="1536" alt="image" src="https://github.com/user-attachments/assets/673766bb-43bd-4128-9b87-f60994b98376" />
<img width="2559" height="1599" alt="image" src="https://github.com/user-attachments/assets/12e2305d-c308-4613-9cde-c344d40f3e08" />
<img width="2559" height="1599" alt="image" src="https://github.com/user-attachments/assets/6190d3e2-0587-470b-9bc2-a695f2fa0fdc" />


## Installation

```bash
git clone https://github.com/Kevin88866/cheatsheet-maker-skill.git "%USERPROFILE%\.claude\skills\cheatsheet-maker"
```

Restart Claude Code if this is your first time adding a skill. Otherwise it hot-reloads automatically.

## Usage

Just describe what you need — Claude picks up the skill automatically:

> "Make me a cheatsheet for my statistics final"

> "I have a PPT and 3 homework sets — compress them into a cheatsheet"

> "Help me condense these notes onto one A4 sheet"

You can also invoke it directly with `/cheatsheet-maker`.

## File structure

```
cheatsheet-maker/
├── SKILL.md                          # Main skill entry point
└── references/
    ├── layout-spec.md                # A4 3-column docx-js code template
    ├── formula-handling.md           # Word math formula insertion (OMML + Unicode)
    ├── comparison-tables.md          # Concept comparison table templates
    ├── compression-tactics.md        # Strategies when content won't fit
    └── extraction-prompts.md         # How to extract key points from PPTs/homework
```

## Layout specs

| Parameter | Value |
|-----------|-------|
| Paper | A4 landscape |
| Margins | 0.5 cm all sides |
| Columns | 3 (4 for extreme cases) |
| Column spacing | 0.5 cm |
| Chinese font | DengXian 5.5pt |
| English font | Calibri 6.5pt |
| Default page count | 2 pages (double-sided) |

## Diagram support

| Mode | Trigger | Diagram behavior |
|------|---------|-----------------|
| Screenshot enabled | Total PDF size < 25 MB | Crop diagrams from slides with pymupdf + Pillow |
| Screenshot disabled | Total PDF size ≥ 25 MB | Replace diagrams with concise text descriptions |
| Self-drawn | No source image | Draw with docx tables (colored cells + arrow chars) or ASCII-art |

## Requirements

- Claude Code with `docx` npm package (`npm install -g docx`)
- `pymupdf` (`pip install pymupdf`) — PDF text extraction and slide cropping
- `Pillow` (`pip install Pillow`) — image cropping
- LibreOffice (for PDF preview — `soffice --headless --convert-to pdf cheatsheet.docx`)
- `pandoc` (for reading existing documents)

## Output location

The generated `.docx` is saved to the **same directory as your source materials** (or the project workspace directory), then returned via `present_files`.
