import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const templates = await prisma.page.findMany({
    where: { isTemplate: true, isArchived: false },
    select: {
      id: true,
      title: true,
      icon: true,
      templateCat: true,
      content: true,
      createdAt: true,
    },
    orderBy: [{ templateCat: 'asc' }, { title: 'asc' }],
  });

  return NextResponse.json(templates);
}
