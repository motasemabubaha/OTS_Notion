import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const db = await prisma.database.findUnique({
    where: { id: params.id },
    include: {
      properties: { orderBy: { sortOrder: 'asc' } },
      rows: {
        orderBy: { sortOrder: 'asc' },
        include: { cells: true },
      },
      views: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!db) {
    return NextResponse.json({ error: 'Database not found' }, { status: 404 });
  }

  return NextResponse.json(db);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const db = await prisma.database.update({
    where: { id: params.id },
    data: {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.activeView !== undefined && { activeView: body.activeView }),
    },
  });
  return NextResponse.json(db);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.database.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
