import { z } from 'zod';

export const DiagramPrimitiveTypeSchema = z.enum([
  'call_stack',
  'queue',
  'api_packet',
  'database',
  'code_block',
  'barrier',
  'arrow',
  'latency_meter',
  'badge_pill',
]);
export type DiagramPrimitiveType = z.infer<typeof DiagramPrimitiveTypeSchema>;

export const DiagramPrimitiveSpecSchema = z.object({
  id: z.string(),
  type: DiagramPrimitiveTypeSchema,
  label: z.string(),
  x: z.number().min(0).max(100), // percentage coordinates (0-100%)
  y: z.number().min(0).max(100),
  width: z.number().optional(), // percentage width
  height: z.number().optional(),
  color: z.string().optional(),
  state: z.record(z.any()).default({}), // e.g. stack frames: ['main()', 'fetchUsers()'], packets: 3, latencyMs: 2400
  visible: z.boolean().default(true),
  zIndex: z.number().default(1),
});
export type DiagramPrimitiveSpec = z.infer<typeof DiagramPrimitiveSpecSchema>;

export const AnimationEasingSchema = z.enum([
  'linear',
  'easeIn',
  'easeOut',
  'easeInOut',
  'bounce',
  'spring',
]);
export type AnimationEasing = z.infer<typeof AnimationEasingSchema>;

export const StructuredAnimationSpecSchema = z.object({
  id: z.string(),
  targetId: z.string(), // ID of asset or diagram primitive
  type: z.enum([
    'move',
    'scale',
    'rotate',
    'fade',
    'pulse',
    'popIn',
    'dramaticZoom',
    'stackPush',
    'stackPop',
    'queueAdvance',
  ]),
  startTime: z.number().min(0),
  duration: z.number().min(0.05),
  from: z.record(z.number()),
  to: z.record(z.number()),
  easing: AnimationEasingSchema.default('easeInOut'),
});
export type StructuredAnimationSpec = z.infer<typeof StructuredAnimationSpecSchema>;

export const CameraMotionTypeSchema = z.enum([
  'static',
  'zoom_in',
  'zoom_out',
  'pan_left',
  'pan_right',
  'dramatic_push',
]);
export type CameraMotionType = z.infer<typeof CameraMotionTypeSchema>;

export const TransitionTypeSchema = z.enum([
  'cut',
  'crossfade',
  'slide_left',
  'slide_right',
  'zoom',
]);
export type TransitionType = z.infer<typeof TransitionTypeSchema>;

export const SceneSpecificationSchema = z.object({
  id: z.string(),
  sceneIndex: z.number().min(0),
  name: z.string(),
  visualObjective: z.string(),
  technicalConcept: z.string(),
  voiceoverText: z.string(),
  durationEstimate: z.number().min(1.0).max(60.0),
  backgroundStyle: z.string().optional(),
  diagramPrimitives: z.array(DiagramPrimitiveSpecSchema).default([]),
  assignedAssetIds: z.array(z.string()).default([]),
  animations: z.array(StructuredAnimationSpecSchema).default([]),
  camera: z
    .object({
      motion: CameraMotionTypeSchema.default('static'),
      intensity: z.number().min(0).max(1).default(0.15),
      focalX: z.number().min(0).max(100).default(50),
      focalY: z.number().min(0).max(100).default(50),
    })
    .default({ motion: 'static', intensity: 0.15, focalX: 50, focalY: 50 }),
  transition: z
    .object({
      type: TransitionTypeSchema.default('crossfade'),
      duration: z.number().min(0.1).max(2.0).default(0.5),
    })
    .default({ type: 'crossfade', duration: 0.5 }),
  subtitles: z
    .array(
      z.object({
        startTime: z.number(),
        endTime: z.number(),
        text: z.string(),
      })
    )
    .default([]),
});
export type SceneSpecification = z.infer<typeof SceneSpecificationSchema>;

export const ProjectSceneSpecsSchema = z.object({
  projectId: z.string(),
  version: z.number().default(1),
  scenes: z.array(SceneSpecificationSchema),
  updatedAt: z.string(),
});
export type ProjectSceneSpecs = z.infer<typeof ProjectSceneSpecsSchema>;

/**
 * Safe validation helper with automatic fallback defaults
 */
export function validateSceneSpecification(input: unknown): SceneSpecification {
  const result = SceneSpecificationSchema.safeParse(input);
  if (result.success) {
    return result.data;
  }
  console.warn('SceneSpecification validation warning, applying schema fallback:', result.error);
  // Construct minimally viable fallback
  const raw = (input as any) || {};
  return {
    id: raw.id || `scene_spec_${Date.now()}`,
    sceneIndex: typeof raw.sceneIndex === 'number' ? raw.sceneIndex : 0,
    name: raw.name || 'Untitled Scene',
    visualObjective: raw.visualObjective || 'Explain technical concept',
    technicalConcept: raw.technicalConcept || 'General',
    voiceoverText: raw.voiceoverText || '',
    durationEstimate: typeof raw.durationEstimate === 'number' ? raw.durationEstimate : 5.0,
    diagramPrimitives: Array.isArray(raw.diagramPrimitives) ? raw.diagramPrimitives : [],
    assignedAssetIds: Array.isArray(raw.assignedAssetIds) ? raw.assignedAssetIds : [],
    animations: Array.isArray(raw.animations) ? raw.animations : [],
    camera: raw.camera || { motion: 'static', intensity: 0.15, focalX: 50, focalY: 50 },
    transition: raw.transition || { type: 'crossfade', duration: 0.5 },
    subtitles: Array.isArray(raw.subtitles) ? raw.subtitles : [],
  };
}
