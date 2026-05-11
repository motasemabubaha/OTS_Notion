import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const cell = await prisma.databaseCell.update({
    where: { id: params.id },
    data: { value: body.value },
  });
  return NextResponse.json(cell);
}
