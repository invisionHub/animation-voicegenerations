import {
  AnimationPrimitive,
  AnimationSpec,
  Asset,
  SceneAsset,
  Scene,
  Project,
  AspectRatio,
  VoiceTrack,
} from '../types';

// Easing mathematical functions
export function computeEasing(t: number, easing: string): number {
  const clampT = Math.max(0, Math.min(1, t));
  switch (easing) {
    case 'linear':
      return clampT;
    case 'easeIn':
      return clampT * clampT;
    case 'easeOut':
      return clampT * (2 - clampT);
    case 'easeInOut':
      return clampT < 0.5 ? 2 * clampT * clampT : -1 + (4 - 2 * clampT) * clampT;
    case 'bounce': {
      if (clampT < 1 / 2.75) {
        return 7.5625 * clampT * clampT;
      } else if (clampT < 2 / 2.75) {
        const postT = clampT - 1.5 / 2.75;
        return 7.5625 * postT * postT + 0.75;
      } else if (clampT < 2.5 / 2.75) {
        const postT = clampT - 2.25 / 2.75;
        return 7.5625 * postT * postT + 0.9375;
      } else {
        const postT = clampT - 2.625 / 2.75;
        return 7.5625 * postT * postT + 0.984375;
      }
    }
    default:
      return clampT < 0.5 ? 2 * clampT * clampT : -1 + (4 - 2 * clampT) * clampT;
  }
}

export interface TransformState {
  x: number;
  y: number;
  scale: number;
  rotate: number;
  opacity: number;
}

/**
 * Calculates the visual transform state for an asset at a given time t
 */
export function getInterpolatedTransform(
  currentTime: number,
  spec?: AnimationSpec,
  initialState?: Partial<TransformState>
): TransformState {
  const current: TransformState = {
    x: initialState?.x ?? 0,
    y: initialState?.y ?? 0,
    scale: initialState?.scale ?? 1,
    rotate: initialState?.rotate ?? 0,
    opacity: initialState?.opacity ?? 1,
  };

  if (!spec || !spec.animations || spec.animations.length === 0) {
    return current;
  }

  for (const anim of spec.animations) {
    const { startTime, duration, easing, from, to } = anim;
    if (currentTime < startTime) {
      if (from.x !== undefined) current.x = from.x;
      if (from.y !== undefined) current.y = from.y;
      if (from.scale !== undefined) current.scale = from.scale;
      if (from.rotate !== undefined) current.rotate = from.rotate;
      if (from.opacity !== undefined) current.opacity = from.opacity;
    } else if (currentTime >= startTime + duration) {
      if (to.x !== undefined) current.x = to.x;
      if (to.y !== undefined) current.y = to.y;
      if (to.scale !== undefined) current.scale = to.scale;
      if (to.rotate !== undefined) current.rotate = to.rotate;
      if (to.opacity !== undefined) current.opacity = to.opacity;
    } else {
      const progress = (currentTime - startTime) / duration;
      const easedProgress = computeEasing(progress, easing);

      if (from.x !== undefined && to.x !== undefined) {
        current.x = from.x + (to.x - from.x) * easedProgress;
      }
      if (from.y !== undefined && to.y !== undefined) {
        current.y = from.y + (to.y - from.y) * easedProgress;
      }
      if (from.scale !== undefined && to.scale !== undefined) {
        current.scale = from.scale + (to.scale - from.scale) * easedProgress;
      }
      if (from.rotate !== undefined && to.rotate !== undefined) {
        current.rotate = from.rotate + (to.rotate - from.rotate) * easedProgress;
      }
      if (from.opacity !== undefined && to.opacity !== undefined) {
        current.opacity = Math.max(0, Math.min(1, from.opacity + (to.opacity - from.opacity) * easedProgress));
      }
    }
  }

  return current;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

export function getResolutionDimensions(
  aspectRatio: AspectRatio = '16:9',
  preset: '720p' | '1080p' | '4k' = '1080p'
): { width: number; height: number } {
  if (aspectRatio === '9:16') {
    if (preset === '720p') return { width: 720, height: 1280 };
    if (preset === '4k') return { width: 2160, height: 3840 };
    return { width: 1080, height: 1920 };
  } else if (aspectRatio === '1:1') {
    if (preset === '720p') return { width: 720, height: 720 };
    if (preset === '4k') return { width: 2160, height: 2160 };
    return { width: 1080, height: 1080 };
  } else if (aspectRatio === '4:5') {
    if (preset === '720p') return { width: 720, height: 900 };
    if (preset === '4k') return { width: 2160, height: 2700 };
    return { width: 1080, height: 1350 };
  }
  // Default 16:9
  if (preset === '720p') return { width: 1280, height: 720 };
  if (preset === '4k') return { width: 3840, height: 2160 };
  return { width: 1920, height: 1080 };
}

/**
 * Renders an independent animation clip for a single asset into a WebM video Blob
 */
export async function renderAssetVideoClip(
  asset: Asset,
  spec: AnimationSpec,
  duration: number,
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; url: string; sizeFormatted: string }> {
  const width = 960;
  const height = 540;
  const fps = 30;
  const totalFrames = Math.max(1, Math.round(duration * fps));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not create canvas rendering context');

  const img = await loadImage(asset.url);
  const stream = canvas.captureStream(fps);

  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<{ blob: Blob; url: string; sizeFormatted: string }>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      const sizeKb = (blob.size / 1024).toFixed(1);
      const sizeFormatted = blob.size > 1024 * 1024 ? `${(blob.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeKb} KB`;
      resolve({ blob, url, sizeFormatted });
    };
    recorder.onerror = reject;
  });

  recorder.start();

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    const transform = getInterpolatedTransform(t, spec);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.save();
    const centerX = width / 2 + transform.x;
    const centerY = height / 2 + transform.y;
    ctx.translate(centerX, centerY);
    ctx.rotate((transform.rotate * Math.PI) / 180);
    ctx.scale(transform.scale, transform.scale);
    ctx.globalAlpha = Math.max(0, Math.min(1, transform.opacity));

    const maxDimension = 320;
    const aspect = img.width / img.height;
    let renderW = maxDimension;
    let renderH = maxDimension;
    if (aspect >= 1) renderH = maxDimension / aspect;
    else renderW = maxDimension * aspect;

    ctx.drawImage(img, -renderW / 2, -renderH / 2, renderW, renderH);
    ctx.restore();

    await new Promise((r) => setTimeout(r, 1000 / fps));
    onProgress(Math.round(((f + 1) / totalFrames) * 100));
  }

  recorder.stop();
  return recordingPromise;
}

