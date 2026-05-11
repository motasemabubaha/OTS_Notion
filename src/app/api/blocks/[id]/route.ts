import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const block = await prisma.block.update({
    where: { id: params.id },
    data: {
      ...(body.type !== undefined && { type: body.type }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      ...(body.parentId !== undefined && { parentId: body.parentId }),
    },
  });
  return NextResponse.json(block);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.block.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
