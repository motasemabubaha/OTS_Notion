// Module-level slides: cover, agenda, hero, objectives, summary, safety, knowledge check, closing
const NAME = 'Mo’tasem Abu Baha’';

async function intro({ h, C, F, P, content, dark, hero }) {
  // 1. Module cover
  {
    const s = dark('assets/cover_a.jpg', 'Welcome to Module 02. By the end of today every student has a working, isolated attack lab.');
    h.t(s, '>_ PEHT · PROFESSIONAL ETHICAL HACKING TRACK', 140, 236, 1200, 34, { font: F.MONO, size: 17, bold: true, color: C.SKY, cs: 1 });
    h.t(s, 'MODULE 02', 140, 300, 800, 64, { font: F.SB, size: 30, color: C.SILVER, cs: 8 });
    h.t(s, 'Building the\nPractice Lab', 134, 384, 1100, 340, { size: 80, bold: true, color: C.WHITE, lsm: 0.95 });
    h.t(s, 'INSTRUCTOR', 140, 790, 400, 34, { font: F.SB, size: 15, color: C.SILVER, cs: 3 });
    h.t(s, NAME, 140, 826, 800, 64, { font: F.SB, size: 30, color: C.WHITE });
  }

  // 2. Agenda roadmap
  {
    const s = content('>_  MODULE 02 ROADMAP', 'Four lessons, one working lab', 'Walk the roadmap left to right. Each lesson adds one layer of the lab.');
    const xs = [312, 744, 1176, 1608], cy = 520;
    h.ln(s, xs[0], cy, xs[3], cy, { color: C.LINE, w: 3 });
    for (let i = 0; i < 3; i++) h.ln(s, xs[i] + 92, cy, xs[i + 1] - 98, cy, { color: C.TEAL, w: 3, end: 'triangle' });
    const L = [
      ['Layers', 'Preparing a Virtualization Environment'],
      ['SquareTerminal', 'Installing a Penetration Testing OS'],
      ['Target', 'Deploying Vulnerable Target Machines'],
      ['Network', 'Configuring Isolated Network Environments'],
    ];
    for (let i = 0; i < 4; i++) {
      h.t(s, '>0' + (i + 1), xs[i] - 100, 352, 200, 40, { font: F.MONO, size: 24, bold: true, color: C.TEAL, align: 'center' });
      await h.ic(s, L[i][0], xs[i], cy, 168, { bg: i === 0 ? C.TEAL : C.NAVY, k: 0.42 });
      h.t(s, L[i][1], xs[i] - 190, 640, 380, 120, { font: F.SB, size: 25, color: C.INK, align: 'center', lsm: 1.05 });
    }
  }

  // 3. The lab you will build
  {
    const s = content('>_  THE LAB YOU WILL BUILD', 'One host, two VMs, one isolated network',
      'This is the finished lab. Kali reaches the internet only through NAT for updates. Metasploitable lives only on the host-only network 192.168.56.0/24. IPs are DHCP-assigned and may differ.');
    await hero(s);
  }

  // 4. Objectives
  {
    const s = content('>_  LEARNING OBJECTIVES', 'By the end of this module, you will…');
    const items = [
      ['Cpu', 'Prepare a host for virtualization'],
      ['SquareTerminal', 'Install and update Kali Linux'],
      ['Target', 'Deploy Metasploitable 2 safely'],
      ['Network', 'Isolate lab traffic with Host-only'],
      ['ListChecks', 'Verify, snapshot and restore your VMs'],
    ];
    h.ln(s, 166, 300, 166, 860, { color: C.LINE, w: 3 });
    for (let i = 0; i < 5; i++) {
      const y = 300 + i * 140;
      await h.ic(s, items[i][0], 166, y, 96, { bg: C.TEAL, ring: C.WHITE, ringW: 6 });
      h.t(s, '+0' + (i + 1), 250, y - 40, 120, 80, { font: F.MONO, size: 20, bold: true, color: C.TEAL, valign: 'middle' });
      h.t(s, items[i][1], 360, y - 40, 1400, 80, { font: F.SB, size: 32, color: C.INK, valign: 'middle' });
    }
  }
}