/**
 * Composite full scene video renderer
 */
export async function renderSceneCompositeVideo(
  assets: Asset[],
  sceneAssets: SceneAsset[],
  specs: Record<string, AnimationSpec>,
  duration: number,
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; url: string; sizeFormatted: string }> {
  const width = 1280;
  const height = 720;
  const fps = 30;
  const totalFrames = Math.max(1, Math.round(duration * fps));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  const loadedImages: Record<string, HTMLImageElement> = {};
  for (const a of assets) {
    try {
      loadedImages[a.id] = await loadImage(a.url);
    } catch {
      // ignore individual image load failures
    }
  }

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream);
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const finishPromise = new Promise<{ blob: Blob; url: string; sizeFormatted: string }>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const sizeFormatted = `${(blob.size / (1024 * 1024)).toFixed(2)} MB`;
      resolve({ blob, url, sizeFormatted });
    };
    recorder.onerror = reject;
  });

  recorder.start();

  for (let f = 0; f < totalFrames; f++) {
    const t = f / fps;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    for (const sa of sceneAssets) {
      const img = loadedImages[sa.assetId];
      if (!img) continue;

      const spec = specs[sa.assetId];
      const transform = getInterpolatedTransform(t, spec, {
        x: (sa.initialX / 100) * width - width / 2,
        y: (sa.initialY / 100) * height - height / 2,
        scale: sa.initialScale || 1,
        opacity: sa.initialOpacity ?? 1,
        rotate: sa.initialRotate || 0,
      });

      ctx.save();
      const centerX = width / 2 + transform.x;
      const centerY = height / 2 + transform.y;
      ctx.translate(centerX, centerY);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      ctx.scale(transform.scale, transform.scale);
      ctx.globalAlpha = Math.max(0, Math.min(1, transform.opacity));

      const maxDim = 280;
      const aspect = img.width / img.height;
      let rw = maxDim;
      let rh = maxDim;
      if (aspect >= 1) rh = maxDim / aspect;
      else rw = maxDim * aspect;

      ctx.drawImage(img, -rw / 2, -rh / 2, rw, rh);
      ctx.restore();
    }

    await new Promise((r) => setTimeout(r, 1000 / fps));
    onProgress(Math.round(((f + 1) / totalFrames) * 100));
  }

  recorder.stop();
  return finishPromise;
}

/**
 * Full Project Multi-Scene Video Stitcher with Transitions, Camera Motion, & Subtitles
 */
