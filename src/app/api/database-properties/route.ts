import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { databaseId, name, type, config } = body;

  const maxSort = await prisma.databaseProperty.aggregate({
    _max: { sortOrder: true },
    where: { databaseId },
  });

  const property = await prisma.databaseProperty.create({
    data: {
      databaseId,
      name: name || 'Property',
      type: type || 'text',
      config: config || {},
      sortOrder: (maxSort._max.sortOrder || 0) + 1,
    },
  });

  const rows = await prisma.databaseRow.findMany({
    where: { databaseId },
  });

  if (rows.length > 0) {
    await prisma.databaseCell.createMany({
      data: rows.map((row) => ({
        rowId: row.id,
        propertyId: property.id,
        value: type === 'checkbox' ? { checked: false } : { text: '' },
      })),
    });
  }

  return NextResponse.json(property);
}
