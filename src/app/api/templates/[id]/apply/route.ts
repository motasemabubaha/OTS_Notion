import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const template = await prisma.page.findUnique({
    where: { id: params.id },
    include: { blocks: true },
  });

  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));

  const page = await prisma.page.create({
    data: {
      title: template.title,
      icon: template.icon,
      content: template.content as any,
      parentId: body.parentId || null,
      sortOrder: 0,
    },
  });

  if (template.blocks.length > 0) {
    await prisma.block.createMany({
      data: template.blocks.map((b) => ({
        pageId: page.id,
        type: b.type,
        content: b.content as any,
        parentId: b.parentId,
        sortOrder: b.sortOrder,
      })),
    });
  }

  return NextResponse.json(page);
}
