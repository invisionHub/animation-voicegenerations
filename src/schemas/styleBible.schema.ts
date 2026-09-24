import { z } from 'zod';

export const StyleBibleSchema = z.object({
  id: z.string().default('tech_default'),
  name: z.string().default('Modern Technical Studio'),
  theme: z.enum(['dark', 'light', 'cyber_midnight', 'clean_slate']).default('dark'),
  background: z.string().default('#0B1120'), // Deep navy/slate
  surfaceColor: z.string().default('#1E293B'),
  surfaceBorder: z.string().default('#334155'),
  primaryAccent: z.string().default('#38BDF8'), // Electric cyan/sky
  secondaryAccent: z.string().default('#818CF8'), // Indigo
  warningAccent: z.string().default('#F59E0B'), // Amber for bottlenecks
  dangerAccent: z.string().default('#EF4444'), // Red for slow/error
  successAccent: z.string().default('#10B981'), // Emerald for fast/ok
  textPrimary: z.string().default('#F8FAFC'),
  textSecondary: z.string().default('#94A3B8'),
  fontFamily: z.enum(['inter', 'fira_code', 'jetbrains_mono', 'system']).default('inter'),
  codeFontFamily: z.string().default('ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'),
  depth: z.enum(['flat', 'subtle_shadow', 'layered_elevation']).default('subtle_shadow'),
  density: z.enum(['compact', 'balanced', 'spacious']).default('balanced'),
  motionPacing: z.enum(['snappy', 'smooth', 'cinematic']).default('smooth'),
  avoidRules: z.array(z.string()).default([
    'Avoid generic corporate illustrations with unrelated people',
    'Never display wall of unformatted text; use code blocks or diagram structures',
    'Do not use low-contrast text on dark backgrounds',
    'Keep motion purposeful and physically grounded',
  ]),
});

export type StyleBible = z.infer<typeof StyleBibleSchema>;

export const DEFAULT_STYLE_BIBLE: StyleBible = StyleBibleSchema.parse({});

export const PRESET_STYLE_BIBLES: Record<string, StyleBible> = {
  modern_dark: DEFAULT_STYLE_BIBLE,
  clean_light: StyleBibleSchema.parse({
    id: 'clean_light',
    name: 'Clean Engineering Light',
    theme: 'light',
    background: '#F8FAFC',
    surfaceColor: '#FFFFFF',
    surfaceBorder: '#E2E8F0',
    primaryAccent: '#0284C7',
    secondaryAccent: '#6366F1',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
  }),
  cyber_midnight: StyleBibleSchema.parse({
    id: 'cyber_midnight',
    name: 'Cyberpunk Midnight',
    theme: 'cyber_midnight',
    background: '#030712',
    surfaceColor: '#111827',
    surfaceBorder: '#1F2937',
    primaryAccent: '#06B6D4',
    secondaryAccent: '#A855F7',
    warningAccent: '#FBBF24',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
  }),
};
