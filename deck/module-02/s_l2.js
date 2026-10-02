// Lesson 02: Installing a Penetration Testing Operating System
module.exports = async ({ h, C, F, P, content, lessonCover, labTime, takeaways }) => {
  const TAG = '>02  INSTALLING A PENETRATION TESTING OS';
  lessonCover(2, 'Installing a Penetration Testing Operating System', 'assets/cover_c.jpg');

  // Why Kali
  {
    const s = content(TAG, 'Why Kali Linux?', 'Debian-based rolling release, 600+ security tools packaged and maintained by OffSec. It is the industry-standard attacker distribution used in OSCP and most courses.');
    const cols = [
      ['Package', 'Debian', 'Base: familiar apt packages'],
      ['Wrench', '600+', 'Security tools, ready to use'],
      ['BadgeCheck', 'OffSec', 'Maintains and funds Kali'],
    ];
    const w = (1728 - 64) / 3;
    for (let i = 0; i < 3; i++) {
      const x = 96 + i * (w + 32), y = 240;
      h.box(s, x, y, w, 680, { fill: i === 1 ? C.NAVY : C.LG, r: 20 });
      await h.ic(s, cols[i][0], x + 100, y + 120, 120, { bg: i === 1 ? C.TEAL : C.NAVY });
      h.t(s, cols[i][1], x + 50, y + 262, w - 100, 150, { size: 64, bold: true, color: i === 1 ? C.WHITE : C.INK, valign: 'middle' });
      h.t(s, cols[i][2], x + 50, y + 448, w - 100, 160, { size: 26, color: i === 1 ? C.SILVER : C.SLATE, lsm: 1.1 });
    }
  }

  // Two install paths
  {
    const s = content(TAG, 'Two ways in: pre-built image or ISO', 'Recommend the pre-built VirtualBox image: it is already tuned for VirtualBox with guest additions. ISO is for when you want full control over partitioning, desktop and tool metapackages.');
    const cards = [
      { x: 96, tag: 'PATH A', title: 'Pre-built image', rec: true, rows: [['Zap', 'Minutes to a desktop'], ['SlidersHorizontal', 'Preset, tuned defaults'], ['KeyRound', 'kali / kali', true]] },
      { x: 988, tag: 'PATH B', title: 'ISO installer', rows: [['Hourglass', 'Full guided install'], ['SlidersHorizontal', 'You choose everything'], ['KeyRound', 'Set during install']] },
    ];
    for (const c of cards) {
      const y = 236, w = 836;
      h.box(s, c.x, y, w, 700, { fill: C.WHITE, line: c.rec ? C.TEAL : C.LINE, lw: c.rec ? 3 : 1.5, r: 20 });
      h.t(s, c.tag, c.x + 48, y + 40, 300, 34, { font: F.MONO, size: 16, bold: true, color: C.TEAL, valign: 'middle' });
      h.t(s, c.title, c.x + 48, y + 80, 700, 84, { font: F.SB, size: 40, color: C.INK, valign: 'middle' });
      if (c.rec) h.chip(s, 'RECOMMENDED', c.x + w - 268, y + 40, { w: 232, h: 42, size: 14 });
      for (let i = 0; i < 3; i++) {
        const ry = y + 220 + i * 150;
        h.box(s, c.x + 40, ry, w - 80, 124, { fill: C.LG, r: 14 });
        await h.ic(s, c.rows[i][0], c.x + 104, ry + 62, 72, { bg: c.rec ? C.TEAL : C.SLATE });
        h.t(s, c.rows[i][1], c.x + 170, ry, w - 240, 124, { font: c.rows[i][2] ? F.MONO : F.M, size: c.rows[i][2] ? 26 : 26, bold: !!c.rows[i][2], color: C.INK, valign: 'middle' });
      }
    }
  }

  // Download -> boot flow
  {
    const s = content(TAG, 'From download to first boot', 'Always verify the SHA256 against the value shown on kali.org/get-kali before extracting. The pre-built image ships as a .7z: extract with 7-Zip, then Machine > Add and pick the .vbox file.');
    const steps = [
      ['Download', 'Download', 'VirtualBox .7z from kali.org'],
      ['FileCheck', 'Verify SHA256', 'Must match kali.org'],
      ['FolderOpen', 'Add to VirtualBox', 'Extract, then Machine › Add…'],
      ['Settings', 'Configure', 'CPU, RAM, network'],
      ['Power', 'Boot', 'Log in: kali / kali'],
    ];
    const cw = 1728 / 5;
    h.ln(s, 96 + cw / 2, 330, 96 + cw * 4.5, 330, { color: C.LINE, w: 3 });
    for (let i = 0; i < 5; i++) {
      const cx = 96 + cw * (i + 0.5);
      if (i < 4) h.ln(s, cx + 72, 330, cx + cw - 78, 330, { color: C.TEAL, w: 3, end: 'triangle' });
      await h.ic(s, steps[i][0], cx, 330, 120, { bg: i === 1 ? C.TEAL : C.NAVY, k: 0.44 });
      h.badge(s, i + 1, cx + 46, 288, 40, { size: 15, fill: C.SKY, color: C.NAVY });
      h.t(s, steps[i][1], cx - cw / 2 + 10, 416, cw - 20, 46, { font: F.SB, size: 22, color: C.INK, align: 'center', valign: 'middle' });
      h.t(s, steps[i][2], cx - cw / 2 + 10, 470, cw - 20, 90, { size: 18, color: C.SLATE, align: 'center', lsm: 1.05 });
    }
    h.t(s, 'VERIFY THE DOWNLOAD', 96, 600, 800, 36, { font: F.SB, size: 15, color: C.SLATE, cs: 2, valign: 'middle' });
    h.term(s, 96, 650, 848, [{ p: '$ ', c: 'sha256sum kali*.7z' }], { size: 20, title: 'Linux host' });
    h.term(s, 976, 650, 848, [{ p: 'PS> ', c: 'Get-FileHash .\\kali*.7z' }], { size: 20, title: 'Windows host · PowerShell' });
  }

  // Recommended VM settings
  {
    const s = content(TAG, 'Recommended Kali VM settings', 'Pre-built image defaults may be 2 GB RAM; raise to 4 GB if the host has 16 GB. Keep the disk dynamically allocated so it grows only as needed. VMSVGA is the right graphics controller for Linux guests.');
    h.win(s, 96, 236, 1060, 700, 'Kali Linux · Details');
    const secs = [
      ['Info', 'General', [['Name', 'Kali Linux'], ['Operating System', 'Debian (64-bit)']]],
      ['Cpu', 'System', [['Base Memory', '4096 MB', 1], ['Processors', '2', 2]]],
      ['Monitor', 'Display', [['Video Memory', '128 MB', 3], ['Graphics Controller', 'VMSVGA', 3]]],
      ['HardDrive', 'Storage', [['SATA Port 0', 'kali-linux-…-amd64.vdi (80 GB)', 4]]],
    ];
    let y = 306;
    const badged = new Set();
    for (const [ic, name, rows] of secs) {
      await h.img(s, ic, C.TEAL, 130, y + 8, 30);
      h.t(s, name, 176, y, 400, 46, { font: F.SB, size: 18, color: C.TEAL, valign: 'middle' });
      y += 48;
      for (const r of rows) {
        if (r[2]) h.box(s, 120, y + 2, 1012, 44, { fill: C.TEALT, r: 6 });
        h.t(s, r[0] + ':', 176, y, 330, 48, { size: 17, color: C.SLATE, valign: 'middle' });
        h.t(s, r[1], 510, y, 560, 48, { size: 17, color: C.INK, valign: 'middle', font: r[2] ? F.SB : F.R });
        if (r[2] && !badged.has(r[2])) { h.badge(s, r[2], 1102, y + 24, 38, { size: 15 }); badged.add(r[2]); }
        y += 48;
      }
      y += 16;
    }
    const call = [['RAM: 4 GB', '2 GB minimum'], ['CPU: 2+ vCPUs', 'More helps tool speed'], ['Video: 128 MB', 'Graphics: VMSVGA'], ['Disk: 80 GB', 'Dynamically allocated']];
    call.forEach((c, i) => {
      const cy = 250 + i * 172;
      h.badge(s, i + 1, 1250, cy + 30, 52, { size: 19 });
      h.t(s, c[0], 1300, cy, 524, 60, { font: F.SB, size: 28, color: C.INK, valign: 'middle' });
      h.t(s, c[1], 1300, cy + 60, 524, 46, { size: 20, color: C.SLATE, valign: 'middle' });
    });
  }

  // First boot
  {
    const s = content(TAG, 'First boot: new password, full update', 'passwd prompts for the current password (kali) then the new one. full-upgrade can remove packages to resolve dependencies, which is what Kali recommends. Reboot to load the new kernel.');
    h.term(s, 96, 236, 1728, [
      { p: '$ ', c: 'passwd' },
      { p: '$ ', c: 'sudo apt update && sudo apt full-upgrade -y' },
      { p: '$ ', c: 'sudo reboot' },
    ], { size: 24, title: 'kali@kali: ~' });
    [0, 1, 2].forEach((i) => h.badge(s, i + 1, 1764, 236 + 46 + 20 + 22 + i * 70, 44, { size: 17 }));
    const notes = [
      ['KeyRound', 'New password', 'Default kali / kali is public'],
      ['RefreshCw', 'Full upgrade', 'Refresh lists, then upgrade'],
      ['Power', 'Reboot', 'Load the new kernel'],
    ];
    const w = (1728 - 64) / 3;
    for (let i = 0; i < 3; i++) {
      const x = 96 + i * (w + 32), y = 600;
      h.box(s, x, y, w, 320, { fill: C.LG, r: 18 });
      h.badge(s, i + 1, x + 66, y + 70, 60, { size: 21 });
      await h.img(s, notes[i][0], C.TEAL, x + w - 98, y + 46, 50);
      h.t(s, notes[i][1], x + 40, y + 134, w - 80, 56, { font: F.SB, size: 28, color: C.INK, valign: 'middle' });
      h.t(s, notes[i][2], x + 40, y + 200, w - 80, 100, { size: 21, color: C.SLATE, lsm: 1.05 });
    }
  }

  // Desktop tour
  {
    const s = content(TAG, 'Find your way around the Kali desktop', 'Default desktop is Xfce. The menu groups tools by attack phase, numbered 01 to 13. You will live in the terminal for most of this course.');
    const X = 96, Y = 236, W = 1180, H = 700;
    h.box(s, X, Y, W, H, { fill: C.NAVY, r: 16 });
    h.box(s, X, Y, W, 56, { fill: C.NAVY2, r: 16 }); h.box(s, X, Y + 28, W, 28, { fill: C.NAVY2 });
    await h.img(s, 'LayoutGrid', C.SKY, X + 22, Y + 12, 32);
    const ql = ['Folder', 'SquareTerminal', 'Globe'];
    for (let i = 0; i < 3; i++) {
      if (i === 1) h.box(s, X + 92 + i * 52, Y + 6, 46, 44, { fill: C.TEAL, r: 6 });
      await h.img(s, ql[i], C.WHITE, X + 100 + i * 52, Y + 14, 30);
    }
    for (let i = 0; i < 4; i++) {
      h.box(s, X + 290 + i * 44, Y + 12, 36, 32, { fill: i === 0 ? C.SLATE : C.NAVY, line: C.SLATE, lw: 1, r: 4 });
      h.t(s, String(i + 1), X + 290 + i * 44, Y + 12, 36, 32, { font: F.MONO, size: 12, color: C.WHITE, align: 'center', valign: 'middle' });
    }
    h.t(s, '10:42', X + W - 120, Y, 100, 56, { font: F.MONO, size: 14, color: C.SILVER, align: 'right', valign: 'middle' });
    // open menu
    h.box(s, X + 14, Y + 64, 560, 600, { fill: C.WHITE, r: 10 });
    h.input(s, X + 34, Y + 84, 520, 'Search…', { color: C.SLATE });
    const items = ['Favorites', 'Recently Used', 'All Applications', null, '01 - Information Gathering', '02 - Vulnerability Analysis', '03 - Web Application Analysis', '04 - Database Assessment', '05 - Password Attacks', '…'];
    let iy = Y + 146;
    for (const it of items) {
      if (it === null) { h.ln(s, X + 34, iy + 8, X + 554, iy + 8, { color: C.LINE, w: 1 }); iy += 16; continue; }
      const cat = /^\d/.test(it);
      if (it.startsWith('01')) h.box(s, X + 26, iy + 2, 536, 44, { fill: C.TEALT, r: 6 });
      h.t(s, it, X + 44, iy, 500, 48, { size: 17, color: cat ? C.INK : C.SLATE, valign: 'middle', font: cat ? F.M : F.R });
      iy += 48;
    }
    // terminal window on the desktop
    h.term(s, X + 610, Y + 120, 540, [
      { p: '$ ', c: 'whoami' },
      { o: 'kali' },
    ], { size: 17, title: 'Terminal' });
    // badges on the mock
    h.badge(s, 1, X + 38, Y + 30, 38, { size: 14 });
    h.badge(s, 2, X + 166, Y + 30, 38, { size: 14 });
    h.badge(s, 3, X + 544, Y + 300, 38, { size: 14 });
    h.badge(s, 4, X + 380, Y + 30, 38, { size: 14 });
    const leg = [['Apps menu', 'Every tool, searchable'], ['Terminal', 'Your main workspace'], ['Tool categories', 'Grouped by attack phase'], ['Workspaces', 'Four virtual desktops']];
    leg.forEach((l, i) => {
      const y = 256 + i * 168;
      h.badge(s, i + 1, 1376, y + 32, 52, { size: 19 });
      h.t(s, l[0], 1424, y, 400, 66, { font: F.SB, size: 26, color: C.INK, valign: 'middle' });
      h.t(s, l[1], 1424, y + 70, 400, 56, { size: 20, color: C.SLATE, valign: 'top' });
    });
  }

  // Clean Install snapshot
  {
    const s = content(TAG, 'Snapshot the clean install', 'Take the snapshot after updating and changing the password. Host key defaults to Right Ctrl on Windows and Linux, Left Command on macOS.');
    const ty = 330;
    h.ln(s, 200, ty, 1720, ty, { color: C.LINE, w: 4 });
    const nodes = [
      { x: 260, t: 'Imported', s: 'Fresh image', st: 'done' },
      { x: 720, t: 'Clean Install', s: 'Updated, password set', st: 'now' },
      { x: 1180, t: 'Lab Ready', s: 'Lesson 04', st: 'next' },
      { x: 1640, t: 'Current State', s: 'Live VM', st: 'next' },
    ];
    for (const n of nodes) {
      if (n.st === 'now') await h.ic(s, 'Camera', n.x, ty, 120, { bg: C.TEAL, k: 0.45 });
      else if (n.st === 'done') h.circle(s, n.x, ty, 44, { fill: C.SLATE });
      else h.circle(s, n.x, ty, 56, { fill: C.WHITE, line: C.SILVER, lw: 3, dash: 'dash' });
      h.t(s, n.t, n.x - 200, ty + 76, 400, 50, { font: F.SB, size: n.st === 'now' ? 28 : 22, color: n.st === 'next' ? C.SLATE : C.INK, align: 'center', valign: 'middle' });
      h.t(s, n.s, n.x - 200, ty + 126, 400, 40, { size: 18, color: C.SLATE, align: 'center', valign: 'middle' });
    }
    // dialog
    h.win(s, 96, 560, 980, 376, 'Take Snapshot of Virtual Machine');
    h.label(s, 'Snapshot Name', 136, 634, 320, { color: C.SLATE });
    h.input(s, 456, 634, 580, 'Clean Install', { hl: true });
    h.label(s, 'Description', 136, 700, 320, { color: C.SLATE });
    h.input(s, 456, 700, 580, 'Updated, password changed');
    h.box(s, 760, 800, 130, 50, { fill: C.TEAL, r: 8 }); h.t(s, 'OK', 760, 800, 130, 50, { font: F.SB, size: 17, color: C.WHITE, align: 'center', valign: 'middle' });
    h.box(s, 906, 800, 130, 50, { fill: C.LG, r: 8 }); h.t(s, 'Cancel', 906, 800, 130, 50, { size: 17, color: C.INK, align: 'center', valign: 'middle' });
    // shortcut
    h.t(s, 'Machine › Take Snapshot…', 1140, 590, 684, 50, { font: F.MONO, size: 20, bold: true, color: C.INK, valign: 'middle' });
    const key = (x, label, w) => {
      h.box(s, x, 676, w, 110, { fill: C.WHITE, line: C.INK, lw: 2.5, r: 14 });
      h.t(s, label, x, 676, w, 110, { font: F.SB, size: 30, color: C.INK, align: 'center', valign: 'middle' });
    };
    key(1140, 'Host', 200);
    h.t(s, '+', 1350, 676, 80, 110, { font: F.MONO, size: 36, bold: true, color: C.TEAL, align: 'center', valign: 'middle' });
    key(1440, 'T', 120);
    h.t(s, 'Host key: Right Ctrl (Windows, Linux)', 1140, 810, 684, 44, { size: 18, color: C.SLATE, valign: 'middle' });
  }

  await labTime(2, 'Get Kali running and clean', [
    'Download and verify the Kali image',
    'Add it to VirtualBox',
    'Apply the recommended CPU, RAM, video',
    'Change password, run full upgrade',
    'Take a “Clean Install” snapshot',
  ]);
  await takeaways(2, 'What to remember from Lesson 02', [
    { icon: 'Zap', text: 'Pre-built image: fastest, cleanest start' },
    { icon: 'KeyRound', text: 'Replace kali / kali on first boot' },
    { icon: 'Camera', text: 'Snapshot before you break things' },
  ]);
};
