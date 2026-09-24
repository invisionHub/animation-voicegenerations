import { z } from 'zod';

export const ConceptCueSchema = z.object({
  concept: z.string(),
  importance: z.enum(['primary', 'secondary', 'supporting']),
  visualMetaphor: z.string(),
  suggestedDiagramType: z.enum([
    'call_stack',
    'queue',
    'api_packet',
    'database',
    'code_block',
    'architecture_flow',
    'comparison',
  ]),
});

export const ScriptSegmentAnalysisSchema = z.object({
  id: z.string(),
  index: z.number(),
  rawText: z.string(),
  role: z.enum([
    'hook',
    'problem_statement',
    'misconception_elimination',
    'concept_introduction',
    'analogy',
    'mechanism_explanation',
    'bottleneck_demonstration',
    'consequence',
    'real_world_context',
    'resolution_preview',
    'call_to_action',
  ]),
  intent: z.string(),
  visualObjective: z.string(),
  visualPriority: z.enum(['critical', 'high', 'medium', 'subtle']),
  emphasisWords: z.array(z.string()).default([]),
  suggestedDuration: z.number().min(1.5).max(30.0),
  diagramFocus: z.string().optional(),
});

export const ScriptAnalysisSchema = z.object({
  title: z.string(),
  topic: z.string(),
  targetAudience: z.string().default('Software Engineers & Technical Creators'),
  coreTakeaway: z.string(),
  estimatedTotalDuration: z.number(),
  concepts: z.array(ConceptCueSchema),
  segments: z.array(ScriptSegmentAnalysisSchema),
  overallVisualFlow: z.string(),
});

export type ConceptCue = z.infer<typeof ConceptCueSchema>;
export type ScriptSegmentAnalysis = z.infer<typeof ScriptSegmentAnalysisSchema>;
export type ScriptAnalysis = z.infer<typeof ScriptAnalysisSchema>;
