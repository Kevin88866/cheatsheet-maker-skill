"""Page count and per-column fill of an exported 3-column cheatsheet PDF.

Usage: python measure.py sheet.pdf [png_dir]

A column whose text ends far above the others usually means a heading + table
block could not fit and jumped to the next column: fix that before cutting content.
"""
import sys
import fitz

pdf = sys.argv[1]
outdir = sys.argv[2] if len(sys.argv) > 2 else None
d = fitz.open(pdf)
print('pages', d.page_count)
for i, p in enumerate(d):
    if outdir:
        p.get_pixmap(dpi=100).save(f'{outdir}/pg{i + 1}.png')
    W = p.rect.width
    cols = [0, 0, 0]
    for b in p.get_text('blocks'):
        c = min(2, int(b[0] // (W / 3)))
        cols[c] = max(cols[c], b[3])
    print(i + 1, 'column text ends at', [round(c) for c in cols], 'of', round(p.rect.height), 'pt')
