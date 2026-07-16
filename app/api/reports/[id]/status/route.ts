import { NextResponse } from 'next/server';
import { reports } from '@/lib/store';
import { statuses } from '@/lib/types';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { status } = await req.json();
  if (!statuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const report = reports.find((item) => item.id === params.id);
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  report.status = status;
  return NextResponse.json(report);
}
