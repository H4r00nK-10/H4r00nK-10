import { z } from 'zod';

export const statuses = ['Reported', 'Verified', 'Assigned', 'In Progress', 'Resolved'] as const;
export const severities = ['Critical', 'High', 'Medium', 'Low'] as const;

export const intelligenceSchema = z.object({
  issue: z.string().min(2),
  category: z.string().min(2),
  confidence: z.number().min(0).max(100),
  impactScore: z.number().min(0).max(100),
  impactReason: z.string().min(8),
  priority: z.enum(severities),
  department: z.string().min(2),
  estimatedResolution: z.string().min(2),
  potentialConsequences: z.string().min(8),
  immediateAction: z.string().min(8),
  factors: z.object({
    safetyRisk: z.number().min(0).max(100),
    peopleAffected: z.number().min(0).max(100),
    accessibilityImpact: z.number().min(0).max(100),
    environmentalImpact: z.number().min(0).max(100),
    urgency: z.number().min(0).max(100),
  }),
  summary: z.string().min(8),
});

export const reportSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  imageUrl: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string(),
  severity: z.enum(severities),
  impactScore: z.number().min(0).max(100),
  priority: z.enum(severities),
  department: z.string(),
  estimatedResolution: z.string(),
  status: z.enum(statuses).optional(),
  aiExplanation: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
  impactReason: z.string().optional(),
  potentialConsequences: z.string().optional(),
  immediateAction: z.string().optional(),
  communityConfidence: z.number().min(0).max(100).optional(),
  confirmations: z.number().min(0).optional(),
  evidenceCount: z.number().min(0).optional(),
  safetyRisk: z.string().optional(),
  accessibilityImpact: z.string().optional(),
  environmentalImpact: z.string().optional(),
  peopleAffected: z.string().optional(),
});

export type CivicIntelligence = z.infer<typeof intelligenceSchema>;
export type CivicReport = z.infer<typeof reportSchema> & {
  id: string;
  createdAt: string;
  duplicateOf?: string;
};
