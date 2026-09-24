import {
  AnimationInstruction,
  Asset,
  Project,
  RenderJob,
  Scene,
  SceneAsset,
  VoiceTrack,
} from '../types';
import { instructionToPrimitives } from './animationParser';
import { DEFAULT_ASSETS } from './defaultAssets';

const STORAGE_KEYS = {
  PROJECTS: 'bluestudio_projects_v1',
  ACTIVE_PROJECT: 'bluestudio_active_project_id_v1',
  SCENES: 'bluestudio_scenes_v1',
  ASSETS: 'bluestudio_assets_v1',
  SCENE_ASSETS: 'bluestudio_scene_assets_v1',
  INSTRUCTIONS: 'bluestudio_instructions_v1',
  VOICE_TRACKS: 'bluestudio_voice_tracks_v1',
  RENDER_JOBS: 'bluestudio_render_jobs_v1',
  STYLE_BIBLE: 'bluestudio_style_bible_v1',
  SCRIPT_ANALYSIS: 'bluestudio_script_analysis_v1',
  SCENE_SPECS: 'bluestudio_scene_specs_v1',
  VIDEO_DIRECTION: 'bluestudio_video_direction_v1',
};

export const INITIAL_PROJECT: Project = {
  id: 'proj_default',
  name: 'Digital Banking Explainer',
  description: 'Enterprise fintech onboarding with animated cards, character presenter, and security vault.',
  aspectRatio: '16:9',
  exportPreset: '1080p',
  fps: 30,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const INITIAL_SCENES: Scene[] = [
  {
    id: 'sc_01',
    projectId: 'proj_default',
    name: 'Scene 01 — Opening & Welcome',
    description: 'Presenter introduces modern digital banking capabilities.',
    sortOrder: 0,
    duration: 4.5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    directorSettings: {
      cameraMotion: 'zoom_in',
      cameraIntensity: 0.15,
      transitionIn: 'cut',
      transitionDuration: 0.5,
      pacingPreset: 'conversational',
      enableSubtitles: true,
    },
    captions: [
      {
        id: 'cap_01',
        text: 'Welcome to the next generation of digital finance.',
        startTime: 0.3,
        duration: 2.2,
        style: 'modern_bold',
      },
      {
        id: 'cap_02',
        text: 'Manage your assets with clarity and speed.',
        startTime: 2.5,
        duration: 1.8,
        style: 'modern_bold',
      },
    ],
  },
  {
    id: 'sc_02',
    projectId: 'proj_default',
    name: 'Scene 02 — Login & Security Vault',
    description: 'Showcase bank-grade biometric encryption and mobile dashboard.',
    sortOrder: 1,
    duration: 5.0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    directorSettings: {
      cameraMotion: 'dramatic_push',
      cameraIntensity: 0.2,
      transitionIn: 'crossfade',
      transitionDuration: 0.6,
      pacingPreset: 'cinematic',
      enableSubtitles: true,
    },
    captions: [
      {
        id: 'cap_03',
        text: 'Bank-grade multi-factor biometric protection safeguards every transaction.',
        startTime: 0.4,
        duration: 3.5,
        style: 'modern_bold',
      },
    ],
  },
  {
    id: 'sc_03',
    projectId: 'proj_default',
    name: 'Scene 03 — Instant Transfer Flow',
    description: 'Demonstrating frictionless card payments and instant notification.',
    sortOrder: 2,
    duration: 4.0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    directorSettings: {
      cameraMotion: 'pan_right',
      cameraIntensity: 0.15,
      transitionIn: 'slide_left',
      transitionDuration: 0.5,
      pacingPreset: 'dynamic',
      enableSubtitles: true,
    },
    captions: [
      {
        id: 'cap_04',
        text: 'Send funds globally in seconds with real-time settlement.',
        startTime: 0.2,
        duration: 3.2,
        style: 'modern_bold',
      },
    ],
  },
];

export const INITIAL_SCENE_ASSETS: SceneAsset[] = [
  // Scene 01
  {
    id: 'sa_1',
    sceneId: 'sc_01',
    assetId: 'A001',
    sortOrder: 0,
    initialX: 25,
    initialY: 52,
    initialScale: 0.9,
    initialOpacity: 1,
  },
  {
    id: 'sa_2',
    sceneId: 'sc_01',
    assetId: 'A002',
    sortOrder: 1,
    initialX: 68,
    initialY: 54,
    initialScale: 0.95,
    initialOpacity: 1,
  },
  // Scene 02
  {
    id: 'sa_3',
    sceneId: 'sc_02',
    assetId: 'A003',
    sortOrder: 0,
    initialX: 32,
    initialY: 50,
    initialScale: 0.85,
    initialOpacity: 1,
  },
  {
    id: 'sa_4',
    sceneId: 'sc_02',
    assetId: 'A005',
    sortOrder: 1,
    initialX: 72,
    initialY: 48,
    initialScale: 0.9,
    initialOpacity: 1,
  },
  // Scene 03
  {
    id: 'sa_5',
    sceneId: 'sc_03',
    assetId: 'A004',
    sortOrder: 0,
    initialX: 35,
    initialY: 50,
    initialScale: 0.95,
    initialOpacity: 1,
  },
  {
    id: 'sa_6',
    sceneId: 'sc_03',
    assetId: 'A006',
    sortOrder: 1,
    initialX: 70,
    initialY: 50,
    initialScale: 1.0,
    initialOpacity: 1,
  },
];

export const INITIAL_INSTRUCTIONS: AnimationInstruction[] = [
  // Scene 01
  {
    id: 'inst_1',
    sceneId: 'sc_01',
    assetId: 'A001',
    rawInstruction: '[A001] Character walks from left to center and fades in over 2.5s with smooth ease',
    spec: {
      assetId: 'A001',
      animations: instructionToPrimitives('[A001] Character walks from left to center and fades in over 2.5s with smooth ease'),
    },
    status: 'reviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inst_2',
    sceneId: 'sc_01',
    assetId: 'A002',
    rawInstruction: '[A002] Laptop slides upward from bottom and scales to 110% over 2s with easeInOut',
    spec: {
      assetId: 'A002',
      animations: instructionToPrimitives('[A002] Laptop slides upward from bottom and scales to 110% over 2s with easeInOut'),
    },
    status: 'reviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Scene 02
  {
    id: 'inst_3',
    sceneId: 'sc_02',
    assetId: 'A003',
    rawInstruction: '[A003] Smartphone slides upward and fades in over 2s',
    spec: {
      assetId: 'A003',
      animations: instructionToPrimitives('[A003] Smartphone slides upward and fades in over 2s'),
    },
    status: 'reviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inst_4',
    sceneId: 'sc_02',
    assetId: 'A005',
    rawInstruction: '[A005] Security shield fades in and scales with bounce easing for 2.2s',
    spec: {
      assetId: 'A005',
      animations: instructionToPrimitives('[A005] Security shield fades in and scales with bounce easing for 2.2s'),
    },
    status: 'reviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Scene 03
  {
    id: 'inst_5',
    sceneId: 'sc_03',
    assetId: 'A004',
    rawInstruction: '[A004] Platinum card glides from right to center and rotates 10 degrees in 2s',
    spec: {
      assetId: 'A004',
      animations: instructionToPrimitives('[A004] Platinum card glides from right to center and rotates 10 degrees in 2s'),
    },
    status: 'reviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inst_6',
    sceneId: 'sc_03',
    assetId: 'A006',
    rawInstruction: '[A006] Instant transfer badge scales up from 0 and fades in with bounce easing',
    spec: {
      assetId: 'A006',
      animations: instructionToPrimitives('[A006] Instant transfer badge scales up from 0 and fades in with bounce easing'),
    },
    status: 'reviewed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_VOICE_TRACKS: VoiceTrack[] = [
  {
    id: 'vt_01',
    projectId: 'proj_default',
    sceneId: 'sc_01',
    title: 'Intro Narration',
    text: 'Welcome to the next generation of digital finance. Manage your assets with clarity and speed.',
    voiceName: 'Default Assistant Voice',
    rate: 1.0,
    pitch: 1.0,
    duration: 4.2,
    status: 'ready',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vt_02',
    projectId: 'proj_default',
    sceneId: 'sc_02',
    title: 'Security Narration',
    text: 'Bank-grade multi-factor biometric protection safeguards every transaction across all connected devices.',
    voiceName: 'Default Assistant Voice',
    rate: 1.0,
    pitch: 1.0,
    duration: 4.8,
    status: 'ready',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vt_03',
    projectId: 'proj_default',
    sceneId: 'sc_03',
    title: 'Transfer Narration',
    text: 'Send funds globally in seconds with real-time settlement and automatic ledger reconciliation.',
    voiceName: 'Default Assistant Voice',
    rate: 1.0,
    pitch: 1.0,
    duration: 3.8,
    status: 'ready',
    createdAt: new Date().toISOString(),
  },
];

// Helper functions for reading & writing to localStorage
export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load projects', e);
  }
  return [INITIAL_PROJECT];
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

export function loadActiveProjectId(): string {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_PROJECT) || INITIAL_PROJECT.id;
}

export function saveActiveProjectId(id: string) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROJECT, id);
}

