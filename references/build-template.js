// Cheatsheet build template — A4 landscape, 3 columns, docx-js v9.
// Copy next to the output, fill in the CONTENT section, then:
//   node build.js                       (Latin body, auto line spacing)
//   CJK=1 node build.js                 (Chinese body: DengXian + exact spacing + half-width punctuation)
// Tunables via env: BODY (half-points, >= 16), LINE, CELL_LINE, MARGIN (cm), GAP (cm), SPLIT_ROWS, KEEP, OUT
// Export: powershell -ExecutionPolicy Bypass -File topdf.ps1 <docx> <pdf>   (see layout-spec.md)
// Check:  python measure.py <pdf> [png_dir]
const path = require('path');
const fs = require('fs');
// Resolve the global docx install if a local one is missing (Windows default path shown).
const GLOBAL = process.env.DOCX_DIR || path.join(process.env.APPDATA || '', 'npm', 'node_modules', 'docx');
const docx = (() => { try { return require('docx'); } catch (e) { return require(GLOBAL); } })();
const JSZip = (() => { try { return require('jszip'); } catch (e) { return require(path.join(GLOBAL, 'node_modules', 'jszip')); } })();
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  AlignmentType, VerticalAlign, TabStopType, TableLayoutType, PageOrientation, LineRuleType, ImageRun } = docx;

// ---------- tunables ----------
const CJK = process.env.CJK === '1';
const BODY = Number(process.env.BODY || 16);              // half-points; 16 = 8pt is the floor
// Word gives CJK fonts ~1.3x leading under "auto" spacing, so CJK mode uses exact spacing (twips).
const LINE = Number(process.env.LINE || (CJK ? 192 : 230));
const CELL_LINE = Number(process.env.CELL_LINE || (CJK ? 180 : 204));
const LINE_RULE = CJK ? LineRuleType.EXACT : LineRuleType.AUTO;
const MARGIN_CM = Number(process.env.MARGIN || 0.7);
const GAP_CM = Number(process.env.GAP || 0.4);
const AFTER = Number(process.env.AFTER || 6);
const SPLIT_ROWS = Number(process.env.SPLIT_ROWS || 4);   // tables with more body rows may break across columns
const KEEP = process.env.KEEP === '1';                    // KEEP=1: never split a bullet across columns (costs space)
const TBL = BODY - 1, CODE = BODY - 1, H1 = BODY + 4, H2 = BODY + 2;
const LAT = 'Calibri', CN = '等线', MONO = 'Consolas';
const HEAD = CJK ? 'Microsoft YaHei' : 'Segoe UI';
const cm = x => Math.round(x * 567);
const COLW_CM = (29.7 - 2 * MARGIN_CM - 2 * GAP_CM) / 3;
const TABLE_W_CM = COLW_CM - 0.12;

const COLORS = { 1: '333F50', 2: '375623', 3: '4A235A', 4: '7B2C00', 5: '0B5345', 6: '7D1B1B', 7: '1F4E79', 8: '5B3A00' };
let curColor = COLORS[1];
const fLat = { ascii: LAT, hAnsi: LAT, cs: LAT, eastAsia: CN };
const fMono = { ascii: MONO, hAnsi: MONO, cs: MONO, eastAsia: CN };
const fHead = { ascii: HEAD, hAnsi: HEAD, cs: HEAD, eastAsia: CJK ? HEAD : CN };
const fMath = { ascii: 'Cambria Math', hAnsi: 'Cambria Math', cs: 'Cambria Math', eastAsia: 'Cambria Math' };
const lineSp = (after, line) => ({ after, line, lineRule: LINE_RULE });

