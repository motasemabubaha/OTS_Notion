import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { databaseId, name, type, config } = body;

  const maxSort = await prisma.databaseView.aggregate({
    _max: { sortOrder: true },
    where: { databaseId },
  });

  const view = await prisma.databaseView.create({
    data: {
      databaseId,
      name: name || 'New View',
      type: type || 'table',
      config: config || {},
      sortOrder: (maxSort._max.sortOrder || 0) + 1,
    },
  });

  return NextResponse.json(view);
}
