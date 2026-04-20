---
name: cheatsheet-maker
description: Create exam cheatsheets (crib sheets / reference sheets) on A4 landscape pages (3 columns, content-driven page count), with the core goal of maximizing paper space utilization. Use this skill whenever the user mentions "cheatsheet", "crib sheet", "reference sheet", "exam cheatsheet", "A4 summary", "one-page study guide", "final exam one-pager", or uploads PPTs/homework/notes and wants them compressed onto a single sheet. Also applies when the user says things like "help me condense this onto one page", "make an exam cheatsheet", or "printable review sheet". Output is a Word (.docx) file with extreme space-efficient layout, supporting math formulas, concept comparison tables, automatic compression strategies, and automatic key-point extraction from PPTs/homework/notes.
---

# Cheatsheet Maker

Creates cheatsheets (crib sheets / reference sheets) that maximize A4 paper space for exam use. Core philosophy: **cram all the essentials onto 2 A4 pages (double-sided) while keeping them legible.**

## Trigger scenarios

Activate this skill for any of the following requests:
- "Help me make a cheatsheet / crib sheet / reference sheet"
- "One-page summary for final exam"
- "Condense this content onto one A4 sheet"
- Uploading PPTs / homework / notes and asking to "compress into a cheatsheet"
- Requesting a one-page printable review sheet

## Workflow

### Step 1: Gather materials and clarify requirements

Ask the user these key questions (unless already answered):

1. **Subject and scope**: What course? What's the exam coverage? Is there a syllabus / study guide from the instructor?
2. **Source materials**:
   - Any PPTs / lecture notes / homework / example problems / sample exams? → Have them upload
   - If they already have organized content, have them paste it
3. **Exam rules**:
   - A4 single-sided? Double-sided?
   - Handwritten annotations allowed or print-only?
   - Any font size / layout restrictions?
4. **Content preferences**:
   - Focus on formula derivations or concept memorization?
   - Include example problems?
5. **Paper strategy**: **Default target = 2 pages (double-sided A4 landscape, 3 columns).** Adaptive content strategy:
   - **Under 2 pages**: aggressively expand — add explanatory sub-lines for every concept, include intuition ("why does this work?"), edge cases, worked mini-examples, comparison of similar concepts, common exam pitfalls. Keep adding until the content fills the target page count. An under-filled cheatsheet wastes exam-allowed space.
   - **Over 2 pages**: compress — cut explanatory sub-lines, merge related points, reduce to formula-only style. **NEVER exceed the target page count.** Generate, estimate page count, and iterate compression until the content fits.
   - Only override the 2-page default if user explicitly specifies a different page count

### Step 2: Extract and organize content

If the user uploaded PPTs / homework / notes:

1. **Read the materials**:
   - PPT → use pptx-related tools to extract text
   - DOCX → `extract-text` command
   - **PDF → size-check first (see below)**

   **PDF size check protocol** (run before reading any PDF):
   - Sum the file sizes of all PDFs the user has provided
   - **If total < 25 MB**: read PDFs directly with pdf-reading tools. Screenshot/image cropping in Step 4 is **enabled** — crop diagrams from slides as usual.
   - **If total ≥ 25 MB**: convert each PDF to plain text first (e.g., `pdftotext`, `pymupdf` text extraction, or `pandoc`), then read the resulting `.txt` files. Screenshot/image cropping in Step 4 is **disabled** — replace all diagram slots with concise **text descriptions** of the visual (e.g., "State diagram: READY→RUNNING on dispatch, RUNNING→BLOCKED on I/O wait, RUNNING→READY on preempt"). Never attempt to extract images from the PDF in this mode.
2. **Extraction strategy** (based on proven exam-prep principles):
   - **Example problems**: Integrate sample exam questions and homework solution skeletons (instructors often test homework variants)
   - **PPT key concepts**: List key definitions, formulas, theorems; turn easily-confused concepts into comparison tables
   - **Open questions**: Build answer frameworks for open-ended questions on the slides
3. **Content compression**:
   - Delete filler words and long example sentences; keep only conclusions
   - Compress procedural derivations into single-line formula chains
   - Compress concept definitions into one sentence
4. **Grouping**: Organize as "Chapter → Topic → Formula/Example"

### Step 3: Generate the Word cheatsheet

Use `docx-js` to generate, **strictly following these layout rules** (proven max-space formula from user experience):

Read `references/layout-spec.md` for complete technical specs and code templates.

Key points at a glance:
- **Default: A4 landscape, single section, 3 columns, target 2 pages** — use `sections: [{ properties: pageProps, children: [...page1, ...page2] }]`; A4 landscape size is `width:11906, height:16838, orientation:PageOrientation.LANDSCAPE` (docx-js swaps internally — pass portrait dimensions)
- **Content density rule**: Use `np()` for numbered main points; use `p()` for indented sub-lines with explanations/edge cases. Fill to ~2 pages: if under, add `p()` sub-lines; if over, remove `p()` sub-lines first, then merge `np()` points
- A4 landscape, 0.5cm page margins all around
- 3 columns, 0.5cm column spacing (4 columns for extreme cases)
- Chinese: DengXian 5.5pt; English: Calibri 6.5pt
- Minimum line spacing (single line, `line: 240`, tight mode)
- Section headings: bold + color-coded
- **Each bullet/point within a section must be prefixed with a number (1. 2. 3. ...), resetting to 1 for each new section**
- Example problems vs answers: different colors
- Tables: minimum width/height, zero cell padding