// ---------- inline markup: **bold**  !!red bold!!  `code`  _{sub}  ^{sup} ----------
// Half-width punctuation in mixed Chinese/English text: Word does not compress full-width marks.
function hwPunct(t) {
  if (!CJK || !/[（），；：]/.test(t)) return t;
  const lead = /^\s/.test(t), trail = /\s$/.test(t);
  let r = t.replace(/（/g, ' (').replace(/）/g, ') ').replace(/，/g, ', ').replace(/；/g, '; ').replace(/：/g, ': ');
  r = r.replace(/ {2,}/g, ' ').replace(/ ([,;:)。、])/g, '$1').replace(/\( /g, '(');
  if (!lead) r = r.replace(/^ /, '');
  if (!trail) r = r.replace(/ $/, '');
  return r;
}
function runs(text, o = {}) {
  text = hwPunct(text);
  const size = o.size || BODY;
  const font = o.font || fLat;
  const out = [];
  const re = /(\*\*.+?\*\*|!!.+?!!|`[^`]+`|_\{[^}]*\}|\^\{[^}]*\})/g;
  let last = 0, m;
  const plain = t => {   // symbols Calibri draws poorly go to Cambria Math
    if (!t) return;
    for (const seg of t.split(/([√⊕⌈⌉])/)) {
      if (!seg) continue;
      out.push(new TextRun({ text: seg, size, bold: o.bold, color: o.color, subScript: o.sub, superScript: o.sup,
        font: /^[√⊕⌈⌉]$/.test(seg) ? fMath : font }));
    }
  };
  while ((m = re.exec(text)) !== null) {
    plain(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith('**')) out.push(...runs(t.slice(2, -2), { ...o, bold: true }));
    else if (t.startsWith('!!')) out.push(...runs(t.slice(2, -2), { ...o, bold: true, color: 'C00000' }));
    else if (t.startsWith('`')) out.push(new TextRun({ text: t.slice(1, -1), size: size - 1, font: fMono, color: '1F3864', bold: o.bold }));
    else if (t.startsWith('_{')) out.push(...runs(t.slice(2, -1), { ...o, sub: true }));
    else if (t.startsWith('^{')) out.push(...runs(t.slice(2, -1), { ...o, sup: true }));
    last = m.index + t.length;
  }
  plain(text.slice(last));
  return out;
}

// ---------- block helpers ----------
function h1(num, text) {
  curColor = COLORS[num] || COLORS[7];
  return new Paragraph({
    spacing: { before: 60, after: 24 }, keepNext: true, indent: { left: 40 },
    shading: { type: ShadingType.CLEAR, fill: curColor, color: 'auto' },
    children: runs(`${num}  ${text}`, { bold: true, size: H1, color: 'FFFFFF', font: fHead }),
  });
}
function h2(text) {
  return new Paragraph({
    spacing: { before: 40, after: 12 }, keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: curColor, space: 1 } },
    children: runs(text, { bold: true, size: H2, color: curColor, font: fHead }),
  });
}
function p(text) { return new Paragraph({ spacing: lineSp(AFTER, LINE), keepLines: KEEP, children: runs(text) }); }
// keep=true: never split this bullet (use for the one that lands on the front/back page break)
function b(text, level = 0, keep = KEEP) {
  const ind = 150 + level * 150;
  return new Paragraph({
    spacing: lineSp(AFTER, LINE), indent: { left: ind, hanging: 150 }, keepLines: keep,
    tabStops: [{ type: TabStopType.LEFT, position: ind }],
    children: [new TextRun({ text: (level ? '–' : '•') + '\t', size: BODY, font: fLat, color: curColor }), ...runs(text)],
  });
}
function warn(text) {
  return new Paragraph({
    spacing: lineSp(AFTER + 4, LINE), indent: { left: 150, hanging: 150 }, keepLines: KEEP,
    tabStops: [{ type: TabStopType.LEFT, position: 150 }],
    shading: { type: ShadingType.CLEAR, fill: 'FFF2CC', color: 'auto' },
    children: [new TextRun({ text: '⚠\t', size: BODY, color: 'C00000', bold: true,
      font: { ascii: 'Segoe UI Symbol', hAnsi: 'Segoe UI Symbol', cs: 'Segoe UI Symbol', eastAsia: 'Segoe UI Symbol' } }), ...runs(text)],
  });
}
function formula(text) { return new Paragraph({ spacing: lineSp(AFTER, LINE), indent: { left: 150 }, keepLines: KEEP, children: runs(text) }); }
function code(lines) {
  return lines.map((l, i) => new Paragraph({
    spacing: { after: i === lines.length - 1 ? 30 : 0, line: 220 }, indent: { left: 40 },
    shading: { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' },
    children: [new TextRun({ text: l, size: CODE, font: fMono })],
  }));
}
const thin = { style: BorderStyle.SINGLE, size: 4, color: 'A6A6A6' };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
function cell(text, o = {}) {
  const paras = String(text).split('\n').map(t => new Paragraph({
    spacing: lineSp(0, CELL_LINE), keepNext: o.keep !== false, keepLines: true,
    alignment: o.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: o.mono ? [new TextRun({ text: t, size: TBL - 1, font: fMono, bold: o.bold, color: o.color })]
      : runs(t, { size: TBL, bold: o.bold, color: o.color }),
  }));
  return new TableCell({
    children: paras, borders, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 4, bottom: 4, left: 28, right: 28 },
    shading: o.fill ? { type: ShadingType.CLEAR, fill: o.fill, color: 'auto' } : undefined,
    width: o.w ? { size: o.w, type: WidthType.DXA } : undefined,
  });
}
// headers: array or null; weights are relative and scaled to the column width.
// opts: { mono:[i], center:[i], zebra, firstBold (default true) }
// Tables longer than SPLIT_ROWS rows may break between rows (header repeats) instead of jumping a whole column.
function table(headers, rows, weights, o = {}) {
  const tot = weights.reduce((a, c) => a + c, 0);
  const dxa = weights.map(w => cm(TABLE_W_CM * w / tot));
  const mono = new Set(o.mono || []), center = new Set(o.center || []);
  const firstBold = o.firstBold !== false;
  const splittable = rows.length > SPLIT_ROWS;
  const trs = [];
  if (headers) trs.push(new TableRow({ tableHeader: true, cantSplit: true,
    children: headers.map((h, i) => cell(h, { bold: true, fill: curColor, color: 'FFFFFF', w: dxa[i], center: true })) }));
  rows.forEach((r, ri) => trs.push(new TableRow({ cantSplit: true,
    children: r.map((c, i) => cell(firstBold && i === 0 && !String(c).includes('**') && !mono.has(0) ? `**${c}**` : c,
      { w: dxa[i], mono: mono.has(i), center: center.has(i), fill: o.zebra && ri % 2 ? 'F4F4F4' : undefined, keep: !splittable || ri < 1 })) })));
  return [new Table({ rows: trs, width: { size: dxa.reduce((a, c) => a + c, 0), type: WidthType.DXA }, columnWidths: dxa, layout: TableLayoutType.FIXED }),
    new Paragraph({ spacing: { after: 24, line: 120 }, children: [] })];
}
function img(file, widthCm, heightCm) {
  return new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 30 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(file), transformation: { width: widthCm * 37.8, height: heightCm * 37.8 } })] });
}

