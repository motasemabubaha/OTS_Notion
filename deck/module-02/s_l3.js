// Lesson 03: Deploying Vulnerable Target Machines
module.exports = async ({ h, C, F, P, content, lessonCover, labTime, takeaways }) => {
  const TAG = '>03  DEPLOYING VULNERABLE TARGET MACHINES';
  lessonCover(3, 'Deploying Vulnerable Target Machines', 'assets/cover_d.jpg');

  // Why vulnerable machines
  {
    const s = content(TAG, 'Why attack a machine built to be broken?', 'Scanning or exploiting systems without written authorization is a crime in most countries. Intentionally vulnerable VMs give you known, documented flaws you are allowed to attack, and you can reset them in seconds.');
    const cards = [
      { x: 96, fill: C.REDT, col: C.RED, icon: 'Ban', t: 'Systems you don’t own', s: 'Illegal without written permission', mini: [['Building2', 'Employer'], ['Globe', 'Websites'], ['Wifi', 'Wi-Fi']] },
      { x: 1024, fill: C.GREENT, col: C.GREEN, icon: 'ShieldCheck', t: 'Your vulnerable VM', s: 'Legal, isolated, resettable', mini: [['Target', 'Known flaws'], ['Network', 'Host-only'], ['RotateCcw', 'Snapshots']] },
    ];
    for (const c of cards) {
      h.box(s, c.x, 236, 800, 700, { fill: c.fill, r: 22 });
      await h.ic(s, c.icon, c.x + 110, 340, 124, { bg: c.col, k: 0.46 });
      h.t(s, c.t, c.x + 56, 428, 700, 90, { font: F.SB, size: 32, color: C.INK, valign: 'top', lsm: 1.0 });
      h.t(s, c.s, c.x + 56, 560, 700, 50, { size: 23, color: C.INK, valign: 'middle' });
      for (let i = 0; i < 3; i++) {
        const mx = c.x + 56 + i * 236;
        h.box(s, mx, 640, 216, 220, { fill: C.WHITE, r: 16 });
        await h.img(s, c.mini[i][0], c.col, mx + 76, 680, 64);
        h.t(s, c.mini[i][1], mx, 770, 216, 50, { font: F.SB, size: 19, color: C.INK, align: 'center', valign: 'middle' });
      }
    }
    h.circle(s, 960, 586, 104, { fill: C.NAVY, line: C.WHITE, lw: 6 });
    h.t(s, 'vs', 908, 534, 104, 104, { font: F.SB, size: 28, color: C.WHITE, align: 'center', valign: 'middle' });
  }

  // Metasploitable profile
  {
    const s = content(TAG, 'Meet Metasploitable 2', 'Released by Rapid7 (the Metasploit team) in 2012 as a training target. Based on Ubuntu 8.04, 32-bit, shipped as a VMware VMDK that VirtualBox opens directly.');
    h.box(s, 96, 236, 1728, 700, { fill: C.LG, r: 24 });
    h.box(s, 96, 236, 660, 700, { fill: C.NAVY, r: 24 });
    h.box(s, 640, 236, 116, 700, { fill: C.NAVY });
    await h.ic(s, 'Target', 426, 440, 200, { bg: C.RED, k: 0.48 });
    h.t(s, 'Metasploitable 2', 116, 586, 600, 70, { size: 38, bold: true, color: C.WHITE, align: 'center', valign: 'middle' });
    h.box(s, 206, 694, 440, 56, { fill: C.RED, r: 28 });
    h.t(s, 'VULNERABLE BY DESIGN', 206, 694, 440, 56, { font: F.MONO, size: 16, bold: true, color: C.WHITE, align: 'center', valign: 'middle' });
    const rows = [
      ['Building2', 'PUBLISHER', 'Rapid7'],
      ['Server', 'BASE OS', 'Ubuntu 8.04 LTS'],
      ['Cpu', 'ARCHITECTURE', '32-bit (x86)'],
      ['HardDrive', 'DISK FORMAT', 'VMDK (VMware disk)'],
      ['KeyRound', 'DEFAULT LOGIN', 'msfadmin / msfadmin', true],
    ];
    for (let i = 0; i < rows.length; i++) {
      const y = 262 + i * 132;
      await h.ic(s, rows[i][0], 856, y + 62, 76, { bg: C.TEAL });
      h.t(s, rows[i][1], 926, y + 14, 600, 34, { font: F.SB, size: 15, color: C.SLATE, cs: 2, valign: 'middle' });
      h.t(s, rows[i][2], 926, y + 48, 860, 60, { font: rows[i][3] ? F.MONO : F.SB, size: rows[i][3] ? 26 : 30, bold: !!rows[i][3], color: C.INK, valign: 'middle' });
      if (i < rows.length - 1) h.ln(s, 816, y + 128, 1784, y + 128, { color: C.LINE, w: 1 });
    }
  }

  // Deploy flow
  {
    const s = content(TAG, 'Deploy it in VirtualBox', 'Extract the download: the folder holds Metasploitable.vmdk. In New VM, skip the ISO, choose Linux / Ubuntu (32-bit), and attach the existing disk. Set the network to Host-only before first boot.');
    const steps = [
      'Download and extract the zip',
      'New VM: Linux, Ubuntu (32-bit)',
      'Memory: 512 MB – 1 GB',
      'Use existing disk: Metasploitable.vmdk',
      'Adapter 1 → Host-only',
      'Boot it',
    ];
    h.ln(s, 132, 300, 132, 300 + 5 * 118, { color: C.LINE, w: 3 });
    for (let i = 0; i < 6; i++) {
      const y = 300 + i * 118;
      h.badge(s, i + 1, 132, y, 60, { size: 21, fill: i === 4 ? C.GREEN : C.TEAL });
      h.t(s, steps[i], 192, y - 50, 640, 100, { font: F.M, size: 23, color: C.INK, valign: 'middle' });
    }
    // wizard mock (expert mode)
    const X = 880, Y = 236, W = 944;
    h.win(s, X, Y, W, 700, 'Create Virtual Machine');
    const lab = (t, y) => h.label(s, t, X + 40, y, 220, { color: C.SLATE });
    lab('Name', Y + 82); h.input(s, X + 264, Y + 82, 596, 'Metasploitable2');
    lab('Type', Y + 142); await h.dropdown(s, X + 264, Y + 142, 596, 'Linux', { hl: true });
    lab('Version', Y + 202); await h.dropdown(s, X + 264, Y + 202, 596, 'Ubuntu (32-bit)', { hl: true });
    lab('Base Memory', Y + 278);
    h.box(s, X + 264, Y + 298, 410, 6, { fill: C.LINE, r: 3 });
    h.box(s, X + 264, Y + 298, 120, 6, { fill: C.TEAL, r: 3 });
    h.circle(s, X + 384, Y + 301, 26, { fill: C.WHITE, line: C.TEAL, lw: 3 });
    h.input(s, X + 712, Y + 278, 148, '1024 MB', { hl: true });
    lab('Hard Disk', Y + 356);
    h.radio(s, X + 264, Y + 352, false, 'Do Not Add a Virtual Hard Disk', { w: 560 });
    h.radio(s, X + 264, Y + 408, false, 'Create a Virtual Hard Disk Now', { w: 560 });
    h.radio(s, X + 264, Y + 464, true, 'Use an Existing Virtual Hard Disk File', { w: 600 });
    await h.dropdown(s, X + 304, Y + 524, 556, 'Metasploitable.vmdk', { hl: true, mono: true });
    h.box(s, X + W - 330, Y + 616, 140, 50, { fill: C.TEAL, r: 8 }); h.t(s, 'Finish', X + W - 330, Y + 616, 140, 50, { font: F.SB, size: 17, color: C.WHITE, align: 'center', valign: 'middle' });
    h.box(s, X + W - 176, Y + 616, 140, 50, { fill: C.LG, r: 8 }); h.t(s, 'Cancel', X + W - 176, Y + 616, 140, 50, { size: 17, color: C.INK, align: 'center', valign: 'middle' });
    h.badge(s, 2, X + 900, Y + 194, 40, { size: 15 });
    h.badge(s, 3, X + 900, Y + 300, 40, { size: 15 });
    h.badge(s, 4, X + 900, Y + 548, 40, { size: 15 });
  }

  // Services table
  {
    const s = content(TAG, 'What is listening on the target?', 'Versions as reported by a service scan of a default Metasploitable 2. The two red-marked releases are the well-documented backdoored builds you will study in Module 03.');
    const cols = [228, 190, 422];
    const head = ['PORT', 'SERVICE', 'VERSION'];
    const port = (p) => ({ t: p, font: F.MONO, bold: true, color: C.TEAL });
    await h.table(s, 96, 250, cols, 112, head, [
      [port('21'), 'FTP', { t: 'vsftpd 2.3.4', dot: C.RED, bold: true }],
      [port('22'), 'SSH', 'OpenSSH 4.7p1'],
      [port('23'), 'Telnet', 'Linux telnetd'],
      [port('80'), 'HTTP', 'Apache 2.2.8'],
    ], { size: 21 });
    await h.table(s, 984, 250, cols, 112, head, [
      [port('139/445'), 'SMB', 'Samba smbd 3.0.20'],
      [port('3306'), 'MySQL', 'MySQL 5.0.51a'],
      [port('5432'), 'Postgres', 'PostgreSQL 8.3'],
      [port('6667'), 'IRC', { t: 'UnrealIRCd 3.2.8.1', dot: C.RED, bold: true }],
    ], { size: 21 });
    h.circle(s, 112, 820, 18, { fill: C.RED });
    h.t(s, 'Known backdoored release', 138, 796, 700, 48, { size: 20, color: C.INK, valign: 'middle' });
    h.term(s, 984, 790, 840, [{ p: '$ ', c: 'sudo nmap -sV 192.168.56.102' }], { size: 18, title: 'Module 03 preview' });
  }

  // Web apps
  {
    const s = content(TAG, 'Five web apps waiting on port 80', 'Browse to the target IP from Kali. DVWA and Mutillidae walk through the OWASP Top 10; phpMyAdmin and TWiki are old, exploitable builds; WebDAV accepts file uploads.');
    const apps = [
      ['ShieldAlert', 'DVWA', 'Damn Vulnerable Web App', 'admin / password'],
      ['Bug', 'Mutillidae', 'OWASP practice targets', '/mutillidae'],
      ['Database', 'phpMyAdmin', 'MySQL web console', '/phpMyAdmin'],
      ['BookOpen', 'TWiki', 'Legacy wiki platform', '/twiki'],
      ['FolderOpen', 'WebDAV', 'File upload directory', '/dav'],
    ];
    const w = (1728 - 4 * 30) / 5;
    for (let i = 0; i < 5; i++) {
      const x = 96 + i * (w + 30), y = 250;
      h.box(s, x, y, w, 620, { fill: C.WHITE, line: C.LINE, lw: 2, r: 18 });
      await h.ic(s, apps[i][0], x + w / 2, y + 110, 108, { bg: C.TEAL });
      h.t(s, apps[i][1], x + 16, y + 190, w - 32, 60, { font: F.SB, size: 25, color: C.INK, align: 'center', valign: 'middle' });
      h.t(s, apps[i][2], x + 20, y + 256, w - 40, 110, { size: 19, color: C.SLATE, align: 'center', lsm: 1.05 });
      h.box(s, x + 20, y + 500, w - 40, 96, { fill: C.LG, r: 12 });
      h.t(s, apps[i][3], x + 26, y + 500, w - 52, 96, { font: F.MONO, size: 15, bold: true, color: C.TEAL, align: 'center', valign: 'middle' });
    }
  }

  // First login terminal
  {
    const s = content(TAG, 'First login: find the target’s IP', 'Log in at the console as msfadmin / msfadmin. Metasploitable 2 predates the ip command, so use ifconfig. Read the inet addr on eth0 — that is the address Kali will attack.');
    h.term(s, 96, 250, 1728, [
      { o: [{ t: 'metasploitable login: ', c: C.SILVER }, { t: 'msfadmin', c: C.WHITE, b: true }] },
      { o: [{ t: 'Password: ', c: C.SILVER }] },
      { p: '$ ', c: 'ifconfig eth0' },
      { o: [{ t: '          inet addr:', c: C.TERMTXT }, { t: '192.168.56.102', c: C.SKY, b: true }, { t: '  Bcast:192.168.56.255', c: C.TERMTXT }] },
    ], { size: 22, title: 'Metasploitable 2 · console' });
    h.box(s, 96, 700, 844, 196, { fill: C.LG, r: 16 });
    await h.ic(s, 'Terminal', 196, 798, 108, { bg: C.NAVY });
    h.t(s, 'ifconfig, not ip', 300, 726, 600, 50, { font: F.SB, size: 28, color: C.INK, valign: 'middle' });
    h.t(s, 'Ubuntu 8.04 has no iproute2 ip tool', 300, 784, 600, 80, { size: 21, color: C.SLATE, lsm: 1.05 });
    h.box(s, 980, 700, 844, 196, { fill: C.TEALT, r: 16 });
    await h.ic(s, 'Crosshair', 1080, 798, 108, { bg: C.TEAL });
    h.t(s, 'Note this IP', 1184, 726, 600, 50, { font: F.SB, size: 28, color: C.INK, valign: 'middle' });
    h.t(s, 'Your target address for every scan', 1184, 784, 600, 80, { size: 21, color: C.SLATE, lsm: 1.05 });
  }

  // Warning: never expose
  {
    const s = content(TAG, 'Never put this VM on the internet', 'Metasploitable has unauthenticated remote code execution out of the box. On a Bridged or NAT adapter it is reachable by other devices and can be compromised within minutes. Host-only keeps it reachable only from your Kali VM.');
    h.box(s, 96, 240, 1728, 352, { fill: C.REDT, line: C.RED, lw: 2.5, r: 20 });
    await h.ic(s, 'TriangleAlert', 262, 416, 176, { bg: C.RED, k: 0.5 });
    h.t(s, 'DANGER', 430, 288, 700, 40, { font: F.SB, size: 22, color: C.RED, cs: 4, valign: 'middle' });
    h.t(s, 'Keep Metasploitable on Host-only', 430, 332, 1360, 110, { font: F.SB, size: 44, color: C.INK, valign: 'middle' });
    h.t(s, 'Never Bridged. Never NAT. Never a real network.', 430, 466, 1360, 70, { size: 28, color: C.INK, valign: 'middle' });
    const bad = [['Globe', 'Bridged', 'On your real LAN'], ['Cable', 'NAT', 'Routes to the internet']];
    for (let i = 0; i < 2; i++) {
      const x = 96 + i * 440;
      h.box(s, x, 640, 408, 296, { fill: C.WHITE, line: C.RED, lw: 2, r: 18 });
      await h.ic(s, bad[i][0], x + 86, 712, 88, { bg: C.RED });
      h.t(s, bad[i][1], x + 152, 672, 240, 46, { font: F.SB, size: 28, color: C.INK, valign: 'middle' });
      h.t(s, bad[i][2], x + 152, 724, 240, 70, { size: 19, color: C.SLATE, valign: 'top', lsm: 1.05 });
      h.ln(s, x + 28, 848, x + 380, 848, { color: C.REDT, w: 1.5 });
      h.t(s, 'Exposed', x + 28, 862, 240, 50, { font: F.SB, size: 20, color: C.RED, valign: 'middle' });
      await h.img(s, 'X', C.RED, x + 332, 866, 44);
    }
    h.box(s, 1016, 640, 808, 296, { fill: C.GREENT, line: C.GREEN, lw: 2.5, r: 18 });
    await h.ic(s, 'ShieldCheck', 1110, 724, 96, { bg: C.GREEN });
    h.t(s, 'Host-only', 1210, 672, 580, 50, { font: F.SB, size: 34, color: C.INK, valign: 'middle' });
    h.t(s, 'Reachable only from Kali', 1210, 740, 580, 48, { size: 22, color: C.INK, valign: 'middle' });
    h.ln(s, 1048, 848, 1792, 848, { color: C.GREENT, w: 1.5 });
    h.t(s, 'Isolated', 1048, 862, 400, 50, { font: F.SB, size: 20, color: C.GREEN, valign: 'middle' });
    await h.img(s, 'Check', C.GREEN, 1744, 866, 44);
  }

  await labTime(3, 'Stand up the target', [
    'Download and extract Metasploitable 2',
    'Create the VM with the existing VMDK',
    'Set Adapter 1 to Host-only',
    'Boot and log in: msfadmin / msfadmin',
    'Run ifconfig and note the IP',
  ]);
  await takeaways(3, 'What to remember from Lesson 03', [
    { icon: 'Target', text: 'Vulnerable VMs are legal, resettable targets' },
    { icon: 'HardDrive', text: 'Attach the VMDK; don’t create a new disk' },
    { icon: 'ShieldAlert', text: 'Host-only only — never Bridged or NAT' },
  ]);
};
