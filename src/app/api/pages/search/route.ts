import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const query = q.trim();

  const pages = await prisma.page.findMany({
    where: {
      isArchived: false,
      isTemplate: false,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      title: true,
      icon: true,
      updatedAt: true,
      parentId: true,
    },
    take: 20,
    orderBy: { updatedAt: 'desc' },
  });

  const blocks = await prisma.block.findMany({
    where: {
      page: { isArchived: false, isTemplate: false },
      content: { path: ['text'], string_contains: query },
    },
    select: {
      id: true,
      pageId: true,
      type: true,
      content: true,
      page: {
        select: { id: true, title: true, icon: true },
      },
    },
    take: 20,
  });

  return NextResponse.json({ pages, blocks });
}