// =====================================================================
//                              CONTENT
// =====================================================================
// Every bullet must be readable without the slides: define symbols, restate example setups, give the reason.
const C = [];
const add = (...x) => x.forEach(i => Array.isArray(i) ? C.push(...i) : C.push(i));

C.push(new Paragraph({ spacing: { after: 30 }, children: [
  new TextRun({ text: 'COURSE Test 1 Cheatsheet', bold: true, size: BODY + 8, font: fHead, color: '1F4E79' }),
  new TextRun({ text: '  Topic A · Topic B · Topic C', size: BODY, font: fLat, color: '595959' }),
] }));

add(h1(1, 'Map: every model / chapter side by side'));
add(table(['Model', 'Decision boundary', 'Overfits when → fix'], [
  ['Decision tree', 'axis-parallel rectangles (nonlinear)', 'tree too deep → limit depth, prune'],
], [1.6, 2.4, 2.9], { zebra: true }));

add(h1(2, 'First topic'));
add(h2('Key formula'));
add(formula('**IG = H(parent) − Σ (|S_{v}| ÷ |S|) × H(S_{v})**'));
add(b('**Term**: one complete sentence that says what it is and why it matters.'));
add(warn('Exam trap written as a full sentence.'));

// =====================================================================
const page = { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE },
  margin: { top: cm(MARGIN_CM), bottom: cm(MARGIN_CM), left: cm(MARGIN_CM), right: cm(MARGIN_CM) } };
const doc = new Document({
  styles: { default: { document: { run: { font: fLat, size: BODY } } } },
  sections: [{ properties: { page, column: { count: 3, space: cm(GAP_CM), separate: true } }, children: C }],
  // Optional full-width figure: add a second section with type SectionType.CONTINUOUS, column count 1, children [img(...)]
});
const OUT = process.env.OUT || path.join(__dirname, 'cheatsheet.docx');
Packer.toBuffer(doc)
  .then(buf => JSZip.loadAsync(buf))
  .then(async zip => {
    if (CJK) {   // tag East Asian language; turn off Word's extra CJK/Latin auto-spacing (spaces are typed explicitly)
      let styles = await zip.file('word/styles.xml').async('string');
      styles = styles.replace(/<w:szCs w:val="\d+"\/><\/w:rPr><\/w:rPrDefault>/,
        m => m.replace('</w:rPr>', '<w:lang w:val="en-US" w:eastAsia="zh-CN" w:bidi="ar-SA"/></w:rPr>'));
      styles = styles.replace('<w:pPrDefault/>', '<w:pPrDefault><w:pPr><w:autoSpaceDE w:val="0"/><w:autoSpaceDN w:val="0"/></w:pPr></w:pPrDefault>');
      zip.file('word/styles.xml', styles);
    }
    return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  })
  .then(buf => { fs.writeFileSync(OUT, buf); console.log('ok', OUT, 'column width cm', COLW_CM.toFixed(2)); });
