// Shared drawing helpers. All coordinates are in px on a 1920x1080 canvas
// (13.333in x 7.5in slide => 144 px per inch, 1pt = 2px).
const React = require('react');
const RDS = require('react-dom/server');
const lu = require('react-icons/lu');
const sharp = require('sharp');

const P = (v) => +(v / 144).toFixed(4);

const C = {
  NAVY: '1A212B', INK: '1F2933', TEAL: '0E7490', SKY: '38BDF8', SILVER: 'AEB6C2',
  LG: 'EEF0F3', RED: 'E5484D', GREEN: '2EA043', WHITE: 'FFFFFF',
  SLATE: '5B6675', LINE: 'D5DAE1', REDT: 'FDEDEE', GREENT: 'EAF6EC', TEALT: 'E3F0F4',
  TERMTXT: 'C9D1DB', NAVY2: '2A3441',
};
const F = { R: 'Barlow', SB: 'Barlow SemiBold', M: 'Barlow Medium', MONO: 'JetBrains Mono' };

const iconCache = new Map();
async function icon(name, color) {
  const key = name + color;
  if (iconCache.has(key)) return iconCache.get(key);
  const Comp = lu['Lu' + name];
  if (!Comp) throw new Error('missing icon ' + name);
  let svg = RDS.renderToStaticMarkup(React.createElement(Comp, { size: 256, color: '#' + color }));
  svg = svg.replace(/currentColor/g, '#' + color);
  if (!svg.includes('xmlns=')) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  const buf = await sharp(Buffer.from(svg), { density: 300 }).resize(256, 256).png().toBuffer();
  const data = 'image/png;base64,' + buf.toString('base64');
  iconCache.set(key, data);
  return data;
}

