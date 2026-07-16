import { demoReports } from './demo-data';
import type { CivicReport } from './types';

export const reports: CivicReport[] = [...demoReports];

export function nearbyDuplicate(input: Pick<CivicReport, 'latitude' | 'longitude' | 'category'>) {
  return reports.find((report) => {
    const distance = Math.hypot(report.latitude - input.latitude, report.longitude - input.longitude);
    const sameDomain = report.category === input.category;
    return sameDomain && distance < 0.012;
  });
}

export function confidenceFor(report: Partial<CivicReport>) {
  const confirmations = Math.min((report.confirmations ?? 0) * 2, 40);
  const evidence = Math.min((report.evidenceCount ?? 0) * 5, 25);
  const ai = Math.round((report.confidence ?? 80) * 0.35);
  return Math.min(99, confirmations + evidence + ai);
}
