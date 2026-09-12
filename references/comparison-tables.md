# Comparison tables

Tables are the highest-lookup-speed layout on a cheatsheet. Use them for anything with two or more dimensions.

## When to use

- Two things the course keeps contrasting: RISC-V vs ARM, fixed-point vs floating-point, Moore vs Mealy, t-test vs z-test.
- Variants of one thing: instruction formats, load/store widths, IEEE precisions, distributions.
- Encodings and control signals: opcode / funct3 tables, control truth tables, flag semantics.
- "When is which rule right": signed vs unsigned overflow, sign-extend vs zero-extend, caller- vs callee-saved.
- Overviews: chapter × layer × what-it-produces maps.

## Shapes

**A vs B** — first column is the attribute, one column per thing. Put the attribute the reader searches by (e.g. "flags", "immediates") in the first column.

**Variants** — one row per variant, columns for the fields that differ. Mnemonic or code in a monospace column.

**Rule table** — condition | formula | one-line reason. The reason column is what makes it memorable.

**Overview map** — layer / stage | what it is | who works at it / artefact | where in the course.

## Using the template helper

```javascript
table(['', 'RISC-V', 'ARM'], [
  ['flags', '无', 'NZCV，CMP 设置、条件码使用'],
  ['移位', 'sll / srl / sra 是真指令', 'MOV 的变体'],
], [2.0, 3.3, 3.2], { zebra: true });          // widths in cm, total ≤ 8.5

table(['op', '指令', 'ImmSrc', 'ALUControl'], rows,
  [0.5, 1.0, 1.0, 2.2], { mono: [0, 2, 3], center: [0], zebra: true });
```

- `mono`: column indexes rendered in Consolas.
- `center`: column indexes centred.
- `zebra`: alternate row fill for long tables.
- Header row automatically takes the current chapter colour.

## Rules

- Total column width ≤ 8.5 cm. Widen the column that holds the longest token; a wrapped mnemonic is unreadable.
- Short header text; if a header wraps, rename it.
- Bold the key term in a cell, not the whole cell.
- Keep a small table in one column (`keepNext` is set by the template).
- A table that needs more than ~10 columns is two tables.
