# Compression tactics — when a page limit is enforced

Use this file when the exam enforces a page limit ("one A4 sheet, double-sided" = 2 pages) and the content does not fit at 8pt body.

## The one rule

**Cut whole items; never compress wording.** Shortening every sentence into fragments ("C 大 → 调小 C", "0–1 在 margin 内但分对", "XYZ 表: I = 0.311") makes the sheet unreadable, and a user who cannot read a line under stress gets nothing from it. Every surviving bullet stays a complete, self-explanatory sentence.

## Order of operations

### 1. Recover wasted space (no content lost)

- Run `measure.py`; fix columns that end early because a heading + table block jumped (see layout-spec.md, tuning step 2).
- Rebalance table column weights so cells stop wrapping to a third line.
- Merge two short bullets on the same idea into one sentence.

### 2. Cut, lowest value first

1. Worked examples and "answers to check against" (homework answers, numeric walk-throughs). Keep the procedure.
2. Items that repeat a table or heading.
3. Theory the course only mentions (bounds, proofs, derivations) — keep the one-line intuition.
4. Tool and library trivia, unless the exam asks about code.
5. Anything belonging to a different test.

**Never cut** topics the instructor flagged as examinable (e.g. "the intro weeks may be tested": history timeline, definitions, ethics), exam traps (⚠ lines), or formulas needed for calculation questions.

### 3. Layout, with floors

- Margins down to 0.7 cm (0.6 cm absolute floor), column gap 0.4 cm.
- Line spacing: Latin 240 → 230 auto; CJK exact 192 → 188 at most.
- Body 8.5pt → 8pt. **Stop here.** Table and code text may sit 0.5pt under body.

### 4. Ask

If it still does not fit, ask the user which chapter or item is lowest priority. Show them what is on the cut list.

## When space frees up later

If the user removes something (e.g. "drop the examples"), restore the knowledge points cut earlier before enlarging the font. Enlarge only if the user asks or nothing worth adding remains.

## Never

- Never invent abbreviations or reference examples by slide / homework label to save space.
- Never remove the typography hierarchy to fit.
- Never crop a slide table as an image.
- Never go to 4 columns with CJK body text.

## After every adjustment

Rebuild, export, run `measure.py`, render the pages, and look.
