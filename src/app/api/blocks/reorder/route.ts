import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { blocks } = body;

  if (!blocks || !Array.isArray(blocks)) {
    return NextResponse.json({ error: 'blocks array required' }, { status: 400 });
  }

  const updates = blocks.map((b: { id: string; sortOrder: number }) =>
    prisma.block.update({
      where: { id: b.id },
      data: { sortOrder: b.sortOrder },
    })
  );

  await prisma.$transaction(updates);
  return NextResponse.json({ success: true });
}
