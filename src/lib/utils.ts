export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function debounce<T extends (...args: any[]) => any>(fn: T, ms: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(date: string | Date) {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function extractTextFromContent(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;

  let text = '';
  if (content.type === 'doc' && content.content) {
    for (const node of content.content) {
      text += extractTextFromNode(node) + ' ';
    }
  }
  return text.trim();
}

function extractTextFromNode(node: any): string {
  if (!node) return '';
  let text = '';
  if (node.text) text += node.text;
  if (node.content) {
    for (const child of node.content) {
      text += extractTextFromNode(child);
    }
  }
  return text;
}

export function toMarkdown(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;

  let md = '';
  if (content.type === 'doc' && content.content) {
    for (const node of content.content) {
      md += nodeToMarkdown(node);
    }
  }
  return md;
}

function nodeToMarkdown(node: any): string {
  if (!node) return '';

  switch (node.type) {
    case 'paragraph':
      return getInlineText(node) + '\n\n';
    case 'heading':
      const level = node.attrs?.level || 1;
      return '#'.repeat(level) + ' ' + getInlineText(node) + '\n\n';
    case 'bulletList':
      return (node.content || []).map((li: any) => '- ' + getInlineText(li)).join('\n') + '\n\n';
    case 'orderedList':
      return (node.content || []).map((li: any, i: number) => `${i + 1}. ` + getInlineText(li)).join('\n') + '\n\n';
    case 'taskList':
      return (node.content || []).map((li: any) => {
        const checked = li.attrs?.checked ? 'x' : ' ';
        return `- [${checked}] ` + getInlineText(li);
      }).join('\n') + '\n\n';
    case 'codeBlock':
      const lang = node.attrs?.language || '';
      return '```' + lang + '\n' + getInlineText(node) + '\n```\n\n';
    case 'blockquote':
      return '> ' + getInlineText(node) + '\n\n';
    case 'horizontalRule':
      return '---\n\n';
    case 'table':
      return tableToMarkdown(node) + '\n\n';
    default:
      return getInlineText(node);
  }
}

function getInlineText(node: any): string {
  if (!node) return '';
  if (node.text) {
    let text = node.text;
    if (node.marks) {
      for (const mark of node.marks) {
        if (mark.type === 'bold') text = `**${text}**`;
        if (mark.type === 'italic') text = `*${text}*`;
        if (mark.type === 'code') text = '`' + text + '`';
        if (mark.type === 'strike') text = `~~${text}~~`;
        if (mark.type === 'link') text = `[${text}](${mark.attrs?.href || ''})`;
      }
    }
    return text;
  }
  if (node.content) {
    return node.content.map((c: any) => getInlineText(c)).join('');
  }
  return '';
}

function tableToMarkdown(node: any): string {
  if (!node.content) return '';
  const rows = node.content.map((row: any) =>
    (row.content || []).map((cell: any) => getInlineText(cell))
  );
  if (rows.length === 0) return '';

  let md = '| ' + rows[0].join(' | ') + ' |\n';
  md += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
  for (let i = 1; i < rows.length; i++) {
    md += '| ' + rows[i].join(' | ') + ' |\n';
  }
  return md;
}

export function toHtml(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;

  let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Export</title>';
  html += '<style>body{font-family:sans-serif;max-width:800px;margin:0 auto;padding:20px;background:#191919;color:#e0e0e0}';
  html += 'pre{background:#2b2b2b;padding:16px;border-radius:4px;overflow-x:auto}';
  html += 'code{background:#2b2b2b;padding:2px 4px;border-radius:2px}';
  html += 'table{border-collapse:collapse;width:100%}th,td{border:1px solid #444;padding:8px;text-align:left}';
  html += 'blockquote{border-left:3px solid #555;margin-left:0;padding-left:16px;color:#999}</style></head><body>';

  if (content.type === 'doc' && content.content) {
    for (const node of content.content) {
      html += nodeToHtml(node);
    }
  }

  html += '</body></html>';
  return html;
}

function nodeToHtml(node: any): string {
  if (!node) return '';
  switch (node.type) {
    case 'paragraph':
      return `<p>${inlineToHtml(node)}</p>`;
    case 'heading':
      const l = node.attrs?.level || 1;
      return `<h${l}>${inlineToHtml(node)}</h${l}>`;
    case 'bulletList':
      return `<ul>${(node.content || []).map((li: any) => `<li>${inlineToHtml(li)}</li>`).join('')}</ul>`;
    case 'orderedList':
      return `<ol>${(node.content || []).map((li: any) => `<li>${inlineToHtml(li)}</li>`).join('')}</ol>`;
    case 'taskList':
      return `<ul style="list-style:none;padding-left:0">${(node.content || []).map((li: any) => {
        const checked = li.attrs?.checked ? 'checked' : '';
        return `<li><input type="checkbox" ${checked} disabled> ${inlineToHtml(li)}</li>`;
      }).join('')}</ul>`;
    case 'codeBlock':
      return `<pre><code>${inlineToHtml(node)}</code></pre>`;
    case 'blockquote':
      return `<blockquote>${inlineToHtml(node)}</blockquote>`;
    case 'horizontalRule':
      return '<hr>';
    case 'table':
      let t = '<table>';
      (node.content || []).forEach((row: any, i: number) => {
        t += '<tr>';
        (row.content || []).forEach((cell: any) => {
          const tag = i === 0 ? 'th' : 'td';
          t += `<${tag}>${inlineToHtml(cell)}</${tag}>`;
        });
        t += '</tr>';
      });
      t += '</table>';
      return t;
    case 'image':
      return `<img src="${node.attrs?.src || ''}" alt="${node.attrs?.alt || ''}" style="max-width:100%">`;
    default:
      return inlineToHtml(node);
  }
}

function inlineToHtml(node: any): string {
  if (!node) return '';
  if (node.text) {
    let t = escapeHtml(node.text);
    if (node.marks) {
      for (const m of node.marks) {
        if (m.type === 'bold') t = `<strong>${t}</strong>`;
        if (m.type === 'italic') t = `<em>${t}</em>`;
        if (m.type === 'code') t = `<code>${t}</code>`;
        if (m.type === 'strike') t = `<s>${t}</s>`;
        if (m.type === 'underline') t = `<u>${t}</u>`;
        if (m.type === 'link') t = `<a href="${escapeHtml(m.attrs?.href || '')}">${t}</a>`;
      }
    }
    return t;
  }
  if (node.content) return node.content.map((c: any) => inlineToHtml(c)).join('');
  return '';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
