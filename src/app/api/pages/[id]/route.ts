import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const page = await prisma.page.findUnique({
    where: { id: params.id },
    include: {
      children: {
        where: { isArchived: false },
        orderBy: { sortOrder: 'asc' },
      },
      blocks: {
        orderBy: { sortOrder: 'asc' },
      },
      database: {
        include: {
          properties: { orderBy: { sortOrder: 'asc' } },
          rows: {
            orderBy: { sortOrder: 'asc' },
            include: {
              cells: true,
            },
          },
          views: { orderBy: { sortOrder: 'asc' } },
        },
      },
      parent: {
        select: { id: true, title: true, icon: true, parentId: true },
      },
    },
  });

  if (!page) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  return NextResponse.json(page);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const allowed = ['title', 'icon', 'cover', 'parentId', 'isFavorite', 'isArchived', 'content', 'sortOrder'];
  const data: any = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      data[key] = body[key];
    }
  }

  const page = await prisma.page.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(page);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  if (body.action === 'duplicate') {
    const original = await prisma.page.findUnique({
      where: { id: params.id },
      include: { blocks: true },
    });

    if (!original) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    const copy = await prisma.page.create({
      data: {
        title: original.title + ' (Copy)',
        icon: original.icon,
        cover: original.cover,
        parentId: original.parentId,
        content: original.content as any,
        sortOrder: original.sortOrder + 1,
      },
    });

    if (original.blocks.length > 0) {
      await prisma.block.createMany({
        data: original.blocks.map((b) => ({
          pageId: copy.id,
          type: b.type,
          content: b.content as any,
          parentId: b.parentId,
          sortOrder: b.sortOrder,
        })),
      });
    }

    return NextResponse.json(copy);
  }

  if (body.action === 'move') {
    const page = await prisma.page.update({
      where: { id: params.id },
      data: { parentId: body.targetId || null },
    });
    return NextResponse.json(page);
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.page.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
