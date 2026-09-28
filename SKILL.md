---
name: cheatsheet-maker
description: Create exam cheatsheets (crib sheets / reference sheets) as A4 landscape, 3-column Word (.docx) + PDF, built for fast lookup under exam stress. Use this skill whenever the user mentions "cheatsheet", "crib sheet", "reference sheet", "exam cheatsheet", "A4 summary", "study guide", or uploads lecture slides / PDFs / notes and wants them condensed for an exam. Core rules — every line readable without the slides (complete sentences, symbols defined, no cryptic references), synthesized summaries over slide transcription, tables over prose, no invented abbreviations, no worked examples unless asked, instructor-flagged topics never cut, page limit met by cutting low-value items rather than compressing wording, body font never below 8pt.
---

# Cheatsheet Maker

Turns lecture slides, notes and homework into a print-ready exam cheatsheet. The sheet is something the user scans in five seconds under stress, so **findability and readability beat density**. A line the user cannot understand in the exam is wasted space, however much information it packs.

## Trigger scenarios

- "Make me a cheatsheet / crib sheet / reference sheet for <course>"
- "Condense these slides / notes for the final"
- User uploads lecture PDFs / PPTs and asks for a summary to print
- User asks to extend an existing cheatsheet with new chapters

## The ten rules (read before writing anything)

1. **Synthesize, don't transcribe.** The slides are the source, not the outline. When the same idea appears in several places, write **one** unified table or list and say how the pieces connect. Write "principle → consequence → consequence" instead of unrelated facts. Add "how to derive X" notes where a rule exists.
2. **Readable without the slides.** Every bullet is a complete statement that a reader who never opened the slides understands:
   - define every symbol and acronym on first use ("ξ (slack) = how far point i crosses the margin", "residual = actual − predicted");
   - never refer to an example by its slide or homework label ("the XYZ table", "F02", "the 30-point example") without restating its setup;
   - give the reason after the conclusion ("F1 uses the harmonic mean because it is pulled down by the smaller of P and R").
3. **Never compress wording to fit.** When the sheet is too long, **cut a whole low-value item**, not letters from every item. Telegraphic fragments ("C 大 → 调小 C", "0–1 在 margin 内") look efficient and are unreadable under stress. See `references/compression-tactics.md` for what to cut first.
4. **No invented abbreviations.** Use the course's own names (ISA, CPI, SVM, ROC) and spell everything else out.
5. **Tables for anything with two or more dimensions.** Comparisons, encodings, "when to use which", metric definitions, timelines. Prose is for a single line of reasoning only.
6. **Typography hierarchy, several fonts.** Coloured chapter bars, coloured underlined sub-headings, sans body, monospace for code / mnemonics, bold key term in each bullet, highlighted ⚠ line for exam traps.
7. **No worked examples by default.** Keep the rule, the procedure and the trap; drop the numbers. This includes "answers to check against", homework answers and numeric walk-throughs of class examples. Exceptions: the user asks for them, or the instructor says specific in-class calculations are examinable — then give question, answer and a one-line reason in a table, nothing more.
8. **Instructor-flagged topics are never "low value".** If the instructor says a topic will be tested (e.g. "the introduction weeks may be tested"), cover it fully even if it looks like trivia: every year and name in a history timeline (as a table), every definition, every ethics point. Search announcements, forum answers and schedules for these statements before planning.
9. **Page count is driven by content and the user's limit; the font never goes below 8pt.** If an exam limit is known ("one sheet, double-sided" = 2 pages), fill exactly that. When space frees up (for example after the user asks to drop examples), **first restore knowledge points that were cut earlier**; enlarge the font or line spacing only if the user wants that or nothing worth adding is left.
10. **Language follows the user.** A user writing in Chinese usually wants Chinese body text with technical terms in English (model names, metric names, standard terms the exam paper prints in English); confirm once if a global instruction says otherwise, then remember it. Chinese text needs the CJK layout settings in `references/layout-spec.md`.

## Workflow

### Step 1: Confirm scope and constraints (only what is not already known)

- Which chapters / files are in scope? Is there an instructor list of examinable topics? Check the course schedule, announcements and forum answers (Piazza, Canvas) yourself first.
- Exam rules: page limit? single or double-sided? printed allowed? Language?
- Is an earlier cheatsheet being extended? If so, reuse its build script and style.

Ask what you could not find in one message. Do not ask again later.