function make(pres) {
  const S = pres.shapes;
  const h = {};

  h.box = (s, x, y, w, ht, o = {}) => {
    s.addShape(o.r ? S.ROUNDED_RECTANGLE : S.RECTANGLE, {
      x: P(x), y: P(y), w: P(w), h: P(ht),
      fill: o.fill ? { color: o.fill, transparency: o.ft || 0 } : { type: 'none' },
      line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { type: 'none' },
      rectRadius: o.r ? P(o.r) : undefined,
    });
  };
  h.circle = (s, cx, cy, d, o = {}) => {
    s.addShape(S.OVAL, {
      x: P(cx - d / 2), y: P(cy - d / 2), w: P(d), h: P(d),
      fill: o.fill ? { color: o.fill } : { type: 'none' },
      line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { type: 'none' },
    });
  };
  h.t = (s, text, x, y, w, ht, o = {}) => {
    s.addText(text, {
      x: P(x), y: P(y), w: P(w), h: P(ht), margin: 0, isTextBox: true,
      fontFace: o.font || F.R, fontSize: o.size || 20, color: o.color || C.INK,
      bold: !!o.bold, italic: !!o.italic, align: o.align || 'left', valign: o.valign || 'top',
      charSpacing: o.cs, lineSpacingMultiple: o.lsm, lineSpacing: o.ls, paraSpaceAfter: o.psa,
      fit: 'none', wrap: true,
    });
  };
  // straight line; arrow heads follow the logical direction (x1,y1)->(x2,y2)
  h.ln = (s, x1, y1, x2, y2, o = {}) => {
    s.addShape(S.LINE, {
      x: P(Math.min(x1, x2)), y: P(Math.min(y1, y2)),
      w: P(Math.max(Math.abs(x2 - x1), 0.01)), h: P(Math.max(Math.abs(y2 - y1), 0.01)),
      flipH: x2 < x1, flipV: y2 < y1,
      line: { color: o.color || C.TEAL, width: o.w || 2, dashType: o.dash || 'solid',
        beginArrowType: o.begin, endArrowType: o.end },
    });
  };
  h.img = async (s, name, color, x, y, size) => {
    s.addImage({ data: await icon(name, color), x: P(x), y: P(y), w: P(size), h: P(size) });
  };
  // icon inside a filled circle
  h.ic = async (s, name, cx, cy, d, o = {}) => {
    if (o.bg !== null) h.circle(s, cx, cy, d, { fill: o.bg || C.NAVY, line: o.ring, lw: o.ringW });
    const k = o.k || 0.5;
    await h.img(s, name, o.fg || C.WHITE, cx - (d * k) / 2, cy - (d * k) / 2, d * k);
  };
  // numbered badge
  h.badge = (s, n, cx, cy, d = 40, o = {}) => {
    h.circle(s, cx, cy, d, { fill: o.fill || C.TEAL });
    h.t(s, String(n), cx - d / 2, cy - d / 2, d, d, { size: o.size || Math.round(d * 0.21), bold: true, color: o.color || C.WHITE, align: 'center', valign: 'middle' });
  };
  // lesson chip like ">01"
  h.chip = (s, text, x, y, o = {}) => {
    const w = o.w || 66, ht = o.h || 30;
    h.box(s, x, y, w, ht, { fill: o.fill || C.TEAL, r: 6 });
    h.t(s, text, x, y, w, ht, { font: F.MONO, size: o.size || 13, bold: true, color: o.color || C.WHITE, align: 'center', valign: 'middle' });
  };

  // Terminal window: lines = [{p:'$ ', c:'cmd'} | {o:'output'} | {o:[{t,c,b}]}]
  h.term = (s, x, y, w, lines, o = {}) => {
    const size = o.size || 18;
    const lh = Math.round(size * 2 * 1.45);
    const head = 46, pad = 26;
    const ht = head + pad * 2 + lines.length * lh - Math.round(lh * 0.2);
    h.box(s, x, y, w, ht, { fill: C.NAVY, r: 14 });
    [C.WHITE, C.SILVER, C.SLATE].forEach((col, i) => h.circle(s, x + 28 + i * 24, y + 24, 13, { fill: col }));
    if (o.title) h.t(s, o.title, x + 110, y + 10, w - 220, 28, { font: F.MONO, size: 12, color: C.SILVER, align: 'center', valign: 'middle' });
    h.ln(s, x, y + head, x + w, y + head, { color: C.NAVY2, w: 1 });
    const runs = [];
    lines.forEach((l, i) => {
      const last = i === lines.length - 1;
      const push = (text, opt) => runs.push({ text, options: Object.assign({ fontFace: F.MONO, fontSize: size }, opt) });
      if (l.p !== undefined) {
        push(l.p, { color: C.SKY, bold: true });
        push(l.c, { color: C.WHITE, breakLine: !last });
      } else if (Array.isArray(l.o)) {
        l.o.forEach((seg, j) => push(seg.t, { color: seg.c || C.TERMTXT, bold: !!seg.b, breakLine: !last && j === l.o.length - 1 }));
      } else {
        push(l.o, { color: l.color || C.TERMTXT, breakLine: !last });
      }
    });
    s.addText(runs, { x: P(x + 30), y: P(y + head + pad - 6), w: P(w - 60), h: P(lines.length * lh), margin: 0, valign: 'top', lineSpacing: lh / 2, isTextBox: true, fit: 'none' });
    return ht;
  };

  // Generic manual table. cols: widths; cells: string | {t, color, bold, font, icon, iconColor, align, fill}
  h.table = async (s, x, y, cols, rowH, header, rows, o = {}) => {
    const W = cols.reduce((a, b) => a + b, 0);
    const hh = o.headH || 64;
    h.box(s, x, y, W, hh, { fill: C.NAVY });
    let cx = x;
    header.forEach((hd, i) => {
      h.t(s, hd, cx + 24, y, cols[i] - 36, hh, { font: F.SB, size: o.headSize || 17, color: C.WHITE, valign: 'middle', align: (o.headAlign && o.headAlign[i]) || 'left', cs: 1 });
      cx += cols[i];
    });
    for (let r = 0; r < rows.length; r++) {
      const ry = y + hh + r * rowH;
      const fill = (!Array.isArray(rows[r]) && rows[r].fill) || (r % 2 === 1 ? C.LG : C.WHITE);
      h.box(s, x, ry, W, rowH, { fill });
      let cx2 = x;
      const cells = rows[r].cells || rows[r];
      for (let i = 0; i < cells.length; i++) {
        let cell = cells[i];
        if (typeof cell === 'string') cell = { t: cell };
        let tx = cx2 + 24;
        if (cell.icon && !cell.t) {
          const sz = cell.size || 30;
          await h.img(s, cell.icon, cell.iconColor || C.INK, cx2 + (cols[i] - sz) / 2, ry + (rowH - sz) / 2, sz);
        } else {
          if (cell.icon) {
            const sz = cell.size || 30;
            await h.img(s, cell.icon, cell.iconColor || C.TEAL, tx, ry + (rowH - sz) / 2, sz);
            tx += sz + 16;
          }
          if (cell.dot) {
            h.circle(s, tx + 7, ry + rowH / 2, 14, { fill: cell.dot });
            tx += 26;
          }
          h.t(s, cell.t, tx, ry, cx2 + cols[i] - tx - 12, rowH, {
            font: cell.font || F.R, size: cell.size2 || o.size || 19, bold: !!cell.bold,
            color: cell.color || C.INK, valign: 'middle', align: cell.align || 'left',
          });
        }
        cx2 += cols[i];
      }
    }
    h.box(s, x, y, W, hh + rows.length * rowH, { line: C.LINE, lw: 1 });
    return hh + rows.length * rowH;
  };

  // ---------- VirtualBox-style mock-up widgets ----------
  h.win = (s, x, y, w, ht, title, o = {}) => {
    h.box(s, x, y, w, ht, { fill: C.WHITE, line: C.LINE, lw: 1.5, r: 14 });
    h.box(s, x, y, w, 54, { fill: o.bar || C.NAVY, r: 14 });
    h.box(s, x, y + 30, w, 24, { fill: o.bar || C.NAVY });
    h.t(s, title, x + 26, y, w - 52, 54, { font: F.SB, size: 15, color: C.WHITE, valign: 'middle' });
  };
  h.label = (s, text, x, y, w, o = {}) => h.t(s, text, x, y, w, o.h || 44, { size: o.size || 16, color: o.color || C.INK, valign: 'middle', font: o.font || F.R, bold: o.bold, align: o.align });
  h.dropdown = async (s, x, y, w, text, o = {}) => {
    h.box(s, x, y, w, 44, { fill: o.fill || C.WHITE, line: o.hl ? (o.hlColor || C.TEAL) : 'B8C0CB', lw: o.hl ? 2.25 : 1, r: 6 });
    h.t(s, text, x + 14, y, w - 56, 44, { size: o.size || 16, valign: 'middle', font: o.mono ? F.MONO : (o.bold ? F.SB : F.R), color: o.color || C.INK });
    if (!o.noArrow) await h.img(s, 'ChevronDown', C.SLATE, x + w - 36, y + 11, 22);
  };
  h.input = (s, x, y, w, text, o = {}) => {
    h.box(s, x, y, w, 44, { fill: C.WHITE, line: o.hl ? (o.hlColor || C.TEAL) : 'B8C0CB', lw: o.hl ? 2.25 : 1, r: 6 });
    h.t(s, text, x + 14, y, w - 28, 44, { size: o.size || 16, valign: 'middle', font: o.mono ? F.MONO : F.R, color: o.color || C.INK });
  };
  h.check = async (s, x, y, checked, text, o = {}) => {
    h.box(s, x, y + 9, 26, 26, { fill: checked ? C.TEAL : C.WHITE, line: checked ? C.TEAL : '8C96A3', lw: 1.25, r: 4 });
    if (checked) await h.img(s, 'Check', C.WHITE, x + 3, y + 12, 20);
    if (text) h.t(s, text, x + 40, y, o.w || 400, 44, { size: o.size || 16, valign: 'middle', color: o.color || C.INK });
  };
  h.radio = (s, x, y, on, text, o = {}) => {
    h.circle(s, x + 13, y + 22, 24, { fill: C.WHITE, line: on ? C.TEAL : '8C96A3', lw: on ? 2 : 1.25 });
    if (on) h.circle(s, x + 13, y + 22, 12, { fill: C.TEAL });
    h.t(s, text, x + 40, y, o.w || 500, 44, { size: o.size || 16, valign: 'middle', color: o.color || C.INK, font: on ? F.M : F.R });
  };

  return h;
}

module.exports = { P, C, F, icon, make };
