import Link from 'next/link';
import { Card } from '@/components/ui';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-[#050814]">
      <Card className="max-w-lg text-center">
        <p className="text-sm font-bold text-civic-700">404</p>
        <h1 className="mt-3 text-3xl font-black">Civic report not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">Return to the demo dashboard to explore active community intelligence.</p>
        <Link className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950" href="/">Back to CivicLens AI</Link>
      </Card>
    </main>
  );
}
