// Lesson 04: Configuring Isolated Network Environments
module.exports = async ({ h, C, F, P, content, lessonCover, labTime, takeaways }) => {
  const TAG = '>04  CONFIGURING ISOLATED NETWORK ENVIRONMENTS';
  lessonCover(4, 'Configuring Isolated Network Environments', 'assets/cover_e.jpg');

  // Why isolation matters
  {
    const s = content(TAG, 'Why isolation decides everything', 'The wrong adapter turns a safe practice target into an exposed host on your real network. Isolation is the single setting that keeps the lab legal and contained.');
    // exposed side
    h.box(s, 96, 240, 836, 696, { fill: C.REDT, line: C.RED, lw: 2.5, r: 20 });
    h.t(s, 'EXPOSED', 136, 280, 400, 44, { font: F.SB, size: 22, color: C.RED, cs: 4, valign: 'middle' });
    h.t(s, 'Bridged adapter', 136, 324, 600, 50, { size: 24, color: C.INK, valign: 'middle' });
    await h.ic(s, 'Target', 516, 486, 128, { bg: C.RED });
    const threats = [[186, 470, 'Globe'], [846, 470, 'Wifi'], [516, 760, 'Smartphone']];
    for (const [x, y, ic] of threats) { await h.ic(s, ic, x, y, 92, { bg: C.NAVY }); }
    h.ln(s, 250, 490, 452, 500, { color: C.RED, w: 3, end: 'triangle' });
    h.ln(s, 782, 490, 580, 500, { color: C.RED, w: 3, end: 'triangle' });
    h.ln(s, 516, 696, 516, 560, { color: C.RED, w: 3, end: 'triangle' });
    h.t(s, 'Any device can reach the target', 136, 850, 760, 50, { font: F.M, size: 22, color: C.RED, align: 'center', valign: 'middle' });
    // isolated side
    h.box(s, 988, 240, 836, 696, { fill: C.GREENT, line: C.GREEN, lw: 2.5, r: 20 });
    h.t(s, 'ISOLATED', 1028, 280, 400, 44, { font: F.SB, size: 22, color: C.GREEN, cs: 4, valign: 'middle' });
    h.t(s, 'Host-only adapter', 1028, 324, 600, 50, { size: 24, color: C.INK, valign: 'middle' });
    h.box(s, 1088, 452, 636, 300, { line: C.GREEN, lw: 2, dash: 'dash', r: 16 });
    await h.ic(s, 'SquareTerminal', 1248, 586, 118, { bg: C.TEAL });
    await h.ic(s, 'Target', 1564, 586, 118, { bg: C.RED });
    h.ln(s, 1314, 586, 1498, 586, { color: C.GREEN, w: 3, begin: 'triangle', end: 'triangle' });
    h.t(s, 'Kali', 1189, 660, 120, 36, { font: F.SB, size: 18, color: C.INK, align: 'center' });
    h.t(s, 'Target', 1505, 660, 120, 36, { font: F.SB, size: 18, color: C.INK, align: 'center' });
    h.t(s, 'Only your Kali VM can reach it', 1028, 850, 760, 50, { font: F.M, size: 22, color: C.GREEN, align: 'center', valign: 'middle' });
  }

  // Network modes table
  {
    const s = content(TAG, 'Five network modes, one safe choice', 'VirtualBox gives each adapter a mode. For a lab with a vulnerable target, Host-only is the safe default; add NAT on a second Kali adapter only for updates.');
    const yes = { icon: 'Check', iconColor: C.GREEN };
    const no = { icon: 'X', iconColor: C.RED };
    const dash = { t: '—', color: C.SILVER, align: 'center', bold: true };
    const head = ['MODE', 'VM \u2192 VM', 'VM \u2192 HOST', 'VM \u2192 NET', 'LAB SAFETY'];
    const ha = ['left', 'center', 'center', 'center', 'left'];
    const safe = (t, c) => ({ t, color: c, bold: true });
    await h.table(s, 96, 252, [360, 240, 240, 240, 648], 104, head, [
      [{ t: 'NAT', bold: true }, no, no, yes, safe('Safe · no inbound', C.GREEN)],
      [{ fill: C.LG, t: '' }, dash, dash, yes, safe('', C.GREEN)],
      [{ t: 'Bridged', bold: true }, yes, yes, yes, safe('Exposed · on real LAN', C.RED)],
      [{ t: 'Internal', bold: true }, yes, no, no, safe('Isolated · no host', C.INK)],
      [{ t: 'Host-only', bold: true, color: C.TEAL }, yes, yes, no, safe('Isolated + host access', C.GREEN)],
    ], { size: 20, headAlign: ha, headSize: 15 });
    // fix the NAT Network second row labels (overwrite)
    h.t(s, 'NAT Network', 120, 252 + 104 + 104, 320, 104, { size: 20, bold: true, color: C.INK, valign: 'middle' });
    h.t(s, 'Safe · shared NAT', 96 + 360 + 240 * 3 + 24, 252 + 104 + 104, 600, 104, { size: 20, bold: true, color: C.GREEN, valign: 'middle' });
    // recommendation strip
    h.box(s, 96, 872, 1728, 72, { fill: C.TEALT, r: 14 });
    await h.img(s, 'Check', C.TEAL, 124, 890, 36);
    h.t(s, 'Course choice: Host-only for the lab, plus NAT on a second Kali adapter for updates.', 176, 872, 1620, 72, { font: F.M, size: 22, color: C.INK, valign: 'middle' });
  }

  // Recommended topology
  {
    const s = content(TAG, 'The adapter map you will build', 'Kali gets two adapters: NAT for internet, Host-only for the lab. Metasploitable gets one Host-only adapter and nothing else, so it can never route outward.');
    // Kali
    h.box(s, 96, 260, 760, 300, { fill: C.NAVY, r: 18 });
    await h.ic(s, 'SquareTerminal', 196, 360, 108, { bg: C.TEAL });
    h.t(s, 'Kali Linux', 300, 300, 500, 54, { size: 30, bold: true, color: C.WHITE, valign: 'middle' });
    h.t(s, 'ATTACKER', 300, 356, 500, 34, { font: F.MONO, size: 14, bold: true, color: C.SKY, cs: 1, valign: 'middle' });
    h.box(s, 136, 436, 680, 48, { fill: C.NAVY2, r: 8 });
    h.t(s, 'Adapter 1', 156, 436, 190, 48, { font: F.MONO, size: 16, color: C.SKY, valign: 'middle' });
    h.t(s, 'NAT', 350, 436, 160, 48, { font: F.SB, size: 16, color: C.WHITE, valign: 'middle' });
    h.t(s, '10.0.2.15', 520, 436, 276, 48, { font: F.MONO, size: 15, color: C.SILVER, valign: 'middle', align: 'right' });
    h.box(s, 136, 494, 680, 48, { fill: C.NAVY2, r: 8 });
    h.t(s, 'Adapter 2', 156, 494, 190, 48, { font: F.MONO, size: 16, color: C.SKY, valign: 'middle' });
    h.t(s, 'Host-only', 350, 494, 160, 48, { font: F.SB, size: 16, color: C.WHITE, valign: 'middle' });
    h.t(s, '192.168.56.101', 500, 494, 296, 48, { font: F.MONO, size: 15, color: C.SILVER, valign: 'middle', align: 'right' });
    // Metasploitable
    h.box(s, 96, 600, 760, 236, { fill: C.WHITE, line: C.RED, lw: 2.5, r: 18 });
    await h.ic(s, 'Target', 196, 690, 108, { bg: C.RED });
    h.t(s, 'Metasploitable 2', 300, 636, 540, 54, { size: 28, bold: true, color: C.INK, valign: 'middle' });
    h.t(s, 'TARGET', 300, 690, 500, 34, { font: F.MONO, size: 14, bold: true, color: C.RED, cs: 1, valign: 'middle' });
    h.box(s, 136, 768, 680, 48, { fill: C.LG, r: 8 });
    h.t(s, 'Adapter 1', 156, 768, 190, 48, { font: F.MONO, size: 16, color: C.TEAL, valign: 'middle' });
    h.t(s, 'Host-only', 350, 768, 160, 48, { font: F.SB, size: 16, color: C.INK, valign: 'middle' });
    h.t(s, '192.168.56.102', 500, 768, 296, 48, { font: F.MONO, size: 15, color: C.SLATE, valign: 'middle', align: 'right' });
    // internet
    await h.ic(s, 'Globe', 1700, 360, 120, { bg: C.INK });
    h.t(s, 'Internet', 1600, 430, 220, 40, { font: F.SB, size: 20, color: C.INK, align: 'center' });
    h.ln(s, 856, 460, 1636, 460, { color: C.TEAL, w: 3, end: 'triangle' });
    h.t(s, 'NAT · updates', 1080, 416, 400, 36, { font: F.MONO, size: 14, bold: true, color: C.TEAL, align: 'center' });
    // host-only bus
    const busX = 1200, busY1 = 518, busY2 = 792;
    h.box(s, 1040, 560, 760, 300, { line: C.GREEN, lw: 2, dash: 'dash', r: 16 });
    h.ln(s, busX, 600, busX, 820, { color: C.GREEN, w: 4 });
    h.ln(s, 856, busY1, busX, busY1, { color: C.GREEN, w: 3 });
    h.ln(s, 856, busY2, busX, busY2, { color: C.GREEN, w: 3 });
    h.circle(s, busX, busY1, 16, { fill: C.GREEN });
    h.circle(s, busX, busY2, 16, { fill: C.GREEN });
    h.t(s, 'HOST-ONLY', 1280, 596, 480, 40, { font: F.SB, size: 18, color: C.GREEN, cs: 2, valign: 'middle' });
    h.t(s, '192.168.56.0/24', 1280, 636, 480, 40, { font: F.MONO, size: 20, bold: true, color: C.INK, valign: 'middle' });
    h.box(s, 1280, 700, 460, 120, { fill: C.WHITE, line: C.GREEN, lw: 1.5, r: 12 });
    await h.img(s, 'Server', C.GREEN, 1316, 740, 44);
    h.t(s, 'DHCP server', 1380, 710, 340, 40, { font: F.SB, size: 18, color: C.INK, valign: 'middle' });
    h.t(s, '192.168.56.100', 1380, 752, 340, 40, { font: F.MONO, size: 17, color: C.TEAL, valign: 'middle' });
  }

  // Host-only network manager mock
  {
    const s = content(TAG, 'Create and check the Host-only network', 'Open Tools › Network Manager. VirtualBox ships vboxnet0 at 192.168.56.0/24. Confirm the DHCP server is enabled so both VMs get an address automatically.');
    h.win(s, 96, 236, 1160, 700, 'Network Manager');
    // tabs
    const tabs = ['Host-only Networks', 'NAT Networks', 'Cloud Networks'];
    tabs.forEach((t, i) => {
      if (i === 0) h.box(s, 116 + i * 300, 310, 290, 50, { fill: C.TEALT, r: 8 });
      h.t(s, t, 116 + i * 300, 310, 290, 50, { font: i === 0 ? F.SB : F.R, size: 17, color: i === 0 ? C.TEAL : C.SLATE, align: 'center', valign: 'middle' });
    });
    // row
    h.box(s, 136, 392, 1080, 60, { fill: C.NAVY });
    h.t(s, 'Name', 160, 392, 300, 60, { font: F.SB, size: 16, color: C.WHITE, valign: 'middle' });
    h.t(s, 'IPv4 Address / Mask', 560, 392, 400, 60, { font: F.SB, size: 16, color: C.WHITE, valign: 'middle' });
    h.t(s, 'DHCP', 1040, 392, 160, 60, { font: F.SB, size: 16, color: C.WHITE, valign: 'middle' });
    h.box(s, 136, 452, 1080, 64, { fill: C.TEALT });
    h.t(s, 'vboxnet0', 160, 452, 400, 64, { font: F.MONO, size: 18, bold: true, color: C.INK, valign: 'middle' });
    h.t(s, '192.168.56.1 / 24', 560, 452, 460, 64, { font: F.MONO, size: 18, color: C.INK, valign: 'middle' });
    await h.check(s, 1040, 468, true, '', {});
    h.box(s, 136, 452, 1080, 64, { line: C.LINE, lw: 1 });
    // properties
    h.t(s, 'Adapter', 160, 556, 300, 40, { font: F.SB, size: 17, color: C.TEAL });
    h.label(s, 'IPv4 Address', 160, 606, 260, { color: C.SLATE });
    h.input(s, 440, 606, 360, '192.168.56.1', { mono: true });
    h.label(s, 'IPv4 Mask', 160, 666, 260, { color: C.SLATE });
    h.input(s, 440, 666, 360, '255.255.255.0', { mono: true });
    h.t(s, 'DHCP Server', 160, 744, 300, 40, { font: F.SB, size: 17, color: C.TEAL });
    await h.check(s, 160, 796, true, 'Enable Server', { size: 17 });
    h.label(s, 'Lower Bound', 440, 790, 240, { color: C.SLATE });
    h.input(s, 680, 790, 360, '192.168.56.101', { mono: true, hl: true });
    h.badge(s, 1, 1230, 482, 44, { size: 17 });
    h.badge(s, 2, 1230, 812, 44, { size: 17 });
    const notes = [['vboxnet0 exists', 'Default host-only network'], ['DHCP enabled', 'Hands out .101 upward'], ['Host is .1', 'Your gateway into the lab']];
    notes.forEach((n, i) => {
      const y = 300 + i * 200;
      h.badge(s, i + 1, 1320, y + 30, 52, { size: 19 });
      h.t(s, n[0], 1388, y, 440, 60, { font: F.SB, size: 26, color: C.INK, valign: 'middle' });
      h.t(s, n[1], 1388, y + 62, 440, 80, { size: 21, color: C.SLATE, lsm: 1.05 });
    });
  }

  // Per-VM adapter settings mock
  {
    const s = content(TAG, 'Point each adapter at the right network', 'Per VM: Settings › Network › Adapter. Enable it, set “Attached to”, then pick the host-only network name. Do this on both VMs before you boot them.');
    const panel = (x, title, vmLabel, adapters, host) => {
      h.win(s, x, 236, 836, 700, title);
      // adapter tabs
      for (let i = 0; i < 4; i++) {
        const tx = x + 30 + i * 150;
        if (i === 0) h.box(s, tx, 306, 140, 46, { fill: C.TEALT, r: 8 });
        h.t(s, 'Adapter ' + (i + 1), tx, 306, 140, 46, { font: i === 0 ? F.SB : F.R, size: 15, color: i === 0 ? C.TEAL : C.SLATE, align: 'center', valign: 'middle' });
      }
      return x;
    };
    // Kali panel
    panel(96, 'Kali Linux · Network', 'Kali');
    await h.check(s, 136, 388, true, 'Enable Network Adapter', { size: 17 });
    h.label(s, 'Attached to', 136, 460, 260, { color: C.SLATE });
    await h.dropdown(s, 400, 460, 492, 'Host-only Adapter', { hl: true, bold: true });
    h.label(s, 'Name', 136, 534, 260, { color: C.SLATE });
    await h.dropdown(s, 400, 534, 492, 'vboxnet0', { hl: true, mono: true });
    h.box(s, 136, 620, 756, 280, { fill: C.LG, r: 14 });
    h.t(s, 'Adapter 1 = NAT  (internet)', 176, 650, 680, 44, { font: F.MONO, size: 18, color: C.SLATE, valign: 'middle' });
    h.t(s, 'Adapter 2 = Host-only (lab)', 176, 706, 680, 44, { font: F.MONO, size: 18, bold: true, color: C.TEAL, valign: 'middle' });
    await h.ic(s, 'SquareTerminal', 220, 840, 72, { bg: C.TEAL });
    h.t(s, 'Two adapters', 300, 816, 560, 60, { font: F.SB, size: 24, color: C.INK, valign: 'middle' });
    // Meta panel
    panel(988, 'Metasploitable 2 · Network', 'Target');
    await h.check(s, 1028, 388, true, 'Enable Network Adapter', { size: 17 });
    h.label(s, 'Attached to', 1028, 460, 260, { color: C.SLATE });
    await h.dropdown(s, 1292, 460, 492, 'Host-only Adapter', { hl: true, bold: true, hlColor: C.GREEN });
    h.label(s, 'Name', 1028, 534, 260, { color: C.SLATE });
    await h.dropdown(s, 1292, 534, 492, 'vboxnet0', { hl: true, mono: true, hlColor: C.GREEN });
    h.box(s, 1028, 620, 756, 280, { fill: C.GREENT, r: 14 });
    h.t(s, 'Adapter 1 = Host-only ONLY', 1068, 650, 680, 44, { font: F.MONO, size: 18, bold: true, color: C.GREEN, valign: 'middle' });
    h.t(s, 'Adapters 2–4 = disabled', 1068, 706, 680, 44, { font: F.MONO, size: 18, color: C.SLATE, valign: 'middle' });
    await h.ic(s, 'ShieldCheck', 1112, 840, 72, { bg: C.GREEN });
    h.t(s, 'One adapter, isolated', 1192, 816, 560, 60, { font: F.SB, size: 24, color: C.INK, valign: 'middle' });
  }

  // Connectivity verification
  {
    const s = content(TAG, 'Prove the lab is wired correctly', 'From Kali: ip a shows an address on the 192.168.56.0/24 network. ping confirms the target answers. The ping sweep lists every live host — you should see the gateway, Kali and the target.');
    h.term(s, 96, 250, 1728, [
      { p: '$ ', c: 'ip a show eth1' },
      { o: [{ t: '    inet ', c: C.TERMTXT }, { t: '192.168.56.101/24', c: C.SKY, b: true }, { t: ' brd 192.168.56.255 scope global eth1', c: C.TERMTXT }] },
      { p: '$ ', c: 'ping -c 4 192.168.56.102' },
      { o: [{ t: '64 bytes from 192.168.56.102: icmp_seq=1 ttl=64 time=0.42 ms', c: C.WHITE }] },
    ], { size: 20, title: 'kali@kali: ~' });
    h.term(s, 96, 648, 1728, [
      { p: '$ ', c: 'sudo nmap -sn 192.168.56.0/24' },
      { o: [{ t: 'Nmap scan report for 192.168.56.1   ', c: C.TERMTXT }, { t: '(host)', c: C.SILVER }] },
      { o: [{ t: 'Nmap scan report for 192.168.56.101 ', c: C.TERMTXT }, { t: '(kali)', c: C.SILVER }] },
      { o: [{ t: 'Nmap scan report for 192.168.56.102 ', c: C.TERMTXT }, { t: '(target)', c: C.SKY, b: true }] },
    ], { size: 20, title: 'kali@kali: ~ · ping sweep' });
  }

  // Troubleshooting table
  {
    const s = content(TAG, 'When the lab won’t talk', 'Three failures cover almost every case. Work top to bottom: no address, then no reply, then no updates.');
    await h.table(s, 96, 256, [560, 560, 608], 150, ['SYMPTOM', 'LIKELY CAUSE', 'FIX'], [
      [{ icon: 'Ban', iconColor: C.RED, t: 'No IP address', bold: true }, 'Adapter off or DHCP disabled', { t: 'Enable adapter; turn on DHCP', color: C.TEAL, bold: true }],
      [{ icon: 'Unplug', iconColor: C.RED, t: 'Can’t ping target', bold: true }, 'VMs on different networks', { t: 'Set both to the same vboxnet0', color: C.TEAL, bold: true }],
      [{ icon: 'WifiOff', iconColor: C.RED, t: 'No internet on Kali', bold: true }, 'NAT adapter disabled', { t: 'Enable Adapter 1 = NAT', color: C.TEAL, bold: true }],
    ], { size: 22 });
    h.box(s, 96, 788, 1728, 148, { fill: C.NAVY, r: 16 });
    await h.img(s, 'Terminal', C.SKY, 140, 836, 52);
    h.t(s, 'Quick check from Kali', 212, 800, 500, 40, { font: F.SB, size: 20, color: C.WHITE, valign: 'middle' });
    s.addText([
      { text: '$ ', options: { color: C.SKY, bold: true, fontFace: F.MONO } },
      { text: 'ip a', options: { color: C.WHITE, fontFace: F.MONO } },
      { text: '   ·   ', options: { color: C.SLATE, fontFace: F.MONO } },
      { text: '$ ', options: { color: C.SKY, bold: true, fontFace: F.MONO } },
      { text: 'ping -c4 <target>', options: { color: C.WHITE, fontFace: F.MONO } },
      { text: '   ·   ', options: { color: C.SLATE, fontFace: F.MONO } },
      { text: '$ ', options: { color: C.SKY, bold: true, fontFace: F.MONO } },
      { text: 'ping -c4 kali.org', options: { color: C.WHITE, fontFace: F.MONO } },
    ], { x: P(212), y: P(844), w: P(1560), h: P(60), margin: 0, fontSize: 20, valign: 'middle', isTextBox: true });
  }

  // Lab Ready snapshot
  {
    const s = content(TAG, 'Snapshot both VMs as “Lab Ready”', 'With networking verified, snapshot each VM. From now on, revert to Lab Ready after every exercise to start from a known-good, connected state.');
    // Kali card
    h.box(s, 96, 250, 836, 500, { fill: C.WHITE, line: C.LINE, lw: 2, r: 20 });
    h.box(s, 96, 250, 836, 96, { fill: C.NAVY, r: 20 }); h.box(s, 96, 306, 836, 40, { fill: C.NAVY });
    await h.img(s, 'SquareTerminal', C.SKY, 128, 282, 44);
    h.t(s, 'Kali Linux', 188, 250, 600, 96, { font: F.SB, size: 28, color: C.WHITE, valign: 'middle' });
    // timeline inside
    h.ln(s, 180, 470, 848, 470, { color: C.LINE, w: 3 });
    const kn = [[180, 'Clean', 'done'], [410, 'Lab Ready', 'now'], [700, 'Live', 'next']];
    for (const [nx, lab, st] of kn) {
      if (st === 'now') await h.ic(s, 'Camera', nx, 470, 92, { bg: C.TEAL, k: 0.46 });
      else if (st === 'done') h.circle(s, nx, 470, 40, { fill: C.SLATE });
      else h.circle(s, nx, 470, 48, { fill: C.WHITE, line: C.SILVER, lw: 3, dash: 'dash' });
      h.t(s, lab, nx - 140, 540, 280, 40, { font: F.SB, size: 20, color: st === 'next' ? C.SLATE : C.INK, align: 'center' });
    }
    h.t(s, 'Updated · 2 adapters · verified', 136, 650, 760, 50, { size: 21, color: C.SLATE, valign: 'middle' });
    // Meta card
    h.box(s, 988, 250, 836, 500, { fill: C.WHITE, line: C.LINE, lw: 2, r: 20 });
    h.box(s, 988, 250, 836, 96, { fill: C.NAVY, r: 20 }); h.box(s, 988, 306, 836, 40, { fill: C.NAVY });
    await h.img(s, 'Target', C.RED, 1020, 282, 44);
    h.t(s, 'Metasploitable 2', 1080, 250, 600, 96, { font: F.SB, size: 28, color: C.WHITE, valign: 'middle' });
    h.ln(s, 1072, 470, 1740, 470, { color: C.LINE, w: 3 });
    const mn = [[1072, 'Imported', 'done'], [1302, 'Lab Ready', 'now'], [1592, 'Live', 'next']];
    for (const [nx, lab, st] of mn) {
      if (st === 'now') await h.ic(s, 'Camera', nx, 470, 92, { bg: C.TEAL, k: 0.46 });
      else if (st === 'done') h.circle(s, nx, 470, 40, { fill: C.SLATE });
      else h.circle(s, nx, 470, 48, { fill: C.WHITE, line: C.SILVER, lw: 3, dash: 'dash' });
      h.t(s, lab, nx - 140, 540, 280, 40, { font: F.SB, size: 20, color: st === 'next' ? C.SLATE : C.INK, align: 'center' });
    }
    h.t(s, 'Host-only · IP confirmed', 1028, 650, 760, 50, { size: 21, color: C.SLATE, valign: 'middle' });
    // banner
    h.box(s, 96, 788, 1728, 148, { fill: C.GREENT, line: C.GREEN, lw: 2, r: 16 });
    await h.ic(s, 'CircleCheck', 196, 862, 100, { bg: C.GREEN });
    h.t(s, 'Lab Ready', 300, 806, 600, 60, { font: F.SB, size: 34, color: C.INK, valign: 'middle' });
    h.t(s, 'Revert here after every exercise to start clean and connected.', 300, 866, 1400, 50, { size: 22, color: C.INK, valign: 'middle' });
  }

  await labTime(4, 'Isolate and verify the network', [
    'Confirm vboxnet0 and its DHCP server',
    'Kali: Adapter 1 NAT, Adapter 2 Host-only',
    'Metasploitable: Adapter 1 Host-only only',
    'From Kali, ping the target and sweep /24',
    'Snapshot both VMs as “Lab Ready”',
  ]);
  await takeaways(4, 'What to remember from Lesson 04', [
    { icon: 'Network', text: 'Host-only isolates the lab from your network' },
    { icon: 'Globe', text: 'NAT on a second Kali adapter brings updates' },
    { icon: 'CircleCheck', text: 'Verify, then snapshot both VMs as Lab Ready' },
  ]);
};
