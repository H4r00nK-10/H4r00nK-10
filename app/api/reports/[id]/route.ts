import { NextResponse } from 'next/server';
import { reports } from '@/lib/store';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const report = reports.find((item) => item.id === params.id);
  return report ? NextResponse.json(report) : NextResponse.json({ error: 'Report not found' }, { status: 404 });
}
