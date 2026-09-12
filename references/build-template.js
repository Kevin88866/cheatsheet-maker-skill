const docx = require('docx'); // or the absolute path of a global install
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle,
  ShadingType, AlignmentType, SectionType, ImageRun, VerticalAlign, TabStopType, TableLayoutType } = docx;

// ---------- tunables ----------
const BODY = Number(process.env.BODY || 16);   // half-points: 16 = 8pt
const CODE = BODY - 1;
const LINE = Number(process.env.LINE || 240);
const TBL = BODY - 1;
const H1 = BODY + 5;
const H2 = BODY + 2;
const CN = '等线';          // Chinese body font
const LAT = 'Calibri';      // Latin body font
const HEAD = 'Microsoft YaHei';
const MONO = 'Consolas';
const COLW = 8.7;           // cm, usable column width (approx)

const COLORS = {
  1: '333F50', 2: '1F4E79', 3: '375623', 4: '7B2C00', 5: '4A235A', 6: '0B5345', 7: '7D1B1B', 8: '1F4E79',
};
let curColor = '1F4E79';

// ---------- run markup: **bold**, `code`, __underline-like key__ ----------
function runs(text, opts = {}) {
  const out = [];
  const size = opts.size || BODY;
  const re = /(\*\*[^*]+\*\*|`[^`]+`|!![^!]+!!)/g;
  let last = 0, m;
  const push = (t, extra) => {
    if (!t) return;
    out.push(new TextRun({
      text: t, size, font: { ascii: LAT, hAnsi: LAT, eastAsia: CN, cs: LAT },
      color: opts.color, bold: opts.bold, ...extra,
    }));
  };
  while ((m = re.exec(text)) !== null) {
    push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith('`')) out.push(new TextRun({ text: tok.slice(1, -1), size: size - 1, font: { ascii: MONO, hAnsi: MONO, eastAsia: MONO, cs: MONO }, color: '1F3864', bold: opts.bold }));
    else if (tok.startsWith('!!')) push(tok.slice(2, -2), { bold: true, color: 'C00000' });
    last = m.index + tok.length;
  }
  push(text.slice(last));
  return out;
}

// ---------- block helpers ----------
function h1(num, text) {
  curColor = COLORS[num] || '1F4E79';
  return new Paragraph({
    spacing: { before: 90, after: 40 }, keepNext: true,
    shading: { type: ShadingType.CLEAR, fill: curColor, color: 'auto' },
    indent: { left: 60 },
    children: [new TextRun({ text: `${num}  ${text}`, bold: true, size: H1, color: 'FFFFFF', font: { ascii: HEAD, hAnsi: HEAD, eastAsia: HEAD } })],
  });
}
function h2(text) {
  return new Paragraph({
    spacing: { before: 70, after: 20 }, keepNext: true,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: curColor, space: 1 } },
    children: [new TextRun({ text, bold: true, size: H2, color: curColor, font: { ascii: HEAD, hAnsi: HEAD, eastAsia: HEAD } })],
  });
}
function p(text, opts = {}) {
  return new Paragraph({ spacing: { after: 20, line: LINE }, children: runs(text, opts) });
}
function b(text) { // bullet with hanging indent
  return new Paragraph({
    spacing: { after: 14, line: LINE }, indent: { left: 170, hanging: 170 },
    children: [new TextRun({ text: '•\t', size: BODY, font: { ascii: LAT, hAnsi: LAT, eastAsia: CN } }), ...runs(text)],
    tabStops: [{ type: TabStopType.LEFT, position: 170 }],
  });
}
function warn(text) { // exam trap / key point
  return new Paragraph({
    spacing: { after: 20, line: LINE }, indent: { left: 170, hanging: 170 },
    shading: { type: ShadingType.CLEAR, fill: 'FFF2CC', color: 'auto' },
    children: [new TextRun({ text: '⚠\t', size: BODY, color: 'C00000', bold: true, font: { ascii: 'Segoe UI Symbol', hAnsi: 'Segoe UI Symbol', eastAsia: CN } }), ...runs(text)],
    tabStops: [{ type: TabStopType.LEFT, position: 170 }],
  });
}
function code(lines) {
  return lines.map((l, i) => new Paragraph({
    spacing: { after: i === lines.length - 1 ? 30 : 0, line: 220 },
    shading: { type: ShadingType.CLEAR, fill: 'F2F2F2', color: 'auto' }, indent: { left: 60 },
    children: [new TextRun({ text: l, size: CODE, font: { ascii: MONO, hAnsi: MONO, eastAsia: MONO, cs: MONO } })],
  }));
}
function formula(text) {
  return new Paragraph({
    spacing: { after: 20, line: LINE }, indent: { left: 120 },
    children: runs(text, { size: BODY + 1, bold: false }),
  });
}
const thin = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
const borders = { top: thin, bottom: thin, left: thin, right: thin };
function cell(text, opts = {}) {
  const paras = String(text).split('\n').map(t => new Paragraph({
    spacing: { after: 0, line: 220 }, keepNext: true, keepLines: true, alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    children: opts.mono
      ? [new TextRun({ text: t, size: TBL - 1, font: { ascii: MONO, hAnsi: MONO, eastAsia: MONO }, bold: opts.bold, color: opts.color })]
      : runs(t, { size: TBL, bold: opts.bold, color: opts.color }),
  }));
  return new TableCell({
    children: paras, borders, verticalAlign: VerticalAlign.CENTER,
    margins: { top: 8, bottom: 8, left: 25, right: 25 },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill, color: 'auto' } : undefined,
    width: opts.w ? { size: opts.w, type: WidthType.DXA } : undefined,
  });
}
// widths in cm; monoCols: set of column indexes rendered monospace
function table(headers, rows, widthsCm, opts = {}) {
  const dxa = widthsCm.map(w => Math.round(w * 567));
  const mono = new Set(opts.mono || []);
  const hdr = new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, { bold: true, fill: curColor, color: 'FFFFFF', w: dxa[i], center: true })) });
  const body = rows.map((r, ri) => new TableRow({
    cantSplit: true,
    children: r.map((c, i) => cell(c, { w: dxa[i], mono: mono.has(i), fill: opts.zebra && ri % 2 ? 'F7F7F7' : undefined, center: opts.center && opts.center.includes(i) })),
  }));
  return [new Table({ rows: [hdr, ...body], width: { size: dxa.reduce((a, c) => a + c, 0), type: WidthType.DXA }, columnWidths: dxa, layout: TableLayoutType.FIXED }),
    new Paragraph({ spacing: { after: 30 }, children: [] })];
}
function img(path, widthCm, heightCm) {
  return new Paragraph({
    alignment: AlignmentType.CENTER, spacing: { after: 30 },
    children: [new ImageRun({ type: 'png', data: fs.readFileSync(path), transformation: { width: widthCm * 37.8, height: heightCm * 37.8 } })],
  });
}
const gap = () => new Paragraph({ spacing: { after: 0 }, children: [] });

