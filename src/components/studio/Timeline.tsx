import React, { useRef } from 'react';
import { AnimationSpec, Asset, SceneAsset, VoiceTrack } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Repeat,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TimelineProps {
  duration: number; // in seconds
  currentTime: number; // in seconds
  isPlaying: boolean;
  playbackSpeed: number;
  isLooping: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onChangeSpeed: (speed: number) => void;
  onToggleLoop: () => void;
  sceneAssets: SceneAsset[];
  assets: Asset[];
  specs: Record<string, AnimationSpec>;
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string | null) => void;
  isolatedAssetId: string | null;
  onToggleIsolate: (assetId: string | null) => void;
  voiceTrack?: VoiceTrack;
}

export const Timeline: React.FC<TimelineProps> = ({
  duration,
  currentTime,
  isPlaying,
  playbackSpeed,
  isLooping,
  onTogglePlay,
  onSeek,
  onChangeSpeed,
  onToggleLoop,
  sceneAssets,
  assets,
  specs,
  selectedAssetId,
  onSelectAsset,
  isolatedAssetId,
  onToggleIsolate,
  voiceTrack,
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);

  const formatTimecode = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`;
  };

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(ratio * duration);
  };

  // Generate ruler tick marks (e.g. every 0.5s or 1s)
  const ticksCount = Math.ceil(duration);
  const playheadPercent = Math.max(0, Math.min(100, (currentTime / duration) * 100));

  return (
    <div className="h-64 bg-white border-t border-slate-200 flex flex-col shrink-0 select-none z-20">
      {/* Top Controls Toolbar */}
      <div className="h-10 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        {/* Playback Transport */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSeek(0)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors"
            title="Restart from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onTogglePlay}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play</span>
              </>
            )}
          </button>
          <button
            onClick={onToggleLoop}
            className={`p-1.5 rounded transition-colors ${
              isLooping ? 'bg-blue-100 text-blue-700' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Loop playback"
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 ml-2 bg-white border border-slate-200 rounded px-1.5 py-0.5">
            {[0.5, 1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`text-[10px] font-mono px-1 py-0.5 rounded ${
                  playbackSpeed === s ? 'bg-blue-600 text-white font-semibold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Timecode Readout */}
        <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
          <span className="font-semibold text-blue-600 tabular-nums">
            {formatTimecode(currentTime)}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 tabular-nums">
            {formatTimecode(duration)}
          </span>
        </div>
      </div>

      {/* Timeline Layout: Left Track Headers (220px) + Right Sequencer Tracks */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Headers Column */}
        <div className="w-56 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="h-7 px-3 border-b border-slate-200 flex items-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Layer / Track
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {/* Voice Narration Track Header */}
            {voiceTrack && (
              <div className="h-10 px-3 flex items-center justify-between bg-blue-50/40 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <Volume2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-medium text-blue-900 truncate">Voice Narration</span>
                </div>
                <span className="text-[10px] font-mono text-blue-600">
                  {voiceTrack.duration.toFixed(1)}s
                </span>
              </div>
            )}

            {/* Asset Track Headers */}
            {sceneAssets.map((sa) => {
              const asset = assets.find((a) => a.id === sa.assetId);
              const isSelected = selectedAssetId === sa.assetId;
              const isIsolated = isolatedAssetId === sa.assetId;

              return (
                <div
                  key={sa.id}
                  onClick={() => onSelectAsset(sa.assetId)}
                  className={`h-10 px-3 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-100/70 font-medium' : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] font-mono px-1 bg-white border border-slate-200 rounded text-slate-700">
                      {sa.assetId}
                    </span>
                    <span className="truncate text-slate-800">{asset?.name || sa.assetId}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleIsolate(isIsolated ? null : sa.assetId);
                    }}
                    className={`p-1 rounded transition-colors ${
                      isIsolated ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={isIsolated ? 'Exit isolate mode' : 'Isolate asset in preview'}
                  >
                    {isIsolated ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sequencer Area */}
        <div className="flex-1 flex flex-col relative overflow-x-auto bg-slate-50/30">
          {/* Time Ruler */}
          <div
            ref={rulerRef}
            onClick={handleRulerClick}
            className="h-7 bg-white border-b border-slate-200 relative cursor-pointer select-none"
          >
            {/* Ticks and second markers */}
            {Array.from({ length: ticksCount + 1 }).map((_, i) => {
              const posPercent = (i / duration) * 100;
              if (posPercent > 100) return null;
              return (
                <div
                  key={i}
                  style={{ left: `${posPercent}%` }}
                  className="absolute top-0 bottom-0 flex flex-col justify-end"
                >
                  <div className="h-3 w-px bg-slate-300"></div>
                  <span className="text-[9px] font-mono text-slate-500 pl-1 -mb-0.5">
                    {i}s
                  </span>
                </div>
              );
            })}

            {/* Playhead Marker on Ruler */}
            <div
              style={{ left: `${playheadPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-blue-600 z-30 pointer-events-none"
            >
              <div className="w-3 h-3 bg-blue-600 text-white rounded-full -ml-1.5 -mt-0.5 shadow-sm"></div>
            </div>
          </div>

          {/* Keyframe Track Lanes */}
          <div className="flex-1 relative overflow-y-auto divide-y divide-slate-100">
            {/* Voice Track Lane */}
            {voiceTrack && (
              <div
                onClick={handleRulerClick}
                className="h-10 relative bg-blue-50/20 border-b border-slate-100 flex items-center cursor-pointer"
              >
                <div
                  style={{
                    left: '0%',
                    width: `${Math.min(100, (voiceTrack.duration / duration) * 100)}%`,
                  }}
                  className="absolute h-6 rounded bg-blue-100/90 border border-blue-300 flex items-center px-2 overflow-hidden"
                >
                  {/* Simulated Audio Waveform Peaks */}
                  <div className="flex items-center gap-0.5 w-full opacity-60">
                    {Array.from({ length: 48 }).map((_, idx) => {
                      const h = 4 + ((idx * 7) % 16);
                      return (
                        <div
                          key={idx}
                          style={{ height: `${h}px` }}
                          className="w-1 bg-blue-600 rounded-full"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Asset Track Lanes */}
            {sceneAssets.map((sa) => {
              const spec = specs[sa.assetId];
              const isSelected = selectedAssetId === sa.assetId;

              // Calculate bounding span of animation primitives for this asset
              let animStart = 0;
              let animEnd = 2.0;
              if (spec && spec.animations && spec.animations.length > 0) {
                animStart = Math.min(...spec.animations.map((a) => a.startTime));
                animEnd = Math.max(...spec.animations.map((a) => a.startTime + a.duration));
              }

              const leftPercent = (animStart / duration) * 100;
              const widthPercent = Math.max(4, ((animEnd - animStart) / duration) * 100);

              return (
                <div
                  key={sa.id}
                  onClick={handleRulerClick}
                  className={`h-10 relative flex items-center cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Animation Keyframe Bar */}
                  <div
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.min(100 - leftPercent, widthPercent)}%`,
                    }}
                    className={`absolute h-6 rounded px-2 flex items-center justify-between text-[10px] font-medium shadow-2xs border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-blue-100 text-blue-900 border-blue-200 hover:bg-blue-200'
                    }`}
                  >
                    <span className="truncate">
                      {spec?.animations?.map((a) => a.type).join(', ') || 'static'}
                    </span>
                    <span className="font-mono text-[9px] opacity-80 pl-1 shrink-0">
                      {(animEnd - animStart).toFixed(1)}s
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Full Vertical Playhead Line spanning all lanes */}
            <div
              style={{ left: `${playheadPercent}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-blue-600 pointer-events-none z-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
