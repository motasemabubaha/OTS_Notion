import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { pageId, name } = body;

  const database = await prisma.database.create({
    data: {
      pageId,
      name: name || 'Untitled Database',
      properties: {
        create: [
          { name: 'Name', type: 'text', sortOrder: 0, width: 250 },
          { name: 'Status', type: 'select', sortOrder: 1, config: { options: [
            { label: 'Not Started', color: '#9b9a97' },
            { label: 'In Progress', color: '#f2994a' },
            { label: 'Done', color: '#27ae60' },
          ]}},
          { name: 'Tags', type: 'multi_select', sortOrder: 2, config: { options: [] }},
        ],
      },
      views: {
        create: [
          { name: 'Table', type: 'table', sortOrder: 0, config: {} },
        ],
      },
    },
    include: {
      properties: true,
      rows: { include: { cells: true } },
      views: true,
    },
  });

  return NextResponse.json(database);
}