// =====================================================================
//                              CONTENT
// =====================================================================
// Helpers available:
//   h1(n, text)            chapter bar (colour n from COLORS)
//   h2(text)               sub-heading with rule
//   b(text)                bullet; inline **bold** and `code`
//   warn(text)             ⚠ exam-trap line (yellow fill)
//   code([lines])          monospace block
//   formula(text)          slightly larger line for a formula
//   table(headers, rows, widthsCm, { mono:[i], center:[i], zebra })
//   img(path, wCm, hCm)    inline figure
// Replace everything below with the real content.
const TITLE = [];
const C = [];
const add = (...x) => x.forEach(i => Array.isArray(i) ? C.push(...i) : C.push(i));

TITLE.push(new Paragraph({
  spacing: { after: 40 },
  children: [
    new TextRun({ text: 'COURSE CODE Course Name  ·  Cheatsheet', bold: true, size: 26, font: { ascii: HEAD, hAnsi: HEAD, eastAsia: HEAD }, color: '1F4E79' }),
    new TextRun({ text: '   Ch.1 …  ·  Ch.2 …', size: BODY, font: { ascii: LAT, hAnsi: LAT, eastAsia: CN }, color: '595959' }),
  ],
}));

add(h1(1, '总览：整门课的地图'));
add(b('课件里分散在几章的同一个概念，在这里合成一张表。'));
add(table(['层 / 阶段', '是什么', '产物', '章节'], [
  ['…', '…', '…', 'Ch1'],
], [2.0, 3.2, 2.3, 1.0], { zebra: true }));

add(h1(2, '第一个主题'));
add(h2('公式'));
add(formula('**CPU Time = IC × CPI × T_c**'));
add(b('**关键术语**：一句话定义。'));
add(warn('考试陷阱：写在这里。'));
add(code(['always @(posedge CLK) Z <= X | Y;']));

// =====================================================================
const page = { size: { width: 11906, height: 16838, orientation: docx.PageOrientation.LANDSCAPE }, margin: { top: 560, bottom: 560, left: 560, right: 560 } };
const doc = new Document({
  styles: { default: { document: { run: { font: { ascii: LAT, hAnsi: LAT, eastAsia: CN }, size: BODY } } } },
  sections: [
    { properties: { page, column: { count: 1 } }, children: TITLE },
    { properties: { type: SectionType.CONTINUOUS, page, column: { count: 3, space: 340, separate: true } }, children: C },
    { properties: { type: SectionType.CONTINUOUS, page, column: { count: 1 } }, children:[
      h1(8, '附图：全幅大图（可选，没有就删掉这一段 section）'),
      img('cheatsheet_assets/figure.png', Number(process.env.IMGW || 17), Number(process.env.IMGW || 17) * 0.57 /* height/width ratio of the PNG */),
    ] },
  ],
});
Packer.toBuffer(doc).then(buf => { fs.writeFileSync(process.env.OUT || 'cheatsheet.docx', buf); console.log('ok'); });
