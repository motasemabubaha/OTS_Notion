import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeTemplates = searchParams.get('templates') === 'true';
  const parentId = searchParams.get('parentId');

  const where: any = {
    isArchived: false,
    isTemplate: includeTemplates ? true : false,
  };

  if (parentId === 'root' || (!parentId && !includeTemplates)) {
    where.parentId = null;
    where.isTemplate = false;
  } else if (parentId) {
    where.parentId = parentId;
  }

  const pages = await prisma.page.findMany({
    where,
    include: {
      children: {
        where: { isArchived: false, isTemplate: false },
        orderBy: { sortOrder: 'asc' },
        include: {
          children: {
            where: { isArchived: false, isTemplate: false },
            orderBy: { sortOrder: 'asc' },
            include: {
              children: {
                where: { isArchived: false, isTemplate: false },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      },
      database: {
        select: { id: true, name: true, activeView: true },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, parentId, icon, content, isTemplate, templateCat } = body;

  const maxSort = await prisma.page.aggregate({
    _max: { sortOrder: true },
    where: { parentId: parentId || null },
  });

  const page = await prisma.page.create({
    data: {
      title: title || 'Untitled',
      parentId: parentId || null,
      icon: icon || null,
      content: content || null,
      isTemplate: isTemplate || false,
      templateCat: templateCat || null,
      sortOrder: (maxSort._max.sortOrder || 0) + 1,
    },
  });

  return NextResponse.json(page);
}