export async function renderFullProjectVideo(
  project: Project,
  scenes: Scene[],
  assets: Asset[],
  sceneAssets: SceneAsset[],
  specs: Record<string, AnimationSpec>,
  voiceTracks: VoiceTrack[],
  onProgress: (progress: number) => void
): Promise<{ blob: Blob; url: string; sizeFormatted: string }> {
  const { width, height } = getResolutionDimensions(project.aspectRatio, project.exportPreset);
  const fps = project.fps || 30;
  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
  const totalFrames = Math.max(1, Math.round(totalDuration * fps));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  // Pre-load all assets
  const loadedImages: Record<string, HTMLImageElement> = {};
  for (const a of assets) {
    try {
      loadedImages[a.id] = await loadImage(a.url);
    } catch {
      // ignore load failures
    }
  }

  const stream = canvas.captureStream(fps);
  let mimeType = 'video/webm;codecs=vp9';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
  if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const finishPromise = new Promise<{ blob: Blob; url: string; sizeFormatted: string }>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
      resolve({ blob, url, sizeFormatted: `${sizeMb} MB` });
    };
    recorder.onerror = reject;
  });

  recorder.start();

  let globalTime = 0;
  const dt = 1 / fps;

  for (let f = 0; f < totalFrames; f++) {
    globalTime = f * dt;

    // Determine active scene
    let accumulated = 0;
    let activeScene = scenes[0];
    let sceneLocalTime = 0;

    for (let i = 0; i < scenes.length; i++) {
      const s = scenes[i];
      if (globalTime < accumulated + s.duration || i === scenes.length - 1) {
        activeScene = s;
        sceneLocalTime = globalTime - accumulated;
        break;
      }
      accumulated += s.duration;
    }

    const currentSceneAssets = sceneAssets.filter((sa) => sa.sceneId === activeScene.id);
    const cameraSettings = activeScene.directorSettings || {
      cameraMotion: 'zoom_in',
      cameraIntensity: 0.15,
      transitionIn: 'cut',
      transitionDuration: 0.5,
      pacingPreset: 'conversational',
      enableSubtitles: true,
    };

    // Camera transform math
    const camProgress = Math.min(1, sceneLocalTime / activeScene.duration);
    let camScale = 1;
    let camPanX = 0;
    let camPanY = 0;

    if (cameraSettings.cameraMotion === 'zoom_in') {
      camScale = 1 + camProgress * cameraSettings.cameraIntensity;
    } else if (cameraSettings.cameraMotion === 'zoom_out') {
      camScale = 1 + (1 - camProgress) * cameraSettings.cameraIntensity;
    } else if (cameraSettings.cameraMotion === 'pan_left') {
      camPanX = -camProgress * cameraSettings.cameraIntensity * width * 0.1;
      camScale = 1.05;
    } else if (cameraSettings.cameraMotion === 'pan_right') {
      camPanX = camProgress * cameraSettings.cameraIntensity * width * 0.1;
      camScale = 1.05;
    } else if (cameraSettings.cameraMotion === 'dramatic_push') {
      camScale = 1 + camProgress * cameraSettings.cameraIntensity * 1.5;
    }

    // Clean background
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Apply Camera transform
    ctx.translate(width / 2 + camPanX, height / 2 + camPanY);
    ctx.scale(camScale, camScale);
    ctx.translate(-width / 2, -height / 2);

    // Render Scene Assets
    for (const sa of currentSceneAssets) {
      const img = loadedImages[sa.assetId];
      if (!img) continue;

      const spec = specs[sa.assetId];
      const transform = getInterpolatedTransform(sceneLocalTime, spec, {
        x: (sa.initialX / 100) * width - width / 2,
        y: (sa.initialY / 100) * height - height / 2,
        scale: sa.initialScale || 1,
        opacity: sa.initialOpacity ?? 1,
        rotate: sa.initialRotate || 0,
      });

      ctx.save();
      const centerX = width / 2 + transform.x;
      const centerY = height / 2 + transform.y;
      ctx.translate(centerX, centerY);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      ctx.scale(transform.scale, transform.scale);
      ctx.globalAlpha = Math.max(0, Math.min(1, transform.opacity));

      const maxDim = Math.min(width, height) * 0.35;
      const aspect = img.width / img.height;
      let rw = maxDim;
      let rh = maxDim;
      if (aspect >= 1) rh = maxDim / aspect;
      else rw = maxDim * aspect;

      ctx.drawImage(img, -rw / 2, -rh / 2, rw, rh);
      ctx.restore();
    }
    ctx.restore();

    // Render Subtitles / Captions if enabled
    if (cameraSettings.enableSubtitles && activeScene.captions) {
      const activeCaption = activeScene.captions.find(
        (c) => sceneLocalTime >= c.startTime && sceneLocalTime <= c.startTime + c.duration
      );

      if (activeCaption) {
        ctx.save();
        ctx.font = `bold ${Math.round(height * 0.038)}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = activeCaption.text;
        const textMetrics = ctx.measureText(text);
        const paddingX = 24;
        const paddingY = 14;
        const boxW = textMetrics.width + paddingX * 2;
        const boxH = Math.round(height * 0.065);
        const boxX = width / 2 - boxW / 2;
        const boxY = height * 0.86;

        // Subtitle Pill
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12);
        ctx.fill();

        // Subtitle Text
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(text, width / 2, boxY + boxH / 2);
        ctx.restore();
      }
    }

    // Watermark
    ctx.save();
    ctx.font = `600 ${Math.round(height * 0.024)}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.textAlign = 'right';
    ctx.fillText('BlueStudio', width - 24, 36);
    ctx.restore();

    await new Promise((r) => setTimeout(r, 1000 / fps));
    onProgress(Math.round(((f + 1) / totalFrames) * 100));
  }

  recorder.stop();
  return finishPromise;
}
