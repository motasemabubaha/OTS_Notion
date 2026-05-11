import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pageId, type, content, parentId, sortOrder } = body;

  const block = await prisma.block.create({
    data: {
      pageId,
      type: type || 'paragraph',
      content: content || {},
      parentId: parentId || null,
      sortOrder: sortOrder || 0,
    },
  });

  return NextResponse.json(block);
}
