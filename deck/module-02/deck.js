// PEHT Module 02 deck generator: node deck.js -> PEHT_Module02_Building_the_Practice_Lab.pptx
const pptxgen = require('pptxgenjs');
const { P, C, F, make } = require('./lib');

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 in => 1920 x 1080 at 144 ppi
pres.author = 'Mo’tasem Abu Baha’';
pres.company = 'Cybera4U';
pres.title = 'PEHT Module 02: Building the Practice Lab';
pres.theme = { headFontFace: F.R, bodyFontFace: F.R };
const h = make(pres);

const CHIP = { image: { path: 'assets/chip.png', x: P(1640), y: P(994), w: P(184), h: P(54) } };
pres.defineSlideMaster({
  title: 'CONTENT', background: { color: C.WHITE }, objects: [CHIP],
  slideNumber: { x: P(96), y: P(1004), w: P(120), h: P(40), fontFace: F.SB, fontSize: 13, color: C.SILVER, align: 'left', valign: 'middle', margin: 0 },
});
pres.defineSlideMaster({ title: 'DARK', background: { color: C.NAVY }, objects: [CHIP] });

// ---------- slide factories ----------
function content(tag, title, notes) {
  const s = pres.addSlide({ masterName: 'CONTENT' });
  h.t(s, tag, 96, 64, 1728, 30, { font: F.MONO, size: 14, bold: true, color: C.TEAL, cs: 1 });
  h.t(s, title, 96, 98, 1728, 80, { size: 38, bold: true, color: C.INK });
  if (notes) s.addNotes(notes);
  return s;
}
function dark(bg, notes) {
  const s = pres.addSlide({ masterName: 'DARK' });
  s.background = { path: bg };
  if (notes) s.addNotes(notes);
  return s;
}
function lessonCover(n, title, bg) {
  const s = dark(bg);
  s.addText([
    { text: 'LESSON ', options: { color: C.WHITE } },
    { text: '0' + n, options: { color: C.SKY } },
  ], { x: P(140), y: P(300), w: P(1400), h: P(220), margin: 0, fontFace: F.R, bold: true, fontSize: 120, charSpacing: 4, valign: 'bottom', isTextBox: true });
  h.t(s, title, 146, 548, 1080, 260, { font: F.SB, size: 50, color: C.WHITE, lsm: 1.0 });
  return s;
}
async function labTime(n, title, steps, notes) {
  const s = content(`>0${n}  LAB TIME`, title, notes);
  h.box(s, 96, 228, 500, 712, { fill: C.NAVY, r: 20 });
  h.t(s, '>_', 150, 300, 400, 200, { font: F.MONO, size: 120, bold: true, color: C.SKY });
  h.t(s, 'LAB TIME', 156, 560, 400, 60, { font: F.SB, size: 36, color: C.WHITE, cs: 6 });
  h.t(s, `Lesson 0${n} · hands-on`, 156, 622, 400, 40, { size: 20, color: C.SILVER });
  const x0 = 660, rowH = 142, y0 = 228;
  for (let i = 0; i < steps.length; i++) {
    const y = y0 + i * rowH;
    h.badge(s, i + 1, x0 + 32, y + rowH / 2, 64, { size: 22 });
    h.t(s, steps[i], x0 + 100, y, 1000, rowH, { size: 26, color: C.INK, valign: 'middle', font: F.M });
    h.box(s, 1772, y + rowH / 2 - 22, 44, 44, { line: C.SILVER, lw: 2, r: 6 });
    if (i < steps.length - 1) h.ln(s, x0, y + rowH, 1824, y + rowH, { color: C.LINE, w: 1 });
  }
  return s;
}
async function takeaways(n, title, items, notes) {
  const s = content(`>0${n}  KEY TAKEAWAYS`, title, notes);
  const w = (1728 - 64) / 3;
  for (let i = 0; i < items.length; i++) {
    const x = 96 + i * (w + 32), y = 250;
    h.box(s, x, y, w, 660, { fill: C.LG, r: 20 });
    await h.ic(s, items[i].icon, x + 110, y + 120, 120, { bg: C.NAVY });
    h.t(s, '+0' + (i + 1), x + w - 140, y + 56, 100, 40, { font: F.MONO, size: 20, bold: true, color: C.TEAL, align: 'right' });
    h.t(s, items[i].text, x + 50, y + 250, w - 100, 300, { font: F.SB, size: 32, color: C.INK, lsm: 1.08 });
  }
  return s;
}

