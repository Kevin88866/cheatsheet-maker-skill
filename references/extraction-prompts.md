# Extracting Key Points from PPTs / Homework / Notes

This file guides Claude on how to refine raw materials into cheatsheet-worthy content.

## Core philosophy

**What goes on a cheatsheet isn't "what I understand" — it's "the one line of prompt I need when I see a question on exam day".**

## Extracting from PPTs

### What goes into the cheatsheet

1. **Definitions and formulas**: One-sentence definition + core formula for each new concept
2. **Theorems/properties**: Conditions + conclusion
3. **Algorithms/procedures**: Step skeleton (no explanation)
4. **Comparison tables**: A vs B comparisons from the slides
5. **Counterexamples / common mistakes**: Pitfalls the instructor specifically emphasized
6. **Key conclusions from diagrams**: Diagrams themselves don't fit, but put the conclusions behind them in
7. **Answer frameworks for open questions** from the slides

### What stays out

1. Long-form explanations
2. Historical background / motivating stories
3. Derivation intermediate steps (keep only starting and ending points)
4. Duplicate content (same concept across multiple slides → keep only the tightest phrasing once)

### Extraction prompt template

Internal instruction for Claude:
```
After reading the PPT, for each slide:
1. What is this slide's topic? (If transition / intro only, skip)
2. Any formulas? → Extract all formulas + meaning of each symbol
3. Any definitions? → Compress to one sentence
4. Any tables? → Keep
5. Any emphasis (bold/red/!/keyword "important") → Must keep
6. Can the rest be summarized in one line?
```

## Extracting from homework

### Strategy

Homework variants frequently appear on exams, so:

1. **Categorize**: Group by topic ("Ch 3 - Hypothesis Testing")
2. **Identify problem types**:
   - Ch 3 - One-sample t-test
   - Ch 3 - Two-sample t-test
   - Ch 3 - Paired t-test
3. **Keep only the solution skeleton for each type**:
   ```
   Example: Paired t-test
   Steps:
   1. d_i = x_i - y_i
   2. d̄ = Σd_i/n, s_d = √Σ(d_i-d̄)²/(n-1)
   3. t = d̄/(s_d/√n), df = n-1
   4. Reject H_0 if |t| > t_{α/2,n-1}
   ```

### Problems the user doesn't understand

**User says**: "I don't get this one" → **Claude does**:
1. Ask the user for the problem
2. Provide a detailed solution
3. **Only put the "template" in the cheatsheet**; the user digests the full solution themselves

## Extracting from notes

### User's notes are usually already structured

- Use their chapter organization
- But **heavily compress the text** (their notes were written for themselves; the cheatsheet is for a self 30 seconds from now)

### Signals of "high weight" content

- Things they starred, circled, exclamation-marked
- Repeatedly appearing concepts
- Their own notations like "important" / "will test"

## Interactive extraction workflow

After the user uploads materials, Claude's workflow:

### Step 1: Quick skim, give user a volume estimate

```
"I read through your PPTs (78 slides) and 3 homework sets. Estimated content:
- Descriptive stats: ~15 core formulas
- Hypothesis testing: ~6 tests + 3 common pitfalls
- Regression: ~8 formulas + 2 comparison tables
- Example skeletons: ~12

This is tight on single-sided A4 3-column. Options:
(A) Keep only PPT-highlighted cores + homework templates → fits single-sided
(B) Full organization → recommend double-sided
Which do you prefer?"
```

### Step 2: After user chooses, provide chapter outline

```
"Draft outline:
[Ch1 Descriptive] Mean/variance/quantile formulas
[Ch2 Distributions] Normal/t/chi-square/F comparison
[Ch3 Hypothesis Testing] 6-test comparison + decision flow
[Ch4 Regression] OLS formula + diagnostics + example templates

Ok to proceed? If you want to add/remove chapters, tell me."
```

### Step 3: After generation, have user review

Generate docx + PDF preview. Have user check:
- Any empty spots that need more content?
- Any crowded spots that need cutting?

## Content quality checklist

Before generating, self-audit:
- [ ] Are all **variables defined clearly** for each formula? (on exam day you might forget the symbols)
- [ ] Are **applicability conditions** written for each method? (knowing the formula but not when to use it = wasted space)
- [ ] Are comparison items (e.g., multiple distributions) in tables?
- [ ] Is there a **key-step skeleton** preserved (not just formulas without workflow)?