### Step 4: Add diagrams and images

Diagrams are often the most space-efficient way to convey structural or procedural concepts. Add them wherever a picture saves more words than it costs space.

**When to add a diagram**:
- State machines / flow diagrams (e.g., process state transitions)
- Memory layout / data structure diagrams (e.g., stack frame, page table, inode)
- Algorithm step-by-step traces (e.g., page replacement, disk scheduling)
- Architectural overviews (e.g., OS layers, TLB lookup flow)
- Any concept where the spatial relationship matters

**Sources for images** (only when screenshot mode is enabled — total PDF size < 25 MB; see Step 2):
1. **Crop from lecture slides**: Extract a specific page from the PDF as an image, then crop to the relevant diagram. Use `pymupdf` (fitz) or `pdf2image`:
   ```python
   import fitz  # pymupdf
   doc = fitz.open("lecture.pdf")
   page = doc[page_num]
   mat = fitz.Matrix(2, 2)  # 2x zoom for clarity
   pix = page.get_pixmap(matrix=mat)
   pix.save("diagram.png")
   ```
   Then crop with Pillow: `img.crop((x1,y1,x2,y2)).save("cropped.png")`
2. **Draw using docx tables**: For simple box diagrams (memory layouts, state machines), use a borderless or lightly-bordered table with colored cell shading to represent boxes/nodes. This is vector-based and scales well.
3. **ASCII-art in monospace**: For flow arrows and simple hierarchies, use a `Courier New` paragraph block.

**Embedding images in docx-js**:
```javascript
const { ImageRun } = require('docx');
const imgData = fs.readFileSync('diagram.png');
new Paragraph({
  children: [new ImageRun({
    data: imgData,
    transformation: { width: 150, height: 80 },  // in points; tune to fit column
    type: 'png'
  })]
})
```
Keep images narrow (≤ column width ≈ 150–170pt for 3-column A4 landscape) and use tight wrapping. Prefer width-constrained images over tall ones to save vertical space.

**Self-drawn table diagrams** (when no slide image available):
- Use colored `TableCell` with `ShadingType.SOLID` to draw boxes
- Use arrow characters (→ ↔ ↑ ↓) in adjacent cells for flow
- Example: memory layout = vertical table with colored rows for Text/Data/Heap/Stack

### Step 5: Math formula handling

Read `references/formula-handling.md` for formula insertion details.

Key principles:
- Use Word's native formulas (OMML), not images or plain text
- Common templates: fractions, integrals, summations, matrices, Greek letters
- Italicize variables and leave 1pt padding around them for readability

### Step 5: Concept comparison tables

For easily confused concepts (e.g., normal vs t distribution, biased vs unbiased estimators, precision vs recall), **strongly recommend tables**.

Read `references/comparison-tables.md` for table templates.

### Step 6: Space compression strategies

If content doesn't fit after initial generation, adjust in this order (read `references/compression-tactics.md`):

1. Cut textual redundancy → 2. Increase columns → 3. Reduce font size (English to 5pt, Chinese to 5pt) → 4. Switch to double-sided → 5. Suggest handwritten supplementation

### Step 7: Review & deliver

1. **Print simulation**: Generate a PDF preview and compare with an actual A4 sheet to check legibility
2. **Save reminders**: **During generation, remind the user to back up after every formula insertion / image adjustment / table adjustment** (Word can crash)
3. **Delivery**: Save the .docx to `/mnt/user-data/outputs/` and return it via `present_files`

## Core principles

1. **Space > aesthetics**: This is an exam tool. Cramming info in and keeping it legible is what makes a good cheatsheet. Don't chase design aesthetics.
2. **User-first priority**: Ask exam rules first, then content, then layout.
3. **Proactive save reminders**: Word can crash during dense formula/table operations. **Remind the user to back up after every key operation.**
4. **Use visual hierarchy well**: Bold + colors + underlines + italics to separate key points; different colors for different chapters.
5. **Honest trade-offs**: If content really doesn't fit, tell the user clearly and help them decide what to cut.

## Reference files

- `references/layout-spec.md` — Complete docx-js code template for A4 three-column layout
- `references/formula-handling.md` — Methods for inserting math formulas in Word
- `references/comparison-tables.md` — Concept comparison table templates
- `references/compression-tactics.md` — Strategies when content won't fit
- `references/extraction-prompts.md` — Prompts for extracting key points from PPTs/homework

## Dependencies

- `docx` npm package (for generating .docx)
- `pandoc` / `extract-text` (for reading existing documents)
- LibreOffice (for PDF previews)
