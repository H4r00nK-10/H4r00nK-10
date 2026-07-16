import { NextResponse } from 'next/server';
import { reports, nearbyDuplicate, confidenceFor } from '@/lib/store';
import { reportSchema } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ data: reports, insights: buildInsights() });
}

export async function POST(req: Request) {
  const parsed = reportSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid report payload', issues: parsed.error.flatten() }, { status: 400 });
  }

  const duplicate = nearbyDuplicate(parsed.data);
  const report = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...parsed.data,
    communityConfidence: parsed.data.communityConfidence ?? confidenceFor(parsed.data),
    duplicateOf: duplicate?.id,
  };

  reports.unshift(report);
  return NextResponse.json(report, { status: 201 });
}

function buildInsights() {
  const categoryCounts = reports.reduce<Record<string, number>>((acc, report) => {
    acc[report.category] = (acc[report.category] ?? 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'No reports yet';
  const highestRisk = [...reports].sort((a, b) => b.impactScore - a.impactScore)[0];
  return [
    `Most reported issue this week: ${topCategory}`,
    `Highest risk area: ${highestRisk ? highestRisk.title : 'No active hotspot'}`,
    'AI recommends prioritizing clusters with high impact and low community confidence.',
  ];
}