async function outro({ h, C, F, P, content, dark, hero }) {
  // Module summary
  {
    const s = content('>_  MODULE SUMMARY', 'What you built, lesson by lesson', 'Point at each chip and recap the lesson that produced it.');
    await hero(s, { lessons: true });
  }

  // Lab safety rules
  {
    const s = content('>_  LAB SAFETY RULES', 'Four rules that keep your lab legal and contained');
    const rules = ['Vulnerable VMs on Host-only', 'Never bridge a target VM', 'Attack only systems you own', 'Revert targets after exercises'];
    for (let i = 0; i < 4; i++) {
      const y = 256 + i * 168;
      h.t(s, '+', 96, y, 56, 120, { font: F.MONO, size: 48, bold: true, color: C.TEAL, valign: 'middle' });
      h.t(s, rules[i], 166, y, 772, 120, { font: F.SB, size: 28, color: C.INK, valign: 'middle', lsm: 1.05 });
    }
    // isolated vs exposed visual
    const cx = 1380, cy = 590;
    h.circle(s, cx, cy, 760, { fill: C.REDT });
    h.circle(s, cx, cy, 440, { fill: C.GREENT, line: C.GREEN, lw: 3, dash: 'dash' });
    await h.ic(s, 'SquareTerminal', cx - 90, cy + 10, 110, { bg: C.NAVY });
    await h.ic(s, 'Target', cx + 90, cy + 10, 110, { bg: C.RED });
    h.ln(s, cx - 35, cy + 10, cx + 35, cy + 10, { color: C.GREEN, w: 3, begin: 'triangle', end: 'triangle' });
    h.t(s, 'ISOLATED', cx - 200, cy - 140, 400, 40, { font: F.SB, size: 24, color: C.GREEN, cs: 4, align: 'center' });
    h.t(s, 'Host-only', cx - 200, cy + 90, 400, 34, { size: 20, color: C.INK, align: 'center' });
    h.t(s, 'EXPOSED', cx - 200, cy - 340, 400, 40, { font: F.SB, size: 22, color: C.RED, cs: 4, align: 'center' });
    // threats stopped at the boundary
    const threats = [[-300, 230, 'Globe'], [300, 230, 'Wifi'], [0, 330, 'Router']];
    for (const [dx, dy, ic] of threats) {
      await h.ic(s, ic, cx + dx, cy + dy, 64, { bg: C.RED });
    }
    h.ln(s, cx - 262, cy + 200, cx - 170, cy + 140, { color: C.RED, w: 2.5, end: 'triangle' });
    h.ln(s, cx + 262, cy + 200, cx + 170, cy + 140, { color: C.RED, w: 2.5, end: 'triangle' });
    h.ln(s, cx, cy + 292, cx, cy + 236, { color: C.RED, w: 2.5, end: 'triangle' });
  }

  // Knowledge check 1: bridged target
  {
    const s = content('>_  KNOWLEDGE CHECK · 1 / 5', 'Is this lab still safe?',
      'Answer: No. Bridged puts the vulnerable VM on the real LAN, reachable by every device and potentially by attackers via the router. Fix: power off, set Adapter 1 to Host-only Adapter, revert to the Lab Ready snapshot.');
    h.t(s, 'Metasploitable’s Adapter 1 was switched to Bridged so a teammate can scan it from their laptop.', 96, 262, 800, 280, { size: 28, color: C.INK, lsm: 1.2 });
    h.t(s, 'What is the risk, and what do you change?', 96, 620, 800, 160, { font: F.SB, size: 30, color: C.TEAL, lsm: 1.1 });
    h.win(s, 980, 250, 844, 520, 'Metasploitable 2 · Settings › Network');
    h.label(s, 'Adapter 1', 1020, 330, 200, { font: F.SB });
    await h.check(s, 1020, 390, true, 'Enable Network Adapter');
    h.label(s, 'Attached to:', 1020, 470, 200);
    await h.dropdown(s, 1220, 470, 560, 'Bridged Adapter', { hl: true, hlColor: C.RED, color: C.RED, bold: true });
    h.label(s, 'Name:', 1020, 540, 200);
    await h.dropdown(s, 1220, 540, 560, 'Wi-Fi (home router)');
    await h.ic(s, 'TriangleAlert', 1060, 690, 60, { bg: C.RED, k: 0.55 });
    h.t(s, 'Target is on the home LAN', 1104, 670, 600, 40, { font: F.SB, size: 20, color: C.RED, valign: 'middle' });
  }

  // Knowledge check 2: turtle
  {
    const s = content('>_  KNOWLEDGE CHECK · 2 / 5', 'Why is every VM so slow?',
      'Answer: VirtualBox is running on top of the Windows hypervisor (Hyper-V / Virtual Machine Platform / Windows Hypervisor Platform), shown by the turtle icon. Fix: turn those features off, run bcdedit /set hypervisorlaunchtype off as admin, reboot.');
    // VM window with status bar
    h.box(s, 96, 250, 900, 620, { fill: C.WHITE, line: C.LINE, lw: 1.5, r: 14 });
    h.box(s, 96, 250, 900, 54, { fill: C.NAVY, r: 14 }); h.box(s, 96, 280, 900, 24, { fill: C.NAVY });
    h.t(s, 'Kali Linux [Running] · Oracle VirtualBox', 122, 250, 800, 54, { font: F.SB, size: 15, color: C.WHITE, valign: 'middle' });
    h.box(s, 112, 318, 868, 460, { fill: C.NAVY2 });
    await h.img(s, 'Hourglass', C.SILVER, 500, 500, 90);
    h.box(s, 112, 790, 868, 64, { fill: C.LG });
    const sb = ['HardDrive', 'Disc', 'Network', 'Usb', 'Folder', 'Monitor'];
    for (let i = 0; i < sb.length; i++) await h.img(s, sb[i], C.SLATE, 560 + i * 54, 806, 32);
    h.circle(s, 916, 822, 56, { line: C.INK, lw: 2.5 });
    await h.img(s, 'Turtle', C.INK, 896, 802, 40);
    h.ln(s, 916, 856, 916, 900, { color: C.INK, w: 2 });
    h.t(s, 'Status bar icon', 760, 900, 300, 30, { font: F.SB, size: 15, color: C.INK, align: 'right' });
    h.t(s, 'Windows 11 host. VMs crawl, and a turtle icon appears in the VM status bar.', 1080, 262, 744, 260, { size: 28, color: C.INK, lsm: 1.2 });
    h.t(s, 'What is the cause, and how do you fix it?', 1080, 560, 744, 160, { font: F.SB, size: 30, color: C.TEAL, lsm: 1.1 });
  }

  // Knowledge check 3: no internet on Kali
  {
    const s = content('>_  KNOWLEDGE CHECK · 3 / 5', 'Where did Kali’s internet go?',
      'Answer: Check Kali Adapter 1. It must be enabled and attached to NAT (cable connected). Host-only still works, which is why ping succeeds, but host-only has no route to the internet.');
    h.t(s, 'Kali pings Metasploitable fine, but package updates fail.', 96, 248, 1728, 50, { size: 28, color: C.INK });
    h.t(s, 'Which adapter do you check first, and why?', 96, 306, 1728, 50, { font: F.SB, size: 28, color: C.TEAL });
    h.term(s, 96, 424, 1728, [
      { p: '$ ', c: 'ping -c 1 192.168.56.102' },
      { o: '1 packets transmitted, 1 received, 0% packet loss, time 0ms' },
    ], { size: 18, title: 'kali@kali: ~' });
    h.term(s, 96, 650, 1728, [
      { p: '$ ', c: 'sudo apt update' },
      { o: [{ t: 'Err:1 http://http.kali.org/kali kali-rolling InRelease', c: C.SKY }] },
      { o: [{ t: "  Temporary failure resolving 'http.kali.org'", c: C.SKY }] },
    ], { size: 18, title: 'kali@kali: ~' });
  }

  // Knowledge check 4: snapshot recovery
  {
    const s = content('>_  KNOWLEDGE CHECK · 4 / 5', 'What is the fastest way back?',
      'Answer: Power off Kali, open Snapshots, select Clean Install and Restore. Optionally keep a snapshot of the broken state first. Takes seconds, no reinstall.');
    h.win(s, 96, 250, 860, 600, 'Kali Linux · Snapshots');
    const items = [
      { y: 346, x: 140, icon: 'Camera', text: 'Clean Install', sub: 'Updated, password changed', col: C.TEAL },
      { y: 476, x: 200, icon: 'Camera', text: 'Lab Ready', sub: 'Adapters set, verified', col: C.TEAL },
      { y: 606, x: 260, icon: 'TriangleAlert', text: 'Current State', sub: 'Desktop broke after a tool install', col: C.RED },
    ];
    h.ln(s, 166, 388, 166, 498, { color: C.SILVER, w: 1.5 }); h.ln(s, 166, 498, 200, 498, { color: C.SILVER, w: 1.5 });
    h.ln(s, 226, 518, 226, 628, { color: C.SILVER, w: 1.5 }); h.ln(s, 226, 628, 260, 628, { color: C.SILVER, w: 1.5 });
    for (const it of items) {
      await h.ic(s, it.icon, it.x + 28, it.y + 24, 52, { bg: it.col, k: 0.52 });
      h.t(s, it.text, it.x + 74, it.y - 10, 540, 38, { font: F.SB, size: 23, color: C.INK, valign: 'middle' });
      h.t(s, it.sub, it.x + 74, it.y + 30, 540, 30, { size: 16, color: C.SLATE, valign: 'middle' });
    }
    h.box(s, 140, 730, 120, 44, { fill: C.LG, r: 8 }); h.t(s, 'Take', 140, 730, 120, 44, { size: 16, align: 'center', valign: 'middle' });
    h.box(s, 276, 730, 120, 44, { fill: C.LG, r: 8 }); h.t(s, 'Delete', 276, 730, 120, 44, { size: 16, align: 'center', valign: 'middle' });
    h.box(s, 412, 730, 120, 44, { fill: C.LG, r: 8 }); h.t(s, 'Restore', 412, 730, 120, 44, { size: 16, align: 'center', valign: 'middle' });
    h.t(s, 'A tool install broke Kali’s desktop. You snapshotted it after the first update.', 1060, 262, 764, 260, { size: 28, color: C.INK, lsm: 1.2 });
    h.t(s, 'How do you recover in under a minute?', 1060, 560, 764, 160, { font: F.SB, size: 30, color: C.TEAL, lsm: 1.1 });
  }

  // Knowledge check 5: target missing from sweep
  {
    const s = content('>_  KNOWLEDGE CHECK · 5 / 5', 'Where is the target?',
      'Answer (any two): Metasploitable is powered on and booted; its Adapter 1 is Host-only on the SAME host-only network as Kali eth1; the adapter is enabled and cable connected; Metasploitable got a DHCP lease (ifconfig shows 192.168.56.x); the DHCP server is enabled.');
    h.t(s, 'Kali’s ping sweep finds the host adapter, but no Metasploitable.', 96, 262, 720, 260, { size: 28, color: C.INK, lsm: 1.2 });
    h.t(s, 'Name two things you check first.', 96, 620, 720, 120, { font: F.SB, size: 30, color: C.TEAL, lsm: 1.1 });
    h.term(s, 860, 300, 964, [
      { p: '$ ', c: 'sudo nmap -sn 192.168.56.0/24' },
      { o: 'Nmap scan report for 192.168.56.1' },
      { o: 'Nmap scan report for 192.168.56.101' },
      { o: [{ t: '# 192.168.56.102 missing', c: C.SKY, b: true }] },
    ], { size: 18, title: 'kali@kali: ~' });
  }

  // Closing
  {
    const s = dark('assets/cover_b.jpg', 'Close: Module 03 builds on this lab. Students must keep the Lab Ready snapshots.');
    h.t(s, '>_ PEHT · MODULE 02 COMPLETE', 140, 300, 1200, 34, { font: F.MONO, size: 17, bold: true, color: C.SKY, cs: 1 });
    s.addText([
      { text: 'Next: ', options: { color: C.WHITE } },
      { text: 'Module 03', options: { color: C.SKY } },
    ], { x: P(134), y: P(360), w: P(1400), h: P(200), margin: 0, fontFace: F.R, bold: true, fontSize: 96, valign: 'middle', isTextBox: true });
    h.t(s, 'INSTRUCTOR', 140, 640, 400, 28, { font: F.SB, size: 15, color: C.SILVER, cs: 3 });
    h.t(s, NAME, 140, 670, 800, 50, { font: F.SB, size: 30, color: C.WHITE });
  }
}

module.exports = { intro, outro };
