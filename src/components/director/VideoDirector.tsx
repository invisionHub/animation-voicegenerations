import React, { useState, useEffect, useRef } from 'react';
import {
  Project,
  Scene,
  SceneAsset,
  Asset,
  VoiceTrack,
  CameraMotion,
  TransitionType,
  SceneCaption,
  AspectRatio,
} from '../../types';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Camera,
  Layers,
  Sliders,
  Type,
  Maximize2,
  ChevronRight,
  Clock,
  Film,
  Check,
  Plus,
  Trash2,
  Eye,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/NotificationToast';

interface VideoDirectorProps {
  project: Project;
  scenes: Scene[];
  assets: Asset[];
  sceneAssets: SceneAsset[];
  voiceTracks: VoiceTrack[];
  onUpdateScene: (scene: Scene) => void;
  onUpdateProject: (project: Project) => void;
  onSelectScene: (sceneId: string) => void;
  onTriggerFullRender: () => void;
}

export const VideoDirector: React.FC<VideoDirectorProps> = ({
  project,
  scenes,
  assets,
  sceneAssets,
  voiceTracks,
  onUpdateScene,
  onUpdateProject,
  onSelectScene,
  onTriggerFullRender,
}) => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const currentScene = scenes[activeSceneIndex] || scenes[0];
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [sequenceTime, setSequenceTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const toast = useToast();

  const totalProjectDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  // Default director settings fallback if not present
  const directorSettings = currentScene?.directorSettings || {
    cameraMotion: 'zoom_in',
    cameraIntensity: 0.15,
    transitionIn: 'crossfade',
    transitionDuration: 0.5,
    pacingPreset: 'conversational',
    enableSubtitles: true,
  };

  const captions = currentScene?.captions || [];

  // Update current scene director settings
  const handleUpdateSettings = (updates: Partial<typeof directorSettings>) => {
    if (!currentScene) return;
    const newSettings = { ...directorSettings, ...updates };
    onUpdateScene({
      ...currentScene,
      directorSettings: newSettings,
      updatedAt: new Date().toISOString(),
    });
  };

  // Generate captions automatically from voice track
  const handleAutoGenerateCaptions = () => {
    const track = voiceTracks.find((vt) => vt.sceneId === currentScene.id);
    if (!track || !track.text.trim()) {
      toast.warning('No voiceover found', 'Add a narration track in the Voice Studio first, or type a caption below.');
      return;
    }

    // Split text into 1-2 sentence caption chunks
    const sentences = track.text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) || [track.text];
    const durationPerSentence = currentScene.duration / Math.max(1, sentences.length);

    const generatedCaptions: SceneCaption[] = sentences.map((sentence, idx) => ({
      id: `cap_${Date.now()}_${idx}`,
      text: sentence.trim(),
      startTime: parseFloat((idx * durationPerSentence).toFixed(2)),
      duration: parseFloat(durationPerSentence.toFixed(2)),
      style: 'modern_bold',
    }));

    onUpdateScene({
      ...currentScene,
      captions: generatedCaptions,
      updatedAt: new Date().toISOString(),
    });

    toast.success('Captions generated', `Created ${generatedCaptions.length} voice-timed subtitle cues.`);
  };

  // Playback loop for multi-scene sequence
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTimestamp) / 1000;
      lastTimestamp = now;

      if (isPlayingSequence) {
        setSequenceTime((prev) => {
          const next = prev + dt;
          if (next >= totalProjectDuration) {
            setIsPlayingSequence(false);
            return 0;
          }

          // Calculate which scene index we are in
          let accumulated = 0;
          for (let i = 0; i < scenes.length; i++) {
            accumulated += scenes[i].duration;
            if (next < accumulated) {
              if (activeSceneIndex !== i) {
                setActiveSceneIndex(i);
              }
              const sceneLocalTime = next - (accumulated - scenes[i].duration);
              // Find matching caption
              const activeCap = scenes[i].captions?.find(
                (c) => sceneLocalTime >= c.startTime && sceneLocalTime <= c.startTime + c.duration
              );
              setActiveSubtitle(activeCap ? activeCap.text : '');
              break;
            }
          }

          return next;
        });
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlayingSequence, totalProjectDuration, scenes, activeSceneIndex]);

  // Compute camera transform values based on camera motion preset
  const getCameraStyle = () => {
    const intensity = directorSettings.cameraIntensity || 0.15;
    const motion = directorSettings.cameraMotion;

    let transform = 'scale(1) translate(0, 0)';
    if (isPlayingSequence) {
      if (motion === 'zoom_in') {
        transform = `scale(${1 + intensity * 0.5})`;
      } else if (motion === 'zoom_out') {
        transform = `scale(${1.2 - intensity * 0.4})`;
      } else if (motion === 'pan_left') {
        transform = `translate(-${intensity * 40}px, 0) scale(1.05)`;
      } else if (motion === 'pan_right') {
        transform = `translate(${intensity * 40}px, 0) scale(1.05)`;
      } else if (motion === 'dramatic_push') {
        transform = `scale(${1.15 + intensity * 0.3}) translate(0, -${intensity * 20}px)`;
      }
    }

    return {
      transform,
      transition: 'transform 3.5s cubic-bezier(0.25, 1, 0.5, 1)',
    };
  };

  // Current scene assets
  const currentSceneAssets = sceneAssets.filter((sa) => sa.sceneId === currentScene?.id);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Bar */}
      <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Video Director</h2>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-mono">
            {scenes.length} Scenes · Total Run: {totalProjectDuration.toFixed(1)}s
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Aspect:</span>
            <select
              value={project.aspectRatio || '16:9'}
              onChange={(e) => onUpdateProject({ ...project, aspectRatio: e.target.value as AspectRatio })}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-hidden"
            >
              <option value="16:9">16:9 Landscape (YouTube)</option>
              <option value="9:16">9:16 Vertical (TikTok/Reels)</option>
              <option value="1:1">1:1 Square (Instagram/Feed)</option>
              <option value="4:5">4:5 Social Portrait</option>
            </select>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={onTriggerFullRender}
            leftIcon={<Film className="w-3.5 h-3.5" />}
          >
            Render Full Composition
          </Button>
        </div>
      </div>

      {/* Main Director Workspace */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Master Scene Preview & Sequence Playback */}
          <div className="lg:col-span-2 space-y-4">
            {/* Live Video Director Stage */}
            <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-800 relative aspect-video flex items-center justify-center">
              {/* Animated Scene Canvas Container */}
              <div
                style={getCameraStyle()}
                className="w-full h-full relative flex items-center justify-center p-8 pointer-events-none"
              >
                {currentSceneAssets.map((sa) => {
                  const asset = assets.find((a) => a.id === sa.assetId);
                  if (!asset) return null;
                  return (
                    <div
                      key={sa.id}
                      style={{
                        position: 'absolute',
                        left: `${sa.initialX}%`,
                        top: `${sa.initialY}%`,
                        transform: `translate(-50%, -50%) scale(${sa.initialScale || 1})`,
                        opacity: sa.initialOpacity ?? 1,
                      }}
                      className="transition-all duration-300"
                    >
                      <img
                        src={asset.url}
                        alt={asset.name}
                        className="max-h-36 max-w-36 object-contain drop-shadow-xl"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Subtitle / Caption Overlay */}
              {directorSettings.enableSubtitles && activeSubtitle && (
                <div className="absolute bottom-6 inset-x-8 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="bg-slate-900/90 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg text-center max-w-lg leading-snug">
                    {activeSubtitle}
                  </div>
                </div>
              )}

              {/* Sequence Metadata Overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white/90 text-[10px] font-mono px-2 py-1 rounded-md border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Scene {activeSceneIndex + 1}/{scenes.length}: {currentScene.name}</span>
                <span className="text-white/40">|</span>
                <span>Camera: {directorSettings.cameraMotion}</span>
              </div>
            </div>

            {/* Sequence Playback Controls & Multi-Scene Timeline */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isPlayingSequence ? 'danger' : 'primary'}
                    onClick={() => setIsPlayingSequence(!isPlayingSequence)}
                    leftIcon={
                      isPlayingSequence ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )
                    }
                  >
                    {isPlayingSequence ? 'Pause Preview' : 'Play Full Sequence'}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsPlayingSequence(false);
                      setSequenceTime(0);
                      setActiveSceneIndex(0);
                    }}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Restart
                  </Button>
                </div>

                <div className="font-mono text-xs text-slate-600 font-semibold">
                  00:{sequenceTime.toFixed(1).padStart(4, '0')} / 00:{totalProjectDuration.toFixed(1)}
                </div>
              </div>

              {/* Multi-Scene Strip */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto pb-1">
                {scenes.map((scene, idx) => {
                  const isActive = idx === activeSceneIndex;
                  return (
                    <div
                      key={scene.id}
                      onClick={() => {
                        setActiveSceneIndex(idx);
                        onSelectScene(scene.id);
                      }}
                      className={`flex-1 min-w-[120px] p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                        isActive
                          ? 'border-blue-500 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="truncate">{scene.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{scene.duration.toFixed(1)}s</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>{scene.directorSettings?.cameraMotion || 'zoom_in'}</span>
                        <Badge size="sm" variant="neutral">
                          {scene.directorSettings?.transitionIn || 'cut'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Camera Motion, Transitions, & Captions Generator */}
          <div className="space-y-5">
            {/* Camera Motion Director Controls */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Camera className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Camera Direction</h3>
              </div>

              {/* Motion Presets */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700">Camera Movement</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'zoom_in', label: 'Zoom In (Focal)' },
                    { id: 'zoom_out', label: 'Zoom Out (Reveal)' },
                    { id: 'pan_left', label: 'Pan Left' },
                    { id: 'pan_right', label: 'Pan Right' },
                    { id: 'dramatic_push', label: 'Dramatic Push' },
                    { id: 'static', label: 'Locked (Static)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleUpdateSettings({ cameraMotion: m.id as CameraMotion })}
                      className={`p-2 rounded-lg border text-left font-medium transition-all ${
                        directorSettings.cameraMotion === m.id
                          ? 'border-blue-500 bg-blue-50/80 text-blue-800 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camera Intensity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Movement Intensity</span>
                  <span className="font-mono text-blue-600">
                    {Math.round((directorSettings.cameraIntensity || 0.15) * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.05"
                  value={directorSettings.cameraIntensity || 0.15}
                  onChange={(e) => handleUpdateSettings({ cameraIntensity: parseFloat(e.target.value) })}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Transition In */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-700">Transition In</label>
                <select
                  value={directorSettings.transitionIn}
                  onChange={(e) => handleUpdateSettings({ transitionIn: e.target.value as TransitionType })}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="cut">Direct Cut (Snappy)</option>
                  <option value="crossfade">Crossfade (Smooth Dissolve)</option>
                  <option value="slide_left">Slide Left (Dynamic)</option>
                  <option value="slide_right">Slide Right</option>
                  <option value="zoom">Zoom Push (Energetic)</option>
                </select>
              </div>
            </div>

            {/* Captions & Subtitles Engine */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">Subtitles & Captions</h3>
                </div>
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={directorSettings.enableSubtitles}
                    onChange={(e) => handleUpdateSettings({ enableSubtitles: e.target.checked })}
                    className="rounded accent-blue-600"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={handleAutoGenerateCaptions}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                >
                  Auto-Generate from Voice
                </Button>
              </div>

              {/* Caption Cue List */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {captions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-2">
                    No caption cues yet. Click "Auto-Generate" or add a subtitle.
                  </p>
                ) : (
                  captions.map((cap) => (
                    <div
                      key={cap.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs space-y-1"
                    >
                      <p className="font-semibold text-slate-800">{cap.text}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Start: {cap.startTime}s</span>
                        <span>Duration: {cap.duration}s</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
