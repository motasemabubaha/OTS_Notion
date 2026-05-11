import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { databaseId } = body;

  const maxSort = await prisma.databaseRow.aggregate({
    _max: { sortOrder: true },
    where: { databaseId },
  });

  const properties = await prisma.databaseProperty.findMany({
    where: { databaseId },
    orderBy: { sortOrder: 'asc' },
  });

  const row = await prisma.databaseRow.create({
    data: {
      databaseId,
      sortOrder: (maxSort._max.sortOrder || 0) + 1,
      cells: {
        create: properties.map((p) => ({
          propertyId: p.id,
          value: p.type === 'checkbox' ? { checked: false } : { text: '' },
        })),
      },
    },
    include: { cells: true },
  });

  return NextResponse.json(row);
}
