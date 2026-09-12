---
name: cheatsheet-maker
description: Create exam cheatsheets (crib sheets / reference sheets) as A4 landscape, 3-column Word (.docx) + PDF, built for fast lookup under exam stress. Use this skill whenever the user mentions "cheatsheet", "crib sheet", "reference sheet", "exam cheatsheet", "A4 summary", "study guide", or uploads lecture slides / PDFs / notes and wants them condensed for an exam. Core rules — readable typography hierarchy over cramming, synthesized summaries over slide transcription, tables over prose, no filler words, no invented abbreviations, no worked examples unless asked, page count driven by content, and the font grows (never shrinks below 8pt) to fill the last page.
---

# Cheatsheet Maker

Turns lecture slides, notes and homework into a print-ready exam cheatsheet. The sheet is something the user scans in five seconds under stress, so **findability and readability beat density**. Most exams that allow a cheatsheet allow several pages; a sheet nobody can read wastes every one of them.

## Trigger scenarios

- "Make me a cheatsheet / crib sheet / reference sheet for <course>"
- "Condense these slides / notes for the final"
- User uploads lecture PDFs / PPTs and asks for a summary to print
- User asks to extend an existing cheatsheet with new chapters

## The eight rules (read before writing anything)

1. **Synthesize, don't transcribe.** The slides are the source, not the outline. When the same idea appears in three places (e.g. "layers of abstraction" in the intro chapter, the ISA chapter and the design-flow chapter), write **one** unified table or list and say how the pieces connect. When a design has a cause and consequences, write "principle → consequence 1 → consequence 2" instead of listing the consequences as unrelated facts. Add "how to derive X without memorizing the table" notes where a rule exists.
2. **One fact per bullet, no filler.** Delete lead-ins ("note that", "in this case", "it is important to"), delete restatements of the slide title, delete the second half of any sentence that only rephrases the first half. If a bullet needs a second sentence, it is usually two bullets.
3. **No invented abbreviations.** Use the course's own names (ISA, CPI, CLA, ALU) and spell everything else out. "Instr", "comb.", "reg." and similar save nothing and cost a re-read.
4. **Tables for anything with two or more dimensions.** Encodings, control signals, register conventions, A-vs-B comparisons, flag semantics, "when to use which" all go in tables. Prose is for a single line of reasoning only.
5. **Typography hierarchy, several fonts.** Coloured heading bars for chapters, coloured underlined sub-headings, a body sans font, a monospace font for code / mnemonics / bit fields / signal names, bold for the key term in each bullet, a highlighted ⚠ line for exam traps. One font at one size is unreadable no matter how good the content is.
6. **No worked numeric examples by default.** Keep the rule, the procedure and the trap; drop the numbers. Add examples only when the user asks, or when the exam is known to reuse homework variants.
7. **Page count is driven by content; the font is driven by page count.** Body text starts at 8.5–9pt and **never goes below 8pt**. If the content ends part-way down the last page, **increase** the font or line spacing until the pages are full. Do not pad with extra content to fill space unless the user asks.
8. **Language follows the user.** If the user writes in Chinese, the body is Chinese with technical terms kept in English (instruction mnemonics, signal names, standard terms like load-store, critical path, callee-saved). Otherwise English throughout.

## Workflow

### Step 1: Confirm scope and constraints (only what is not already known)

- Which chapters / files are in scope? Is there an instructor list of examinable topics?
- Exam rules: page limit? printed allowed? colour allowed? Language preference?
- Is an earlier cheatsheet being extended? If so, reuse its build script and style.

Ask these in one message. Do not ask again later.

### Step 2: Read everything, then plan the structure yourself

1. Extract slide text (`pdftotext -layout`, or pymupdf). Read all of it before writing; partial reading produces slide-order transcription.
2. Draft the section list **by topic, not by slide order**. Merge overlapping material across chapters. Typical opening section: an overview table that places every chapter on one mental map.
3. For each section decide the form first: table, bullet list, code block, formula, or figure. See `references/extraction-prompts.md` for what to keep and what to cut.
4. Mark the exam traps (things the lecturer flagged, easy-to-confuse pairs, sign conventions) — these become ⚠ lines.

### Step 3: Choose figures

A figure earns its place only when the spatial relationship is the content (a datapath, a state machine, a memory layout). Crop it from the slides at ≥200 dpi with pymupdf + Pillow. Slide **tables** must be rebuilt as native docx tables; cropped tables are unreadable at column width.

- Small figures (≤ 4 cm wide) go inline in a column.
- Large figures (a full datapath) go in a **single-column continuous section at the very end** of the document; Word balances the preceding columns above it. Never put a full-width figure mid-document — it leaves a gap wherever it does not fit.

### Step 4: Build with the template

Copy `references/build-template.js` and fill in the content section. It already provides: `h1`, `h2`, `b` (bullet), `warn` (⚠ trap line), `code`, `formula`, `table`, `img`, an inline markup parser (`**bold**`, `` `code` ``), fixed-layout tables, the title section, the 3-column body section and the optional full-width figure section. Full specs are in `references/layout-spec.md`.

Non-negotiable technical points (each one cost a rebuild in practice):
- Page size is passed as **portrait** dimensions plus `orientation: LANDSCAPE`; passing landscape dimensions yields a portrait page and every table overflows.
- Tables use `layout: TableLayoutType.FIXED`, explicit `columnWidths`, total ≤ 8.5 cm for a 3-column page with 1 cm margins.
- Body ≥ 8pt. Code and table text may be 0.5pt smaller than body.
- Chinese body text uses an `eastAsia` font (等线 / DengXian) and Latin text a matching sans (Calibri); set both on every run.

### Step 5: Render, look, iterate

1. Build the docx, export to PDF and get the page count. On Windows use Word COM (see `references/layout-spec.md`); on other systems use LibreOffice.
2. Render every page to PNG and **look at them**. Check: no table wider than its column, no heading orphaned at a column bottom, no half-empty last page, code blocks not wrapped mid-token, figures legible.
3. Tune in this order: fix overflows → adjust column widths → adjust body size (BODY env var) and line spacing → adjust figure width. Stop when every page is full and readable.
4. Do not deliver on the first render.

### Step 6: Deliver

- Save `.docx` and `.pdf` next to the source material, plus the build script and any cropped figures in a `cheatsheet_assets/` folder so the sheet can be extended later.
- Tell the user the page count, the font size, what was synthesized (not just listed), and what is not covered yet.

## What "good" looks like

- The first section is a map of the whole course that the slides never gave.
- A reader can find "what does ImmSrc mean for a B-type" in under five seconds because it is in a table under a heading that says so.
- Every ⚠ line is a mistake the user would otherwise make in the exam.
- Nothing is on the sheet that the user would skim past.

## Reference files

- `references/build-template.js` — complete, runnable docx-js build script; copy and fill in content
- `references/layout-spec.md` — page geometry, fonts, sizes, colours, Word COM / LibreOffice export, page-count tuning
- `references/extraction-prompts.md` — how to turn slides into synthesized content; keep / cut lists
- `references/comparison-tables.md` — when and how to use tables
- `references/formula-handling.md` — Word-native OMML math for formula-heavy courses
- `references/compression-tactics.md` — what to do when content genuinely exceeds an enforced page limit

## Dependencies

- `docx` npm package (v9+)
- Python with `pymupdf` and `Pillow` for slide text / figure extraction
- `pdftotext` (poppler) optional
- PDF export: Microsoft Word (via COM on Windows) or LibreOffice
