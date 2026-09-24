import { z } from 'zod';
import { CameraMotionTypeSchema, TransitionTypeSchema } from './sceneSpecification.schema';

export const DirectorSceneCueSchema = z.object({
  sceneId: z.string(),
  sceneIndex: z.number(),
  narrativeInstruction: z.string(),
  visualAction: z.string(),
  cameraOverride: z.object({
    motion: CameraMotionTypeSchema,
    intensity: z.number().min(0).max(1),
  }).optional(),
  transitionOverride: z.object({
    type: TransitionTypeSchema,
    duration: z.number(),
  }).optional(),
  highlightElements: z.array(z.string()).default([]),
  pacingNote: z.string().optional(),
});

export const VideoDirectionSpecSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  overallTone: z.enum(['high_energy_tech', 'clear_explainer', 'deep_dive', 'punchy_short']).default('clear_explainer'),
  globalPacing: z.enum(['fast', 'steady', 'dramatic']).default('steady'),
  targetDurationSeconds: z.number().optional(),
  sceneCues: z.array(DirectorSceneCueSchema),
  soundtrackSuggestion: z.string().optional(),
  createdAt: z.string(),
});

export type DirectorSceneCue = z.infer<typeof DirectorSceneCueSchema>;
export type VideoDirectionSpec = z.infer<typeof VideoDirectionSpecSchema>;
