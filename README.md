# cheatsheet-maker

A Claude Code skill that turns your lecture slides, homework, and notes into a print-ready exam cheatsheet — maximizing every square centimeter of A4 paper.

## What it does

- **Default output**: 2-page double-sided A4 landscape Word (.docx), 3 columns, 0.5cm margins
- **Auto-extracts** key points from uploaded PPTs, PDFs, and notes
- **Adaptive density**: fills space intelligently — adds explanations when under 2 pages, compresses to formula-only when over
- **Math formulas**: Word-native OMML format (selectable, editable, prints sharp)
- **Concept comparison tables**: automatically suggests tables for easily-confused concepts
- **Color-coded sections**: each chapter gets its own color; examples and answers in different colors
- **Compression strategies**: 12-step playbook when content won't fit

## Installation

```bash
git clone https://github.com/your-username/cheatsheet-maker.git "%USERPROFILE%\.claude\skills\cheatsheet-maker"
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
    ├── compression-tactics.md        # 12 strategies when content won't fit
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

## Requirements

- Claude Code with `docx` npm package (`npm install -g docx`)
- LibreOffice (for PDF preview)
- `pandoc` (for reading existing documents)
