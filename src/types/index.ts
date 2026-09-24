export type AnimationType =
  | 'translate'
  | 'scale'
  | 'rotate'
  | 'opacity'
  | 'fade'
  | 'slide';

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce';

export interface TransformValues {
  x?: number;
  y?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  opacity?: number;
}

export interface AnimationPrimitive {
  id: string;
  type: AnimationType;
  from: TransformValues;
  to: TransformValues;
  startTime: number; // in seconds
  duration: number; // in seconds
  easing: EasingType;
}

export interface AnimationSpec {
  assetId: string;
  animations: AnimationPrimitive[];
}

export interface Asset {
  id: string; // e.g. A001, A002
  projectId: string;
  name: string;
  type: string;
  url: string;
  width: number;
  height: number;
  sizeBytes: number;
  createdAt: string;
}

export interface SceneAsset {
  id: string;
  sceneId: string;
  assetId: string;
  sortOrder: number;
  initialX: number; // relative percentage 0-100 or px
  initialY: number;
  initialScale: number;
  initialOpacity: number;
  initialRotate?: number;
}

export interface AnimationInstruction {
  id: string;
  sceneId: string;
  assetId: string;
  rawInstruction: string;
  spec: AnimationSpec;
  status: 'draft' | 'mapped' | 'reviewed';
  createdAt: string;
  updatedAt: string;
}

export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface VoiceTrack {
  id: string;
  projectId: string;
  sceneId: string;
  title: string;
  text: string;
  voiceName: string;
  rate: number;
  pitch: number;
  duration: number; // in seconds
  audioUrl?: string;
  status: 'ready' | 'draft';
  createdAt: string;
  words?: WordTimestamp[];
  persona?: string;
  waveform?: number[];
}

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type CameraMotion =
  | 'static'
  | 'pan_left'
  | 'pan_right'
  | 'zoom_in'
  | 'zoom_out'
  | 'dramatic_push';

export type TransitionType = 'cut' | 'crossfade' | 'slide_left' | 'slide_right' | 'zoom';

export interface SceneDirectorSettings {
  cameraMotion: CameraMotion;
  cameraIntensity: number; // 0 to 1
  transitionIn: TransitionType;
  transitionDuration: number; // seconds
  pacingPreset: 'dynamic' | 'cinematic' | 'conversational' | 'rapid';
  enableSubtitles: boolean;
}

export interface SceneCaption {
  id: string;
  text: string;
  startTime: number;
  duration: number;
  style: 'modern_bold' | 'minimal' | 'karaoke_glow' | 'boxed';
}

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface RenderJob {
  id: string;
  projectId: string;
  sceneId?: string;
  assetId?: string;
  assetName?: string;
  sceneName?: string;
  status: JobStatus;
  progress: number; // 0 to 100
  outputUrl?: string;
  fileSize?: string;
  duration: number;
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  jobType?: 'single_asset' | 'scene_composite' | 'full_video';
  aspectRatio?: AspectRatio;
  resolution?: string;
}

export interface Scene {
  id: string;
  projectId: string;
  name: string;
  description: string;
  sortOrder: number;
  duration: number; // in seconds (e.g. 5.0)
  createdAt: string;
  updatedAt: string;
  directorSettings?: SceneDirectorSettings;
  captions?: SceneCaption[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  aspectRatio: AspectRatio;
  exportPreset: '1080p' | '720p' | '4k';
  fps: 24 | 30 | 60;
  createdAt: string;
  updatedAt: string;
}

export type StudioTab = 'animation' | 'voice' | 'video' | 'assets' | 'renders';
