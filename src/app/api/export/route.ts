import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { toMarkdown, toHtml } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pageId, format } = body;

  const page = await prisma.page.findUnique({
    where: { id: pageId },
  });

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const content = page.content as any;

  if (format === 'markdown' || format === 'md') {
    const md = `# ${page.title}\n\n` + toMarkdown(content);
    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(page.title)}.md"`,
      },
    });
  }

  if (format === 'html') {
    const html = toHtml(content);
    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(page.title)}.html"`,
      },
    });
  }

  return NextResponse.json({ error: 'Unsupported format. Use: markdown, html' }, { status: 400 });
}
