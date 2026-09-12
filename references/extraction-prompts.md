# Turning slides into cheatsheet content

## Core philosophy

The sheet is not "what the slides said". It is **the shortest thing a stressed reader needs to find the answer**. That means you reorganize, merge and explain connections the slides left implicit. Transcribing slides in order produces a document the user already has.

## Read first, write second

Extract every source file to text and read all of it before drafting a single section. Only then can you see that "abstraction layers" appears in three chapters, or that six scattered "unlike ARM…" remarks are really one comparison table.

## Synthesis moves (do these deliberately)

| Move | When | Result |
|------|------|--------|
| **Unify** | the same concept is introduced in several chapters with different framing | one table placing every version on one axis, with a sentence on how they relate |
| **Chain** | a design decision has several consequences listed as separate facts | "Principle → consequence → consequence" bullet |
| **Rule instead of table** | a truth table follows from a few rules | "how to derive it" bullets, keep the table only for checking |
| **Side-by-side** | the course constantly contrasts two things (RISC-V vs ARM, fixed vs floating, Moore vs Mealy) | one comparison table, not scattered remarks |
| **Record the trap** | the lecturer says "note", "non-intuitive", "common mistake", or a sign convention differs between systems | a ⚠ line |
| **Map the course** | always | an opening overview table: every chapter, what layer / stage it covers, how it connects |

## Keep

- Definitions, one line each, with the term in bold.
- Formulas, with every symbol defined once.
- Encodings, opcode tables, register conventions, control-signal tables — as tables.
- Procedures as numbered steps (① ② ③ inline is fine).
- Boundary rules: ranges, alignment, what is sign-extended vs zero-extended.
- Explicitly examinable trivia the lecturer flagged (e.g. "one or two exam questions on the state of the industry").

## Cut

- Worked numeric examples (keep the procedure; the numbers are noise). Add them only if the user asks or the exam reuses homework.
- Motivational and historical prose beyond a one-line timeline.
- Anything already implied by a table on the sheet.
- Repeated "unlike X…" remarks once the comparison table exists.
- Lead-in phrases, restated headings, hedges.
- Invented abbreviations. Write the word.

## Per-slide checklist (internal)

```
For each slide:
1. Topic? (transition / agenda slide → skip)
2. Does it introduce a term, formula or rule? → one line, bold the term
3. Is it a table or list of variants? → native docx table
4. Does it contrast two things? → mark for the comparison table
5. Does it say "note", "non-intuitive", "unlike", "common mistake"? → ⚠ candidate
6. Is it a worked example? → extract the procedure only
7. Is it a figure whose layout IS the content? → crop candidate
```

## Language

If the user writes in Chinese, the body is Chinese and these stay English: instruction mnemonics, signal and register names, standard terms (ISA, load-store, critical path, caller-saved, IEEE 754…), anything the exam paper itself will print in English. Do not translate code or tables of encodings.

## Before generating, self-audit

- [ ] Is there an opening map of the whole course?
- [ ] Did every scattered comparison become a table?
- [ ] Does every formula have its symbols defined once?
- [ ] Is every ⚠ line an actual mistake the reader could make?
- [ ] Is there any bullet that only restates a heading or a table? Delete it.
- [ ] Are there worked examples the user did not ask for? Delete them.