export function loadScenes(projectId: string): Scene[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCENES);
    if (raw) {
      const all: Scene[] = JSON.parse(raw);
      const filtered = all.filter((s) => s.projectId === projectId);
      if (filtered.length > 0) return filtered.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch (e) {
    console.error('Failed to load scenes', e);
  }
  return INITIAL_SCENES;
}

export function saveScenes(scenes: Scene[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCENES);
    const existing: Scene[] = raw ? JSON.parse(raw) : INITIAL_SCENES;
    const currentSceneIds = new Set(scenes.map((s) => s.id));
    const others = existing.filter((s) => !currentSceneIds.has(s.id));
    localStorage.setItem(STORAGE_KEYS.SCENES, JSON.stringify([...others, ...scenes]));
  } catch (e) {
    console.error('Failed to save scenes', e);
  }
}

export function loadAssets(projectId: string): Asset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (raw) {
      const all: Asset[] = JSON.parse(raw);
      const filtered = all.filter((a) => a.projectId === projectId || a.projectId === 'proj_default');
      if (filtered.length > 0) return filtered;
    }
  } catch (e) {
    console.error('Failed to load assets', e);
  }
  return DEFAULT_ASSETS;
}

export function saveAssets(assets: Asset[]) {
  localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
}

export function loadSceneAssets(): SceneAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCENE_ASSETS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load scene assets', e);
  }
  return INITIAL_SCENE_ASSETS;
}

