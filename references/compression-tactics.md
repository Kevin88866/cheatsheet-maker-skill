# Compression tactics — only when a page limit is enforced

Default behaviour is content-driven page count: the sheet is as long as the content needs, and the font grows to fill the last page. Use this file only when the exam **enforces** a page limit and the content does not fit at 8pt body.

## Order of operations

### 1. Cut content, not legibility

- Delete bullets that restate a table or heading.
- Replace remaining prose comparisons with a table row.
- Drop history, motivation, tool trivia.
- Drop any worked example.
- Merge two short sections under one heading.

### 2. Tighten layout without shrinking text

- Line spacing 240 → 230.
- Paragraph `after` 20 → 10.
- Margins 1 cm → 0.7 cm (398 DXA); column gap 0.6 → 0.5 cm.
- Shrink figure widths; move a full-width figure inline at 4 cm if it survives.

### 3. Font, with a hard floor

- Body 8.5pt → 8pt (BODY 17 → 16). **Stop here.** Below 8pt the sheet fails its purpose.
- Table and code text may sit 0.5pt under body.

### 4. Structural

- Ask the user which chapters are lowest priority; move them to the last page or cut them.
- Offer to leave a blank block for handwritten additions if the exam allows handwriting.

## Never

- Never invent abbreviations to save space.
- Never remove the typography hierarchy (single font, single size) to fit.
- Never crop a slide table as an image.
- Never go to 4 columns with CJK body text; lines become 12 characters wide.

## Do after every adjustment

Rebuild, export PDF, render the pages, and look. Page count alone does not show overflowing tables or orphaned headings.
