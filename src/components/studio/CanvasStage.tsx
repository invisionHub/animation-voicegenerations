import React, { useState } from 'react';
import { AnimationSpec, Asset, SceneAsset } from '../../types';
import { getInterpolatedTransform } from '../../utils/videoRenderer';
import { Maximize2, Grid, Eye, EyeOff, ZoomIn, ZoomOut } from 'lucide-react';

interface CanvasStageProps {
  sceneAssets: SceneAsset[];
  assets: Asset[];
  specs: Record<string, AnimationSpec>;
  currentTime: number;
  duration: number;
  selectedAssetId: string | null;
  onSelectAsset: (assetId: string | null) => void;
  isolatedAssetId: string | null;
  onToggleIsolate: (assetId: string | null) => void;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({
  sceneAssets,
  assets,
  specs,
  currentTime,
  selectedAssetId,
  onSelectAsset,
  isolatedAssetId,
  onToggleIsolate,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Filter assets to render: if isolatedAssetId is set, only render that one
  const assetsToRender = isolatedAssetId
    ? sceneAssets.filter((sa) => sa.assetId === isolatedAssetId)
    : sceneAssets;

  return (
    <div className="flex-1 flex flex-col bg-slate-100 relative overflow-hidden select-none">
      {/* Canvas Top Bar Controls */}
      <div className="h-10 bg-white/90 backdrop-blur-xs border-b border-slate-200 px-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="font-medium text-slate-800">Preview Canvas</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="font-mono text-slate-500">1920 × 1080 (16:9)</span>
          {isolatedAssetId && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-blue-600 font-medium flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                Isolate: {isolatedAssetId}
                <button
                  onClick={() => onToggleIsolate(null)}
                  className="ml-1 text-[11px] underline hover:text-blue-800"
                >
                  (Reset)
                </button>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded transition-colors ${
              showGrid ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Toggle alignment grid"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.4, z - 0.1))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded"
              title="Zoom out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-slate-600">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
              className="p-1 text-slate-500 hover:text-slate-900 rounded"
              title="Zoom in"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(0.8)}
              className="p-1 text-slate-500 hover:text-slate-900 rounded"
              title="Fit to stage"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Workspace */}
      <div
        className="flex-1 overflow-auto flex items-center justify-center p-6 relative"
        onClick={() => onSelectAsset(null)}
      >
        {/* 16:9 Canvas Stage Container (simulating 960x540 base scaled) */}
        <div
          style={{
            width: `${960 * zoomLevel}px`,
            height: `${540 * zoomLevel}px`,
            transformOrigin: 'center center',
          }}
          className="relative bg-white shadow-xl rounded-md border border-slate-200 overflow-hidden transition-all duration-75"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Studio Canvas Grid Background */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                backgroundSize: `${32 * zoomLevel}px ${32 * zoomLevel}px`,
              }}
            />
          )}

          {/* Center Safe Guide Lines */}
          {showGrid && (
            <>
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-blue-200/60 pointer-events-none" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-200/60 pointer-events-none" />
            </>
          )}

          {/* Render Scene Assets */}
          {assetsToRender.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center select-none">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 border border-blue-100">
                <EyeOff className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs font-bold text-slate-800">Your scene canvas is ready</p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1 leading-relaxed">
                Add assets from your Asset Library or enter animation instructions below to bring this scene to life.
              </p>
            </div>
          ) : (
            assetsToRender.map((sa) => {
              const asset = assets.find((a) => a.id === sa.assetId);
              if (!asset) return null;

              const spec = specs[sa.assetId];
              // Compute exact animated transform state at current time
              const transform = getInterpolatedTransform(currentTime, spec, {
                x: (sa.initialX / 100) * 960 - 480,
                y: (sa.initialY / 100) * 540 - 270,
                scale: sa.initialScale || 1,
                rotate: sa.initialRotate || 0,
                opacity: sa.initialOpacity ?? 1,
              });

              const isSelected = selectedAssetId === sa.assetId;

              // Scale asset coordinates to match zoomLevel
              const renderCenterX = (960 / 2 + transform.x) * zoomLevel;
              const renderCenterY = (540 / 2 + transform.y) * zoomLevel;
              const baseWidth = Math.min(260, asset.width || 240) * zoomLevel * transform.scale;

              return (
                <div
                  key={sa.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectAsset(sa.assetId);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${renderCenterX}px`,
                    top: `${renderCenterY}px`,
                    transform: `translate(-50%, -50%) rotate(${transform.rotate}deg)`,
                    opacity: transform.opacity,
                    cursor: 'pointer',
                    zIndex: sa.sortOrder + 10,
                  }}
                  className={`group transition-opacity duration-75 ${
                    isSelected ? 'ring-2 ring-blue-600 ring-offset-2' : 'hover:ring-1 hover:ring-blue-400'
                  }`}
                >
                  <img
                    src={asset.url}
                    alt={asset.name}
                    style={{
                      width: `${baseWidth}px`,
                      height: 'auto',
                      display: 'block',
                      pointerEvents: 'none',
                    }}
                    referrerPolicy="no-referrer"
                  />

                  {/* Asset ID Tag on hover / selection */}
                  <div
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none transition-opacity ${
                      isSelected
                        ? 'bg-blue-600 text-white opacity-100 font-semibold'
                        : 'bg-slate-800/80 text-white opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    {asset.id} · {asset.name}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