// ---------- hero lab diagram (module visual anchor) ----------
async function hero(s, opt = {}) {
  // physical host
  h.box(s, 96, 212, 1396, 746, { fill: C.LG, r: 24 });
  await h.ic(s, 'Laptop', 150, 262, 56, { bg: C.INK });
  h.t(s, 'PHYSICAL HOST', 194, 230, 400, 32, { font: F.SB, size: 15, color: C.INK, cs: 2, valign: 'middle' });
  h.t(s, 'Your laptop or desktop', 194, 262, 400, 30, { size: 14, color: C.SLATE, valign: 'middle' });
  // VirtualBox layer
  h.box(s, 300, 306, 1162, 396, { fill: C.WHITE, line: C.TEAL, lw: 2, r: 18 });
  await h.ic(s, 'Layers', 346, 350, 50, { bg: C.TEAL });
  h.t(s, 'ORACLE VIRTUALBOX 7.x', 386, 320, 420, 32, { font: F.SB, size: 15, color: C.TEAL, cs: 2, valign: 'middle' });
  h.t(s, 'Type 2 hypervisor', 386, 350, 400, 30, { size: 14, color: C.SLATE, valign: 'middle' });

  const ifRow = (x, y, w, nic, ip, mode, dk) => {
    h.t(s, nic, x, y, 80, 50, { font: F.MONO, size: 15, bold: true, color: dk ? C.SKY : C.TEAL, valign: 'middle' });
    h.t(s, ip, x + 84, y, 252, 50, { font: F.MONO, size: 14, color: dk ? C.WHITE : C.INK, valign: 'middle' });
    h.t(s, mode, x + w - 116, y, 116, 50, { size: 15, color: dk ? C.SILVER : C.SLATE, valign: 'middle', align: 'right' });
  };
  // Kali VM
  const kx = 340, ky = 400, kw = 520, kh = 276;
  h.box(s, kx, ky, kw, kh, { fill: C.NAVY, r: 16 });
  await h.ic(s, 'SquareTerminal', kx + 62, ky + 66, 68, { bg: C.TEAL });
  h.t(s, 'Kali Linux', kx + 112, ky + 28, 300, 46, { font: F.SB, size: 23, color: C.WHITE, valign: 'middle' });
  h.t(s, 'ATTACKER VM', kx + 112, ky + 74, 300, 30, { font: F.MONO, size: 13, bold: true, color: C.SKY, cs: 1, valign: 'middle' });
  h.ln(s, kx + 28, ky + 140, kx + kw - 28, ky + 140, { color: C.NAVY2, w: 1 });
  ifRow(kx + 28, ky + 148, kw - 56, 'eth0', '10.0.2.15', 'NAT', true);
  h.ln(s, kx + 28, ky + 204, kx + kw - 28, ky + 204, { color: C.NAVY2, w: 1 });
  ifRow(kx + 28, ky + 212, kw - 56, 'eth1', '192.168.56.101', 'Host-only', true);

  // Metasploitable VM
  const mx = 900, my = 400, mw = 520, mh = 276;
  h.box(s, mx, my, mw, mh, { fill: C.WHITE, line: C.RED, lw: 2.5, r: 16 });
  await h.ic(s, 'Target', mx + 62, my + 66, 68, { bg: C.RED });
  h.t(s, 'Metasploitable 2', mx + 108, my + 26, 330, 44, { font: F.SB, size: 20, color: C.INK, valign: 'middle' });
  h.t(s, 'TARGET VM · VULNERABLE', mx + 108, my + 74, 388, 28, { font: F.MONO, size: 12, bold: true, color: C.RED, valign: 'middle' });
  h.ln(s, mx + 28, my + 140, mx + mw - 28, my + 140, { color: C.LINE, w: 1 });
  ifRow(mx + 28, my + 148, mw - 56, 'eth0', '192.168.56.102', 'Host-only', false);
  h.ln(s, mx + 28, my + 204, mx + mw - 28, my + 204, { color: C.LINE, w: 1 });
  h.t(s, 'No NAT · no internet route', mx + 28, my + 212, mw - 56, 50, { size: 15, color: C.SLATE, valign: 'middle' });

  // NAT path to the internet (Kali only)
  h.ln(s, kx + 480, ky, kx + 480, 360, { color: C.TEAL, w: 2.5 });
  h.ln(s, kx + 480, 360, 1626, 360, { color: C.TEAL, w: 2.5, end: 'triangle' });
  h.t(s, 'NAT · updates only', 1000, 318, 360, 36, { font: F.MONO, size: 13, bold: true, color: C.TEAL, align: 'center', valign: 'middle' });
  await h.ic(s, 'Globe', 1690, 360, 120, { bg: C.INK });
  h.t(s, 'Internet', 1580, 428, 220, 44, { font: F.SB, size: 20, color: C.INK, align: 'center', valign: 'middle' });

  // Host-only network (isolated)
  const busY = 818;
  h.box(s, 116, 728, 1356, 212, { line: C.GREEN, lw: 1.75, dash: 'dash', r: 16 });
  h.ln(s, 376, busY, 1380, busY, { color: C.GREEN, w: 4 });
  h.ln(s, kx + 260, ky + kh, kx + 260, busY, { color: C.GREEN, w: 3 });
  h.ln(s, mx + 260, my + mh, mx + 260, busY, { color: C.GREEN, w: 3 });
  [kx + 260, mx + 260].forEach((x) => h.circle(s, x, busY, 16, { fill: C.GREEN }));
  h.t(s, 'HOST-ONLY NETWORK · 192.168.56.0/24', 580, 838, 640, 40, { font: F.SB, size: 16, color: C.GREEN, cs: 1.5, align: 'center', valign: 'middle' });
  h.t(s, 'ISOLATED', 1196, 742, 260, 36, { font: F.SB, size: 15, color: C.GREEN, cs: 3, align: 'right', valign: 'middle' });
  // host adapter
  h.box(s, 136, 774, 240, 90, { fill: C.WHITE, line: C.SLATE, lw: 1.5, r: 10 });
  h.t(s, 'Host adapter', 136, 780, 240, 36, { font: F.SB, size: 14, color: C.INK, align: 'center', valign: 'middle' });
  h.t(s, '192.168.56.1', 136, 816, 240, 36, { font: F.MONO, size: 14, color: C.TEAL, align: 'center', valign: 'middle' });
  // DHCP
  h.ln(s, 1326, busY, 1326, 852, { color: C.GREEN, w: 2 });
  h.box(s, 1196, 852, 260, 76, { fill: C.WHITE, line: C.GREEN, lw: 1.5, r: 10 });
  h.t(s, 'DHCP server', 1196, 854, 260, 34, { font: F.SB, size: 14, color: C.INK, align: 'center', valign: 'middle' });
  h.t(s, '192.168.56.100', 1196, 886, 260, 34, { font: F.MONO, size: 14, color: C.TEAL, align: 'center', valign: 'middle' });

  if (opt.lessons) {
    h.chip(s, '>01', 196, 304, { fill: C.INK });
    h.chip(s, '>01', 1376, 320);
    h.chip(s, '>02', kx + kw - 78, ky + 18, { w: 60, fill: C.SKY, color: C.NAVY });
    h.chip(s, '>03', mx + mw - 78, my + 18, { w: 60 });
    h.chip(s, '>04', 500, 843);
    const ky0 = 556;
    h.t(s, 'BUILT IN', 1500, ky0, 340, 32, { font: F.SB, size: 14, color: C.SLATE, cs: 2 });
    const rows = [['>01', 'VirtualBox host'], ['>02', 'Kali Linux'], ['>03', 'Metasploitable'], ['>04', 'Host-only net']];
    rows.forEach((r, i) => {
      h.chip(s, r[0], 1500, ky0 + 50 + i * 66);
      h.t(s, r[1], 1580, ky0 + 44 + i * 66, 256, 42, { size: 17, color: C.INK, valign: 'middle', font: F.M });
    });
  } else {
    const ly = 600;
    h.t(s, 'KEY', 1532, ly, 300, 32, { font: F.SB, size: 14, color: C.SLATE, cs: 2 });
    h.ln(s, 1532, ly + 70, 1592, ly + 70, { color: C.GREEN, w: 4 });
    h.t(s, 'Isolated lab', 1608, ly + 50, 220, 40, { size: 18, color: C.INK, valign: 'middle' });
    h.ln(s, 1532, ly + 130, 1592, ly + 130, { color: C.TEAL, w: 2.5, end: 'triangle' });
    h.t(s, 'Internet via NAT', 1608, ly + 110, 220, 40, { size: 18, color: C.INK, valign: 'middle' });
    h.t(s, 'IPs come from DHCP; yours may differ.', 1532, ly + 180, 290, 80, { size: 15, color: C.SLATE });
  }
}

const ctx = { pres, h, P, C, F, content, dark, lessonCover, labTime, takeaways, hero };

(async () => {
  await require('./s_module').intro(ctx);
  await require('./s_l1')(ctx);
  await require('./s_l2')(ctx);
  await require('./s_l3')(ctx);
  await require('./s_l4')(ctx);
  await require('./s_module').outro(ctx);
  await pres.writeFile({ fileName: 'PEHT_Module02_Building_the_Practice_Lab.pptx' });
  console.log('slides:', pres.slides.length);
})().catch((e) => { console.error(e); process.exit(1); });
