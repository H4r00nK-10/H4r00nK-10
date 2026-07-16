'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { AlertTriangle, BarChart3, Camera, CheckCircle2, MapPin, Radar, Route, Search, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { z } from 'zod';
import { Button, Card, Badge } from '@/components/ui';
import { demoAnalysis, demoReports } from '@/lib/demo-data';
import type { CivicReport } from '@/lib/types';

const Map = dynamic(() => import('@/components/report-map'), {
  ssr: false,
  loading: () => <div className="h-[460px] animate-pulse rounded-3xl bg-slate-200 dark:bg-white/10" />,
});

const schema = z.object({ image: z.any().optional(), notes: z.string().optional() });
const severityClass = (severity: string) =>
  severity === 'Critical'
    ? 'bg-red-500 text-white'
    : severity === 'High'
      ? 'bg-orange-500 text-white'
      : severity === 'Medium'
        ? 'bg-yellow-400 text-slate-950'
        : 'bg-green-500 text-white';

const actionSteps = ['AI verified issue', 'Prioritize department', 'Temporary mitigation', 'Dispatch field crew'];

export default function Home() {
  const [reports, setReports] = useState<CivicReport[]>(demoReports);
  const [analysis, setAnalysis] = useState<CivicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>();

  const stats = useMemo(
    () => ({
      total: reports.length,
      critical: reports.filter((report) => report.severity === 'Critical').length,
      resolved: reports.filter((report) => report.status === 'Resolved').length,
      avg: Math.round(reports.reduce((total, report) => total + report.impactScore, 0) / reports.length),
      confidence: Math.round(reports.reduce((total, report) => total + (report.confidence ?? 0), 0) / reports.length),
    }),
    [reports],
  );

  async function submit(data: z.infer<typeof schema>) {
    setError('');
    setLoading(true);
    try {
      const position = await new Promise<GeolocationPosition | null>((resolve) =>
        navigator.geolocation?.getCurrentPosition(resolve, () => resolve(null)),
      );
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          notes: data.notes,
          latitude: position?.coords.latitude ?? 40.7138,
          longitude: position?.coords.longitude ?? -74.006,
          imageUrl: demoAnalysis.imageUrl,
        }),
      });
      if (!response.ok) throw new Error('AI analysis failed');
      setAnalysis(await response.json());
    } catch {
      setError('AI analysis is temporarily unavailable. Demo intelligence has been loaded instead.');
      setAnalysis(demoAnalysis);
    } finally {
      setLoading(false);
    }
  }

  async function createReport() {
    if (!analysis) return;
    const response = await fetch('/api/reports', { method: 'POST', body: JSON.stringify(analysis) });
    if (!response.ok) {
      setError('Unable to create report. Please review the AI output and try again.');
      return;
    }
    const report = await response.json();
    setReports([report, ...reports]);
    setAnalysis(null);
    document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
  }

  function tryDemo() {
    setError('');
    setLoading(true);
    setTimeout(() => {
      setAnalysis(demoAnalysis);
      setLoading(false);
      document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
    }, 900);
  }

  return (
    <main className="overflow-hidden">
      <section className="relative px-5 py-8 md:px-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#7dd3fc66,transparent_32%),radial-gradient(circle_at_80%_8%,#a78bfa55,transparent_26%)]" />
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-black">
            <div className="rounded-2xl bg-slate-950 p-2 text-white shadow-glow dark:bg-white dark:text-slate-950">
              <Sparkles />
            </div>
            CivicLens AI
          </div>
          <div className="flex gap-2">
            <Button className="hidden bg-white text-slate-950 md:block" onClick={tryDemo}>Try Demo Report</Button>
            <a href="#report" className="rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-white/20">Report Issue</a>
          </div>
        </nav>

        <div className="mx-auto grid max-w-7xl items-center gap-10 py-16 lg:grid-cols-[1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
            <Badge className="bg-civic-50 text-civic-700">AI operating system for community problems</Badge>
            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">AI-powered intelligence for safer communities.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Report problems with a photo. CivicLens AI analyzes, prioritizes, and connects communities with solutions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' })}>Report an Issue</Button>
              <Button className="bg-white text-slate-950" onClick={tryDemo}>Try Demo Report</Button>
              <Button className="bg-slate-100 text-slate-950" onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}>Explore Map</Button>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {[['10,000+', 'Reports analyzed'], ['95%', 'AI confidence'], ['24/7', 'Monitoring']].map(([value, label]) => (
                <Card key={label} className="p-4 text-center">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black">{value}</motion.p>
                  <p className="text-xs text-slate-500">{label}</p>
                </Card>
              ))}
            </div>
          </motion.div>
          <Card className="relative p-3">
            <div className="absolute left-8 top-8 z-[500] rounded-full bg-white/90 px-4 py-2 text-sm font-bold shadow-xl dark:bg-slate-950/90">Live civic intelligence map</div>
            <Map reports={reports} />
          </Card>
        </div>
      </section>

      <section id="report" className="mx-auto grid max-w-7xl gap-6 px-5 py-10 lg:grid-cols-[.78fr_1.22fr]">
        <Card>
          <h2 className="text-3xl font-black">See a problem? Help improve your community.</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Upload a photo, add optional context, and let CivicLens AI build a response-ready intelligence report.</p>
          <form onSubmit={handleSubmit(submit)} className="mt-6 space-y-4">
            <label className="group flex cursor-pointer flex-col items-center rounded-3xl border border-dashed border-civic-500/50 bg-civic-50/50 p-10 text-center transition hover:scale-[1.01] dark:bg-white/5">
              <Camera className="mb-3 size-10 text-civic-700" />
              <b>Upload image or take a photo</b>
              <span className="text-sm text-slate-500">Mobile-friendly camera capture enabled</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" {...register('image')} />
            </label>
            <textarea {...register('notes')} placeholder="Optional notes: landmarks, urgency, accessibility impact..." className="min-h-32 w-full rounded-2xl border bg-white/70 p-4 outline-none transition focus:ring-4 focus:ring-civic-500/20 dark:bg-white/10" />
            {error && <p className="rounded-2xl bg-amber-100 p-3 text-sm text-amber-900">{error}</p>}
            <div className="flex flex-wrap gap-3">
              <Button disabled={loading}>{loading ? 'AI is scanning…' : 'Analyze with AI'}</Button>
              <Button type="button" className="bg-white text-slate-950" onClick={tryDemo}>Try Demo Report</Button>
            </div>
          </form>
        </Card>
        <AnalysisCard analysis={analysis} loading={loading} onCreate={createReport} />
      </section>

      <Dashboard reports={reports} stats={stats} />

      <section id="map" className="mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">Live community map</h2>
            <p className="text-slate-500">Severity markers, community confidence, and AI summaries in one operating view.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border bg-white px-4 py-3 text-sm shadow-sm dark:bg-white/10">
            <Search className="size-4" /> Search location
          </div>
        </div>
        <Card className="p-3"><Map reports={reports} /></Card>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <h2 className="mb-5 text-3xl font-black">Community verification</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reports.slice(0, 3).map((report) => (
            <Card key={report.id}>
              <div className="flex items-center justify-between">
                <Badge className={severityClass(report.severity)}>{report.severity}</Badge>
                <span className="text-sm font-bold">{report.communityConfidence}% confidence</span>
              </div>
              <h3 className="mt-4 font-black">{report.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{report.confirmations} confirmations · {report.evidenceCount} evidence uploads</p>
              <div className="mt-4 flex gap-2">
                <Button className="px-4 py-2"><Users className="mr-2 size-4" />Confirm</Button>
                <Button className="bg-white px-4 py-2 text-slate-950"><CheckCircle2 className="mr-2 size-4" />Resolved</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

function AnalysisCard({ analysis, loading, onCreate }: { analysis: CivicReport | null; loading: boolean; onCreate: () => void }) {
  if (loading) {
    return (
      <Card className="relative min-h-[560px] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-gradient-to-r from-civic-500 via-purple-500 to-civic-500" />
        <div className="grid min-h-[500px] place-items-center text-center">
          <div>
            <Radar className="mx-auto size-16 animate-spin text-civic-500" />
            <h3 className="mt-6 text-3xl font-black">CivicLens AI is thinking…</h3>
            <p className="mt-3 text-slate-500">Scanning image, evaluating safety risk, matching departments, and checking duplicates.</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="grid min-h-[560px] place-items-center text-center">
        <div>
          <MapPin className="mx-auto mb-4 size-12 text-civic-500" />
          <h3 className="text-2xl font-black">AI intelligence report appears here</h3>
          <p className="mt-3 max-w-md text-slate-500">Upload a problem photo or try demo mode to see impact scoring, department routing, duplicate detection, and an action plan.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 to-civic-500" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge className="bg-civic-50 text-civic-700">AI Classification · {analysis.confidence}% confidence</Badge>
          <h3 className="mt-4 text-3xl font-black">{analysis.title}</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{analysis.description}</p>
        </div>
        <div className="grid size-28 place-items-center rounded-full bg-slate-950 text-center text-white shadow-glow dark:bg-white dark:text-slate-950">
          <div><p className="text-3xl font-black">{analysis.impactScore}</p><p className="text-xs">Impact</p></div>
        </div>
      </div>
      {analysis.duplicateOf && <p className="mt-4 rounded-2xl bg-amber-100 p-4 text-amber-900">This problem may already be reported nearby. Confirm the existing report or add supporting evidence to strengthen community confidence.</p>}
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <Metric label="Priority" value={analysis.priority} icon={<AlertTriangle />} tone={severityClass(analysis.severity)} />
        <Metric label="Department" value={analysis.department} icon={<ShieldCheck />} />
        <Metric label="Resolution" value={analysis.estimatedResolution} icon={<Route />} />
      </div>
      <div className="mt-6 rounded-3xl bg-slate-100 p-5 dark:bg-white/10">
        <h4 className="font-black">Civic Impact Intelligence</h4>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{analysis.impactReason}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          {[['Safety Risk', analysis.safetyRisk], ['Accessibility', analysis.accessibilityImpact], ['Environment', analysis.environmentalImpact], ['People Affected', analysis.peopleAffected]].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-white p-3 text-sm dark:bg-white/10"><span className="text-slate-500">{label}</span><p className="font-black">{value}</p></div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border p-5 dark:border-white/10"><b>If ignored</b><p className="mt-2 text-sm text-slate-500">{analysis.potentialConsequences}</p></div>
        <div className="rounded-3xl border p-5 dark:border-white/10"><b>Immediate action</b><p className="mt-2 text-sm text-slate-500">{analysis.immediateAction}</p></div>
      </div>
      <div className="mt-6">
        <h4 className="mb-4 font-black">AI action plan</h4>
        <div className="grid gap-3 md:grid-cols-4">
          {actionSteps.map((step, index) => <div key={step} className="rounded-2xl bg-white p-4 shadow-sm dark:bg-white/10"><span className="text-xs font-black text-civic-700">0{index + 1}</span><p className="mt-2 text-sm font-bold">{step}</p></div>)}
        </div>
      </div>
      <Button className="mt-6" onClick={onCreate}>Create report and place on map</Button>
    </Card>
  );
}

function Metric({ label, value, icon, tone }: { label: string; value: string; icon: React.ReactNode; tone?: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><div className="mb-3 flex items-center gap-2 text-slate-500">{icon}<span className="text-xs font-bold uppercase">{label}</span></div><Badge className={tone ?? 'bg-white text-slate-950'}>{value}</Badge></div>;
}

function Dashboard({ reports, stats }: { reports: CivicReport[]; stats: Record<string, number> }) {
  const categories = Object.entries(reports.reduce<Record<string, number>>((acc, report) => ({ ...acc, [report.category]: (acc[report.category] ?? 0) + 1 }), {}));
  return (
    <section className="mx-auto max-w-7xl px-5 py-10">
      <div className="mb-5 flex items-end justify-between"><div><h2 className="text-3xl font-black">Civic intelligence dashboard</h2><p className="text-slate-500">A command center for risk, response, and community trust.</p></div></div>
      <div className="grid gap-4 md:grid-cols-5">
        {[[stats.total, 'Total reports', BarChart3], [stats.critical, 'Critical issues', ShieldCheck], [stats.resolved, 'Resolved', CheckCircle2], [stats.avg, 'Avg impact', Sparkles], [stats.confidence, 'AI confidence', Radar]].map(([value, label, Icon]: any) => <Card key={label} className="p-5"><Icon className="text-civic-700" /><p className="mt-4 text-sm text-slate-500">{label}</p><p className="text-4xl font-black">{value}</p></Card>)}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_.8fr]">
        <Card><h3 className="font-black">Issue category distribution</h3><div className="mt-5 space-y-4">{categories.map(([category, count]) => <div key={category}><div className="mb-1 flex justify-between text-sm"><span>{category}</span><b>{count}</b></div><div className="h-3 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-3 rounded-full bg-civic-500" style={{ width: `${Math.max(18, count * 28)}%` }} /></div></div>)}</div></Card>
        <Card className="relative overflow-hidden"><div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-civic-500/20" /><h3 className="font-black">CivicLens AI Insight Engine</h3><div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300"><p><b>AI Community Insight:</b> Road-related problems increased 28% this week.</p><p><b>Highest risk area:</b> Central District.</p><p><b>Recommendation:</b> Prioritize road maintenance before heavy rainfall and dispatch inspectors to repeated high-impact clusters.</p></div></Card>
      </div>
    </section>
  );
}
