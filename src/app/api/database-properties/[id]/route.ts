import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const data: any = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.type !== undefined) data.type = body.type;
  if (body.config !== undefined) data.config = body.config;
  if (body.sortOrder !== undefined) data.sortOrder = body.sortOrder;
  if (body.isVisible !== undefined) data.isVisible = body.isVisible;
  if (body.width !== undefined) data.width = body.width;

  const property = await prisma.databaseProperty.update({
    where: { id: params.id },
    data,
  });
  return NextResponse.json(property);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.databaseProperty.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
