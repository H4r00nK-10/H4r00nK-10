import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { demoAnalysis } from '@/lib/demo-data';
import { nearbyDuplicate } from '@/lib/store';
import { intelligenceSchema } from '@/lib/types';

export async function POST(req: Request) {
  const body = await req.json();
  const latitude = Number(body.latitude ?? 40.7138);
  const longitude = Number(body.longitude ?? -74.006);
  let intelligence = null;

  if (process.env.OPENAI_API_KEY) {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
      const response = await openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-5.5',
        input: [
          {
            role: 'system',
            content:
              'You are CivicLens AI. Return only JSON with: issue, category, confidence, impactScore, impactReason, priority, department, estimatedResolution, potentialConsequences, immediateAction, factors{safetyRisk,peopleAffected,accessibilityImpact,environmentalImpact,urgency}, summary. Priority must be Critical, High, Medium, or Low.',
          },
          {
            role: 'user',
            content: `Analyze this civic issue report. Notes: ${body.notes || 'none'}. Location: ${latitude}, ${longitude}. Image reference: ${body.imageUrl || 'uploaded citizen image'}`,
          },
        ],
        text: { format: { type: 'json_object' } },
      });
      intelligence = intelligenceSchema.parse(JSON.parse(response.output_text));
    } catch (error) {
      console.error('CivicLens AI analysis fallback used', error);
    }
  }

  intelligence ??= {
    issue: 'Large pothole',
    category: 'Road Infrastructure',
    confidence: 94,
    impactScore: 91,
    impactReason: demoAnalysis.impactReason!,
    priority: 'Critical' as const,
    department: 'Roads & Transport',
    estimatedResolution: '3-5 days',
    potentialConsequences: demoAnalysis.potentialConsequences!,
    immediateAction: demoAnalysis.immediateAction!,
    factors: { safetyRisk: 96, peopleAffected: 84, accessibilityImpact: 88, environmentalImpact: 52, urgency: 93 },
    summary: demoAnalysis.aiExplanation!,
  };

  const duplicate = nearbyDuplicate({ latitude, longitude, category: intelligence.category });
  return NextResponse.json({
    id: crypto.randomUUID(),
    title: intelligence.issue,
    description: intelligence.summary,
    imageUrl: body.imageUrl || demoAnalysis.imageUrl,
    latitude,
    longitude,
    category: intelligence.category,
    severity: intelligence.priority,
    status: 'Reported',
    createdAt: new Date().toISOString(),
    aiExplanation: intelligence.summary,
    communityConfidence: 72,
    confirmations: 0,
    evidenceCount: 1,
    safetyRisk: intelligence.factors.safetyRisk >= 80 ? 'High' : intelligence.factors.safetyRisk >= 50 ? 'Medium' : 'Low',
    accessibilityImpact: intelligence.factors.accessibilityImpact >= 80 ? 'High' : intelligence.factors.accessibilityImpact >= 50 ? 'Medium' : 'Low',
    environmentalImpact: intelligence.factors.environmentalImpact >= 80 ? 'High' : intelligence.factors.environmentalImpact >= 50 ? 'Medium' : 'Low',
    peopleAffected: intelligence.factors.peopleAffected >= 80 ? 'Estimated 200+' : intelligence.factors.peopleAffected >= 50 ? 'Estimated 75+' : 'Estimated 25+',
    duplicateOf: duplicate?.id,
    ...intelligence,
  });
}