### Step 2: Read everything, then plan the structure yourself

1. Extract slide text (`pdftotext -layout`, or pymupdf). Formulas are often images: render those pages and look at them. Read all of it before writing.
2. Also read homework, in-class activities, marked discussion documents and interactive labs: they show what the instructor actually asks.
3. Draft the section list **by topic, not by slide order**. Open with an overview table that places every model / chapter on one map.
4. For each section decide the form first: table, bullet list, formula, or figure. See `references/extraction-prompts.md`.
5. Mark the exam traps (lecturer's "note", easy-to-confuse pairs, conflicting conventions between slide decks) — these become ⚠ lines.
6. Verify every number you keep by recomputing it (a short script), not by copying it from a slide.

### Step 3: Choose figures

A figure earns its place only when the spatial relationship is the content. Crop at ≥ 200 dpi with pymupdf + Pillow. Slide **tables** are rebuilt as native docx tables.

- Small figures (≤ 4 cm wide) go inline in a column.
- Large figures go in a **single-column continuous section at the very end**.

### Step 4: Build with the template

Copy `references/build-template.js` and fill in the content section. It provides `h1`, `h2`, `b` (bullet), `warn` (⚠ trap line), `formula`, `code`, `table`, `img`, inline markup (`**bold**`, `` `code` ``, `!!red!!`, `_{sub}`, `^{sup}`), splittable long tables, CJK settings and the Word post-processing. Specs are in `references/layout-spec.md`.

Non-negotiable technical points (each one cost a rebuild in practice):
- Page size is passed as **portrait** dimensions plus `orientation: LANDSCAPE`.
- Tables use `layout: TableLayoutType.FIXED` and explicit `columnWidths`; the template scales relative weights to the column width.
- Body ≥ 8pt. Table and code text may be 0.5pt smaller.
- Chinese: `eastAsia` font 等线 (DengXian), Latin Calibri, headings Microsoft YaHei; **exact** line spacing (Word adds ~30% leading to CJK fonts under auto spacing); half-width （），；： (Word does not compress full-width punctuation). The template's `CJK=1` mode does all of this.

### Step 5: Render, look, iterate

1. Build, export to PDF (Word COM on Windows, LibreOffice elsewhere), get the page count.
2. Run `references/measure.py <pdf>`: it prints where each column's text ends. A column ending far above the bottom means a heading + table block jumped to the next column; fix it (let long tables split, shorten a line just before it, or reorder) before cutting content.
3. Render every page to PNG and **look at them**: tables inside their column, no orphaned heading, no bullet split across the front/back page break (give that one bullet `keepLines`), no unparsed markup.
4. Tune in this order: fix overflows and column gaps → adjust table weights → cut low-value items (never compress wording) → line spacing. Stop when every page is full and readable.
5. Do not deliver on the first render.

### Step 6: Deliver

- Save `.docx` and `.pdf` next to the source material, plus the build script, `measure.py`, the export script and any cropped figures in a `cheatsheet_assets/` folder.
- Tell the user the page count, the font size, what was synthesized, what was cut to fit, and what is not covered.
- Invite them to name any line they cannot understand; rewrite those lines rather than defending them.

## What "good" looks like

- The first section is a map of the whole course that the slides never gave.
- A reader who skipped a lecture can still use every line.
- A reader can find any answer in under five seconds because it sits in a table under a heading that says so.
- Every ⚠ line is a mistake the user would otherwise make in the exam.
- Nothing is on the sheet that the user would skim past, and nothing the instructor flagged is missing.

## Reference files

- `references/build-template.js` — complete, runnable docx-js build script (Latin or CJK mode); copy and fill in content
- `references/measure.py` — page count and per-column fill of the exported PDF, optional page PNGs
- `references/layout-spec.md` — geometry, fonts, CJK settings, tables, export, page-count tuning
- `references/extraction-prompts.md` — synthesis moves, keep / cut lists, readability check
- `references/comparison-tables.md` — when and how to use tables
- `references/formula-handling.md` — Word-native OMML math for formula-heavy courses
- `references/compression-tactics.md` — what to cut, in which order, when a page limit is enforced

## Dependencies

- `docx` npm package (v9+; its bundled `jszip` is used for post-processing)
- Python with `pymupdf` and `Pillow`
- `pdftotext` (poppler) optional
- PDF export: Microsoft Word (via COM on Windows) or LibreOffice
