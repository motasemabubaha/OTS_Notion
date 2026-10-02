// Lesson 01: Preparing a Virtualization Environment
module.exports = async ({ h, C, F, P, content, lessonCover, labTime, takeaways }) => {
  const TAG = '>01  PREPARING A VIRTUALIZATION ENVIRONMENT';
  lessonCover(1, 'Preparing a Virtualization Environment', 'assets/cover_b.jpg');

  // Why a home lab
  {
    const s = content(TAG, 'Why build your own lab?', 'Legal: you only attack what you own. Safe: traffic never leaves the host. Repeatable: snapshots. Free to break: nothing of value is at risk.');
    const tiles = [
      ['Scale', 'Legal', 'You own every target'],
      ['ShieldCheck', 'Safe', 'Nothing leaves your host'],
      ['RotateCcw', 'Repeatable', 'Reset and retry anytime'],
      ['Hammer', 'Free to break', 'Mistakes cost nothing'],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 96 + (i % 2) * 880, y = 236 + Math.floor(i / 2) * 356;
      h.box(s, x, y, 848, 324, { fill: C.LG, r: 20 });
      await h.ic(s, tiles[i][0], x + 130, y + 162, 140, { bg: i % 3 === 0 ? C.TEAL : C.NAVY, k: 0.46 });
      h.t(s, tiles[i][1], x + 250, y + 78, 570, 84, { font: F.SB, size: 36, color: C.INK, valign: 'middle' });
      h.t(s, tiles[i][2], x + 250, y + 166, 570, 56, { size: 24, color: C.SLATE, valign: 'middle' });
    }
  }

  // What virtualization is
  {
    const s = content(TAG, 'Virtualization: one computer, many machines', 'Hypervisor slices real CPU, RAM, disk and network into virtual machines. Each VM believes it owns real hardware.');
    const vms = [['SquareTerminal', 'Kali Linux', C.TEAL], ['Target', 'Metasploitable 2', C.RED], ['Box', 'Any guest OS', C.SLATE]];
    for (let i = 0; i < 3; i++) {
      const x = 96 + i * 350, y = 240;
      h.box(s, x, y, 320, 300, { fill: C.WHITE, line: C.LINE, lw: 2, r: 16 });
      h.t(s, 'VM ' + (i + 1), x + 28, y + 24, 200, 26, { font: F.MONO, size: 14, bold: true, color: C.TEAL });
      await h.ic(s, vms[i][0], x + 70, y + 116, 84, { bg: vms[i][2] });
      h.t(s, vms[i][1], x + 28, y + 172, 284, 54, { font: F.SB, size: 21, color: C.INK, valign: 'middle' });
      h.t(s, 'Guest OS + apps', x + 28, y + 226, 284, 44, { size: 18, color: C.SLATE, valign: 'middle' });
    }
    h.box(s, 96, 566, 1020, 132, { fill: C.TEAL, r: 16 });
    await h.img(s, 'Layers', C.WHITE, 136, 606, 52);
    h.t(s, 'HYPERVISOR', 210, 578, 600, 52, { font: F.SB, size: 22, color: C.WHITE, cs: 3, valign: 'middle' });
    h.t(s, 'Shares real hardware between VMs', 210, 628, 800, 46, { size: 19, color: C.WHITE, valign: 'middle' });
    h.box(s, 96, 720, 1020, 200, { fill: C.NAVY, r: 16 });
    h.t(s, 'PHYSICAL HOST HARDWARE', 136, 736, 700, 44, { font: F.SB, size: 18, color: C.SILVER, cs: 3 });
    const hw = [['Cpu', 'CPU'], ['MemoryStick', 'RAM'], ['HardDrive', 'Disk'], ['EthernetPort', 'NIC']];
    for (let i = 0; i < 4; i++) {
      const x = 136 + i * 245;
      h.box(s, x, 800, 215, 90, { fill: C.NAVY2, r: 12 });
      await h.img(s, hw[i][0], C.SKY, x + 24, 825, 40);
      h.t(s, hw[i][1], x + 80, 800, 130, 90, { font: F.SB, size: 22, color: C.WHITE, valign: 'middle' });
    }
    const pts = ['One PC runs many machines', 'Each VM: own OS, disk, NIC', 'VMs isolated from each other'];
    for (let i = 0; i < 3; i++) {
      const y = 300 + i * 190;
      h.t(s, '+', 1210, y, 50, 80, { font: F.MONO, size: 40, bold: true, color: C.TEAL, valign: 'middle' });
      h.t(s, pts[i], 1270, y - 20, 554, 120, { font: F.M, size: 26, color: C.INK, valign: 'middle' });
    }
  }

  // Type 1 vs Type 2
  {
    const s = content(TAG, 'Type 1 vs. Type 2: where does it run?', 'Type 1 runs directly on hardware (data centers). Type 2 runs as an app on your normal OS. VirtualBox is Type 2. Note Hyper-V is Type 1 even on a Windows desktop.');
    const cards = [
      { x: 96, tag: 'TYPE 1', title: 'Bare-metal', sub: 'Runs on the hardware', layers: [['Hardware', C.NAVY, C.WHITE], ['Hypervisor', C.TEAL, C.WHITE]], ex: ['VMware ESXi', 'Proxmox VE', 'Hyper-V'] },
      { x: 988, tag: 'TYPE 2', title: 'Hosted', sub: 'Runs on a host OS', layers: [['Hardware', C.NAVY, C.WHITE], ['Host OS: Windows · Linux · macOS', C.SILVER, C.INK], ['Hypervisor', C.TEAL, C.WHITE]], ex: ['VirtualBox', 'VMware Workstation'], ours: true },
    ];
    for (const c of cards) {
      const y = 236, w = 836, ht = 700;
      h.box(s, c.x, y, w, ht, { fill: C.WHITE, line: c.ours ? C.TEAL : C.LINE, lw: c.ours ? 3 : 1.5, r: 20 });
      h.t(s, c.tag, c.x + 44, y + 36, 300, 30, { font: F.MONO, size: 16, bold: true, color: C.TEAL });
      h.t(s, c.title, c.x + 44, y + 68, 500, 76, { font: F.SB, size: 36, color: C.INK, valign: 'middle' });
      h.t(s, c.sub, c.x + 44, y + 144, 500, 44, { size: 20, color: C.SLATE, valign: 'middle' });
      if (c.ours) h.chip(s, 'OUR LAB', c.x + w - 180, y + 40, { w: 136, h: 38, size: 15 });
      // stack bottom-up
      let ly = y + 500;
      for (const [label, fill, col] of c.layers) {
        h.box(s, c.x + 44, ly, w - 88, 62, { fill, r: 10 });
        h.t(s, label, c.x + 44, ly, w - 88, 62, { font: F.SB, size: 19, color: col, align: 'center', valign: 'middle' });
        ly -= 74;
      }
      const vw = (w - 88 - 2 * 20) / 3;
      for (let i = 0; i < 3; i++) {
        h.box(s, c.x + 44 + i * (vw + 20), ly - 10, vw, 72, { fill: C.WHITE, line: C.INK, lw: 1.5, r: 10 });
        h.t(s, 'VM', c.x + 44 + i * (vw + 20), ly - 10, vw, 72, { font: F.SB, size: 19, color: C.INK, align: 'center', valign: 'middle' });
      }
      let ex = c.x + 44;
      for (const e of c.ex) {
        const ew = e.length * 17 + 48;
        const hl = c.ours && e === 'VirtualBox';
        h.box(s, ex, y + 600, ew, 54, { fill: hl ? C.TEAL : C.LG, r: 27 });
        h.t(s, e, ex, y + 600, ew, 54, { font: hl ? F.SB : F.M, size: 18, color: hl ? C.WHITE : C.INK, align: 'center', valign: 'middle' });
        ex += ew + 16;
      }
    }
  }

  // Host requirements
  {
    const s = content(TAG, 'Can your computer run the lab?', 'Minimum gets you through the module; recommended keeps both VMs responsive while you browse and take notes.');
    await h.table(s, 96, 250, [320, 460, 360], 120, ['RESOURCE', 'MINIMUM', 'RECOMMENDED'], [
      [{ icon: 'Cpu', t: 'CPU', bold: true }, '64-bit, VT-x / AMD-V', { t: '4+ cores', bold: true, color: C.TEAL }],
      [{ icon: 'MemoryStick', t: 'RAM', bold: true }, '8 GB', { t: '16 GB', bold: true, color: C.TEAL }],
      [{ icon: 'HardDrive', t: 'Free disk', bold: true }, '80 GB', { t: '100 GB+', bold: true, color: C.TEAL }],
      [{ icon: 'Gauge', t: 'Disk type', bold: true }, 'HDD works', { t: 'SSD', bold: true, color: C.TEAL }],
    ], { size: 21 });
    // RAM budget bar
    h.t(s, 'RAM BUDGET · 16 GB HOST', 1316, 250, 508, 30, { font: F.SB, size: 15, color: C.SLATE, cs: 2 });
    const segs = [['Headroom', 3, C.LG, C.INK], ['Metasploitable', 1, C.RED, C.WHITE], ['Kali Linux', 4, C.TEAL, C.WHITE], ['Host OS + apps', 8, C.NAVY, C.WHITE]];
    let y = 300; const unit = 38;
    for (const [label, gb, fill] of segs) {
      const hh = gb * unit;
      h.box(s, 1316, y, 130, hh - 4, { fill });
      h.t(s, label, 1474, y + hh / 2 - 18, 260, 34, { font: F.M, size: 19, color: C.INK, valign: 'middle' });
      h.t(s, gb + ' GB', 1700, y + hh / 2 - 18, 124, 34, { font: F.MONO, size: 17, bold: true, color: C.TEAL, valign: 'middle', align: 'right' });
      y += hh;
    }
  }

  // BIOS / UEFI
  {
    const s = content(TAG, 'Switch on VT-x / AMD-V in firmware', 'Menu names vary by vendor: look under Advanced, CPU Configuration, or Security. Check from Windows: Task Manager > Performance > CPU > Virtualization: Enabled.');
    h.box(s, 96, 236, 1060, 700, { fill: C.NAVY, r: 18 });
    h.t(s, 'UEFI FIRMWARE SETUP', 136, 262, 600, 30, { font: F.MONO, size: 16, bold: true, color: C.SKY, cs: 2 });
    const tabs = ['Main', 'Advanced', 'Boot', 'Security', 'Exit'];
    tabs.forEach((tb, i) => {
      const x = 136 + i * 170;
      if (i === 1) h.box(s, x - 14, 312, 160, 48, { fill: C.NAVY2, r: 8 });
      h.t(s, tb, x - 14, 312, 160, 48, { font: i === 1 ? F.SB : F.R, size: 18, color: i === 1 ? C.WHITE : C.SILVER, align: 'center', valign: 'middle' });
    });
    h.t(s, 'Advanced  ›  CPU Configuration', 136, 384, 800, 32, { font: F.MONO, size: 15, color: C.SILVER });
    const rows = [
      ['Intel Virtualization Technology', 'Enabled', 'hl'],
      ['SVM Mode  (AMD CPUs)', 'Enabled', 'hl2'],
      ['Hyper-Threading', 'Enabled', ''],
      ['Execute Disable Bit', 'Enabled', ''],
    ];
    rows.forEach((r, i) => {
      const y = 440 + i * 80;
      if (r[2]) h.box(s, 120, y, 1012, 64, { fill: r[2] === 'hl' ? C.TEAL : C.NAVY2, r: 8 });
      h.t(s, r[0], 150, y, 700, 64, { font: F.MONO, size: 17, color: r[2] ? C.WHITE : C.SLATE, valign: 'middle', bold: !!r[2] });
      h.t(s, '[' + r[1] + ']', 860, y, 230, 64, { font: F.MONO, size: 17, color: r[2] ? C.WHITE : C.SLATE, valign: 'middle', align: 'right', bold: !!r[2] });
    });
    h.t(s, 'F10  Save & Exit      Esc  Back', 150, 860, 800, 40, { font: F.MONO, size: 15, color: C.SILVER, valign: 'middle' });
    h.badge(s, 1, 1156, 277, 44, { size: 17 });
    h.badge(s, 2, 1156, 472, 44, { size: 17 });
    h.badge(s, 3, 1156, 552, 44, { size: 17 });
    h.badge(s, 4, 1156, 880, 44, { size: 17 });
    const notes = [['Enter setup at boot', 'F2, Del or Esc'], ['Intel CPU', 'Virtualization Technology → Enabled'], ['AMD CPU', 'SVM Mode → Enabled'], ['Save and reboot', 'F10']];
    notes.forEach((n, i) => {
      const y = 244 + i * 172;
      h.badge(s, i + 1, 1250, y + 28, 52, { size: 19 });
      h.t(s, n[0], 1300, y, 524, 56, { font: F.SB, size: 24, color: C.INK, valign: 'middle' });
      h.t(s, n[1], 1300, y + 58, 524, 100, { size: 20, color: C.SLATE });
    });
  }

  // Hyper-V conflict
  {
    const s = content(TAG, 'Windows conflict: Hyper-V holds the CPU', 'When Hyper-V, Virtual Machine Platform or Windows Hypervisor Platform is on, VirtualBox runs through the Windows hypervisor API: it works but slowly, shown by a turtle icon. Memory Integrity (Core isolation) can also start the hypervisor. Turning these off disables WSL2 and Docker Desktop until re-enabled.');
    // stack
    h.box(s, 96, 800, 760, 120, { fill: C.NAVY, r: 14 });
    h.t(s, 'Hardware: VT-x / AMD-V', 96, 800, 760, 120, { font: F.SB, size: 21, color: C.WHITE, align: 'center', valign: 'middle' });
    h.box(s, 96, 676, 760, 108, { fill: C.SLATE, r: 14 });
    h.t(s, 'Windows hypervisor (Hyper-V)', 96, 676, 760, 108, { font: F.SB, size: 21, color: C.WHITE, align: 'center', valign: 'middle' });
    h.box(s, 96, 440, 360, 220, { fill: C.LG, r: 14 });
    await h.img(s, 'Monitor', C.INK, 246, 488, 60);
    h.t(s, 'Windows 11', 96, 566, 360, 40, { font: F.SB, size: 21, color: C.INK, align: 'center' });
    h.box(s, 496, 440, 360, 220, { fill: C.WHITE, line: C.INK, lw: 2, r: 14 });
    await h.img(s, 'Turtle', C.INK, 640, 480, 76);
    h.t(s, 'VirtualBox', 496, 566, 360, 40, { font: F.SB, size: 21, color: C.INK, align: 'center' });
    h.t(s, 'Slow fallback mode', 496, 604, 360, 34, { size: 17, color: C.SLATE, align: 'center' });
    h.t(s, 'Hyper-V owns VT-x;\nVirtualBox borrows it', 96, 244, 760, 150, { font: F.M, size: 28, color: C.INK, lsm: 1.05, valign: 'middle' });
    // fix
    h.win(s, 940, 236, 884, 380, 'Windows Features');
    h.t(s, 'Turn Windows features on or off', 980, 304, 800, 40, { font: F.SB, size: 18, color: C.INK, valign: 'middle' });
    await h.check(s, 980, 370, false, 'Hyper-V', { size: 19, w: 760 });
    await h.check(s, 980, 440, false, 'Virtual Machine Platform', { size: 19, w: 760 });
    await h.check(s, 980, 510, false, 'Windows Hypervisor Platform', { size: 19, w: 760 });
    h.badge(s, 1, 1760, 300, 44, { size: 17 });
    h.term(s, 940, 648, 884, [
      { p: 'PS> ', c: 'bcdedit /set hypervisorlaunchtype off' },
      { p: 'PS> ', c: 'shutdown /r /t 0' },
    ], { size: 16, title: 'PowerShell · Administrator' });
    h.badge(s, 2, 1760, 704, 44, { size: 17 });
  }

  // Install VirtualBox + Extension Pack
  {
    const s = content(TAG, 'Install VirtualBox 7.x, then its Extension Pack', 'Extension Pack adds USB 2/3 passthrough, disk encryption and more. It is under the PUEL licence: free for personal and educational use. Download both from virtualbox.org/wiki/Downloads.');
    const steps = [
      ['Download', 'Download VirtualBox 7.x', 'virtualbox.org'],
      ['MousePointerClick', 'Run the installer', 'Accept driver prompts'],
      ['Package', 'Get the Extension Pack', 'Exact same version'],
      ['PackageCheck', 'Install the pack', 'Double-click .vbox-extpack'],
    ];
    const w = 396, gap = 48;
    for (let i = 0; i < 4; i++) {
      const x = 96 + i * (w + gap), y = 250;
      h.box(s, x, y, w, 360, { fill: C.LG, r: 18 });
      h.badge(s, i + 1, x + 66, y + 66, 64, { size: 22, fill: C.NAVY });
      await h.img(s, steps[i][0], C.TEAL, x + w - 96, y + 38, 56);
      h.t(s, steps[i][1], x + 34, y + 130, w - 56, 120, { font: F.SB, size: 24, color: C.INK, lsm: 1.0, valign: 'middle' });
      h.t(s, steps[i][2], x + 34, y + 262, w - 56, 70, { size: 18, color: C.SLATE, valign: 'top' });
      if (i < 3) h.ln(s, x + w + 8, y + 180, x + w + gap - 8, y + 180, { color: C.TEAL, w: 3, end: 'triangle' });
    }
    // version match
    h.box(s, 260, 690, 520, 110, { fill: C.NAVY, r: 16 });
    h.t(s, 'VirtualBox 7.x.y', 260, 690, 520, 110, { font: F.MONO, size: 22, bold: true, color: C.WHITE, align: 'center', valign: 'middle' });
    h.t(s, '=', 780, 690, 120, 110, { font: F.MONO, size: 54, bold: true, color: C.TEAL, align: 'center', valign: 'middle' });
    h.box(s, 900, 690, 600, 110, { fill: C.NAVY, r: 16 });
    h.t(s, 'Extension Pack 7.x.y', 900, 690, 600, 110, { font: F.MONO, size: 22, bold: true, color: C.WHITE, align: 'center', valign: 'middle' });
    await h.ic(s, 'Check', 1580, 745, 80, { bg: C.GREEN, k: 0.55 });
    h.t(s, 'Versions must match', 260, 820, 1240, 50, { font: F.SB, size: 22, color: C.INK, align: 'center' });
  }

  // Core VM concepts
  {
    const s = content(TAG, 'Four VirtualBox features you’ll use daily', 'Snapshots: point-in-time state you can restore. Linked clone shares the parent disk (fast, small, dependent). Full clone is a fully independent copy. Guest Additions: auto-resize, drivers, shared folders. Shared clipboard: Devices > Shared Clipboard > Bidirectional.');
    const cards = [
      ['Camera', 'Snapshots', 'Save state, roll back'],
      ['Copy', 'Clones', 'Linked or full copy'],
      ['Puzzle', 'Guest Additions', 'Better display, drivers'],
      ['ClipboardCopy', 'Shared clipboard', 'Copy-paste host \u2192 VM'],
    ];
    const w = (1728 - 3 * 32) / 4;
    for (let i = 0; i < 4; i++) {
      const x = 96 + i * (w + 32), y = 240;
      h.box(s, x, y, w, 690, { fill: C.WHITE, line: C.LINE, lw: 2, r: 20 });
      await h.ic(s, cards[i][0], x + 86, y + 96, 112, { bg: C.TEAL });
      h.t(s, cards[i][1], x + 40, y + 168, w - 64, 82, { font: F.SB, size: 27, color: C.INK, valign: 'middle', lsm: 1.0 });
      h.t(s, cards[i][2], x + 40, y + 256, w - 64, 90, { size: 19, color: C.SLATE, lsm: 1.05 });
      h.box(s, x + 30, y + 360, w - 60, 290, { fill: C.LG, r: 14 });
    }
    // mini visuals
    let x = 96 + 30, y = 600 + 0;
    { // snapshots timeline
      const cx = x, cw = w - 60, my = 745;
      h.ln(s, cx + 40, my, cx + cw - 40, my, { color: C.SILVER, w: 3 });
      [0, 1, 2].forEach((k) => h.circle(s, cx + 60 + k * ((cw - 120) / 2), my, 40, k < 2 ? { fill: C.TEAL } : { fill: C.WHITE, line: C.TEAL, lw: 3 }));
      await h.img(s, 'RotateCcw', C.INK, cx + cw / 2 - 30, my - 120, 60);
    }
    { // clones
      const cx = 96 + (w + 32) + 30, cw = w - 60;
      h.t(s, 'LINKED', cx + 10, 620, cw / 2 - 20, 26, { font: F.MONO, size: 13, bold: true, color: C.TEAL, align: 'center' });
      h.t(s, 'FULL', cx + cw / 2 + 10, 620, cw / 2 - 20, 26, { font: F.MONO, size: 13, bold: true, color: C.TEAL, align: 'center' });
      const lx = cx + cw / 4;
      await h.img(s, 'HardDrive', C.INK, lx - 22, 790, 44);
      h.box(s, lx - 70, 670, 56, 44, { fill: C.NAVY, r: 6 }); h.box(s, lx + 14, 670, 56, 44, { fill: C.NAVY, r: 6 });
      h.ln(s, lx - 42, 714, lx - 8, 786, { color: C.INK, w: 1.5 }); h.ln(s, lx + 42, 714, lx + 8, 786, { color: C.INK, w: 1.5 });
      const fx = cx + 3 * cw / 4;
      for (const dx of [-42, 42]) {
        h.box(s, fx + dx - 28, 670, 56, 44, { fill: C.NAVY, r: 6 });
        h.ln(s, fx + dx, 714, fx + dx, 784, { color: C.INK, w: 1.5 });
        await h.img(s, 'HardDrive', C.INK, fx + dx - 20, 790, 40);
      }
      h.ln(s, cx + cw / 2, 630, cx + cw / 2, 860, { color: C.LINE, w: 1.5 });
    }
    { // guest additions
      const cx = 96 + 2 * (w + 32) + 30, cw = w - 60;
      await h.img(s, 'Monitor', C.INK, cx + cw / 2 - 70, 670, 140);
      await h.img(s, 'Maximize2', C.TEAL, cx + cw / 2 - 26, 700, 52);
    }
    { // clipboard
      const cx = 96 + 3 * (w + 32) + 30, cw = w - 60;
      await h.ic(s, 'Laptop', cx + 70, 745, 84, { bg: C.NAVY });
      await h.ic(s, 'Box', cx + cw - 70, 745, 84, { bg: C.TEAL });
      h.ln(s, cx + 122, 745, cx + cw - 122, 745, { color: C.INK, w: 2.5, begin: 'triangle', end: 'triangle' });
      h.t(s, 'Host', cx + 20, 800, 100, 30, { font: F.SB, size: 15, color: C.INK, align: 'center' });
      h.t(s, 'VM', cx + cw - 120, 800, 100, 30, { font: F.SB, size: 15, color: C.INK, align: 'center' });
    }
  }

  await labTime(1, 'Build your virtualization base', [
    'Confirm VT-x / AMD-V is enabled',
    'Windows: turn off Hyper-V features',
    'Install VirtualBox 7.x',
    'Install the matching Extension Pack',
    'Check Help › About VirtualBox',
  ]);
  await takeaways(1, 'What to remember from Lesson 01', [
    { icon: 'Cpu', text: 'Hardware virtualization must be switched on' },
    { icon: 'Layers', text: 'VirtualBox is a Type 2 hypervisor' },
    { icon: 'PackageCheck', text: 'Extension Pack version = VirtualBox version' },
  ]);
};
