# Turning slides into cheatsheet content

## Core philosophy

The sheet is not "what the slides said". It is **the shortest thing a stressed reader needs to find the answer — and can understand without having the slides open**. Reorganize, merge, and explain connections the slides left implicit. Transcribing slides in order produces a document the user already has; compressing it into fragments produces one nobody can read.

## Read first, write second

Extract every source file to text and read all of it before drafting. Formulas are often images, so render those pages and look at them. Prefer the instructor's annotated decks when they exist and look at the rendered pages: handwritten notes and circled formulas are not in the text layer. Also read homework, in-class activities, marked discussion notes, labs, announcements and forum answers: they show what the instructor actually asks and which topics are flagged as examinable.

## Synthesis moves (do these deliberately)

| Move | When | Result |
|------|------|--------|
| **Unify** | the same concept appears in several chapters | one table placing every version on one axis |
| **Chain** | a decision has several consequences | "principle → consequence → consequence" |
| **Rule instead of table** | a table follows from a few rules | "how to derive it" bullets |
| **Side-by-side** | the course keeps contrasting two things | one comparison table |
| **Record the trap** | the lecturer says "note", or two slide decks use different conventions (e.g. confusion-matrix row order) | a ⚠ line |
| **Explain the why** | a conclusion without its reason | add the reason in the same sentence |

## Keep

- Definitions, one sentence each, key term in bold, every symbol explained on first use.
- **Every** formula on the slides, with every symbol defined once — including chapters the instructor called "not a focus" and expansions the lecturer wrote out. Skip only slides marked as not examinable.
- Comparison / encoding / metric tables.
- Procedures as numbered steps (① ② ③).
- Everything the instructor flagged as examinable, however trivial it looks: history timelines (as a table with every year from the slides), definitions from intro lectures, ethics points.
- Calculations the instructor says were done in class and may be tested: question, answer, one-line reason, in a table.

## Cut

- Beginner basics a revising student already knows: what an image / pixel / histogram is, storage size, the definition of sampling, "point vs neighbourhood operation".
- Exam logistics: title, duration, open/closed book, marks split, MCQ scoring rules, course map.
- Worked examples, "answers to check against", homework answers (keep the procedure only) — unless the user asks.
- References to an example by its label ("the XYZ table", "F02", "HW3") — restate the setup or drop it.
- Motivational and historical prose beyond what the instructor flagged.
- Anything already implied by a table on the sheet.
- Lead-in phrases, restated headings, hedges.
- Invented abbreviations and telegraphic fragments.

## Per-slide checklist (internal)

```
For each slide:
1. Topic? (transition / agenda slide → skip)
2. Introduces a term, formula or rule? → one full sentence, bold the term, define symbols; every formula is kept
3. A table or list of variants? → native docx table
4. Contrasts two things? → comparison table
5. Says "note", "common mistake", or conflicts with another deck? → ⚠ candidate
6. A worked example? → extract the procedure only
7. A figure whose layout IS the content? → crop candidate
```

## Language

If the user wants Chinese, the body is Chinese and these stay English: model and algorithm names, metric names, standard terms the exam prints in English (overfitting, margin, kernel, entropy…), code and formulas.

## Self-audit before generating

- [ ] Does the sheet start straight with content (no title, exam-info line or course-map table)?
- [ ] Is every formula chain or multi-formula statement on its own centred display line under a label, not inline?
- [ ] Did a deck-by-deck pass find every slide formula on the sheet (annotated decks and low-priority chapters included)?
- [ ] Is any line a beginner definition the user already knows (what a histogram is, storage size)? Delete it.
- [ ] Could someone who skipped the lectures understand every line? (symbols defined, no slide labels, reasons given)
- [ ] Is any line a telegraphic fragment? Rewrite it as a sentence.
- [ ] Did every scattered comparison become a table?
- [ ] Is every ⚠ line an actual mistake the reader could make?
- [ ] Are all instructor-flagged topics present?
- [ ] Are there worked examples the user did not ask for? Delete them.
- [ ] Were all kept numbers recomputed, not copied?
