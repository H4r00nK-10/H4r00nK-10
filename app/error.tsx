'use client';

import { Button, Card } from '@/components/ui';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 dark:bg-[#050814]">
      <Card className="max-w-lg text-center">
        <p className="text-sm font-bold text-civic-700">CivicLens AI</p>
        <h1 className="mt-3 text-3xl font-black">Something went wrong</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          The demo experience is designed to recover safely. Please try again to reload the civic intelligence workflow.
        </p>
        <Button className="mt-6" onClick={reset}>Try again</Button>
      </Card>
    </main>
  );
}