export function saveSceneAssets(sceneAssets: SceneAsset[]) {
  localStorage.setItem(STORAGE_KEYS.SCENE_ASSETS, JSON.stringify(sceneAssets));
}

export function loadInstructions(): AnimationInstruction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSTRUCTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load instructions', e);
  }
  return INITIAL_INSTRUCTIONS;
}

export function saveInstructions(instructions: AnimationInstruction[]) {
  localStorage.setItem(STORAGE_KEYS.INSTRUCTIONS, JSON.stringify(instructions));
}

export function loadVoiceTracks(projectId: string): VoiceTrack[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VOICE_TRACKS);
    if (raw) {
      const all: VoiceTrack[] = JSON.parse(raw);
      const filtered = all.filter((v) => v.projectId === projectId);
      if (filtered.length > 0) return filtered;
    }
  } catch (e) {
    console.error('Failed to load voice tracks', e);
  }
  return INITIAL_VOICE_TRACKS;
}

export function saveVoiceTracks(tracks: VoiceTrack[]) {
  localStorage.setItem(STORAGE_KEYS.VOICE_TRACKS, JSON.stringify(tracks));
}

export function loadRenderJobs(): RenderJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RENDER_JOBS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load render jobs', e);
  }
  return [];
}

export function saveRenderJobs(jobs: RenderJob[]) {
  localStorage.setItem(STORAGE_KEYS.RENDER_JOBS, JSON.stringify(jobs));
}

// ----------------------------------------------------
// New AI Specification Persistence Layers
// ----------------------------------------------------

export function loadStyleBible(projectId: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.STYLE_BIBLE}_${projectId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load style bible', e);
  }
  return null;
}

export function saveStyleBible(projectId: string, styleBible: any) {
  localStorage.setItem(`${STORAGE_KEYS.STYLE_BIBLE}_${projectId}`, JSON.stringify(styleBible));
}

export function loadScriptAnalysis(projectId: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.SCRIPT_ANALYSIS}_${projectId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load script analysis', e);
  }
  return null;
}

export function saveScriptAnalysis(projectId: string, analysis: any) {
  localStorage.setItem(`${STORAGE_KEYS.SCRIPT_ANALYSIS}_${projectId}`, JSON.stringify(analysis));
}

export function loadSceneSpecifications(projectId: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.SCENE_SPECS}_${projectId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load scene specifications', e);
  }
  return [];
}

export function saveSceneSpecifications(projectId: string, specs: any[]) {
  localStorage.setItem(`${STORAGE_KEYS.SCENE_SPECS}_${projectId}`, JSON.stringify(specs));
}

export function loadVideoDirection(projectId: string) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.VIDEO_DIRECTION}_${projectId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load video direction', e);
  }
  return null;
}

export function saveVideoDirection(projectId: string, direction: any) {
  localStorage.setItem(`${STORAGE_KEYS.VIDEO_DIRECTION}_${projectId}`, JSON.stringify(direction));
}
