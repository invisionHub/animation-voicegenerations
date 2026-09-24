import React from 'react';
import { AnimationPrimitive, AnimationSpec, Asset, Scene, SceneAsset } from '../../types';
import {
  Sliders,
  Plus,
  Trash2,
  DownloadCloud,
  Layers,
  Move,
  RotateCw,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InspectorPanelProps {
  selectedAssetId: string | null;
  assets: Asset[];
  sceneAssets: SceneAsset[];
  specs: Record<string, AnimationSpec>;
  activeScene: Scene;
  onUpdateSceneAsset: (updated: SceneAsset) => void;
  onUpdateSpec: (assetId: string, updatedSpec: AnimationSpec) => void;
  onRenderSingleAsset: (assetId: string) => void;
  onUnassignAssetFromScene: (assetId: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedAssetId,
  assets,
  sceneAssets,
  specs,
  activeScene,
  onUpdateSceneAsset,
  onUpdateSpec,
  onRenderSingleAsset,
  onUnassignAssetFromScene,
}) => {
  if (!selectedAssetId) {
    // Friendly Scene-level Overview when nothing is selected
    return (
      <div className="w-72 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 select-none p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-3">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Scene Overview</span>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Active Scene
            </span>
            <p className="font-bold text-slate-900">{activeScene.name}</p>
            {activeScene.description && (
              <p className="text-slate-500 mt-0.5 leading-relaxed">{activeScene.description}</p>
            )}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-900 font-mono">{activeScene.duration.toFixed(1)} seconds</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Assigned Assets:</span>
              <span className="font-semibold text-slate-900 font-mono">{sceneAssets.length}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-slate-600 text-[11px] leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>Click any asset on the canvas or timeline to inspect transforms and motion keyframes.</span>
          </div>
        </div>
      </div>
    );
  }

  const asset = assets.find((a) => a.id === selectedAssetId);
  const sceneAsset = sceneAssets.find((sa) => sa.assetId === selectedAssetId);
  const spec = specs[selectedAssetId];

  if (!asset || !sceneAsset) {
    return null;
  }

  const handleAddPrimitive = () => {
    const newPrim: AnimationPrimitive = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'scale',
      from: { scale: 1 },
      to: { scale: 1.15 },
      startTime: 0,
      duration: 2.0,
      easing: 'easeInOut',
    };
    const currentList = spec?.animations || [];
    onUpdateSpec(selectedAssetId, {
      assetId: selectedAssetId,
      animations: [...currentList, newPrim],
    });
  };

  const handleRemovePrimitive = (primId: string) => {
    if (!spec) return;
    onUpdateSpec(selectedAssetId, {
      ...spec,
      animations: spec.animations.filter((a) => a.id !== primId),
    });
  };

  return (
    <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shrink-0 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-900">Asset Inspector</span>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded-md border border-blue-200">
          {asset.id}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {/* Asset Identity Card */}
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 shrink-0">
            <img src={asset.url} alt={asset.name} className="max-h-full max-w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1 text-xs">
            <p className="font-bold text-slate-900 truncate">{asset.name}</p>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              {asset.width}×{asset.height} · {(asset.sizeBytes / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>

        {/* Initial Canvas Transform Coordinates */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Initial Stage Placement
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Move className="w-3 h-3 text-slate-400" /> Pos X (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(sceneAsset.initialX)}
                onChange={(e) =>
                  onUpdateSceneAsset({ ...sceneAsset, initialX: parseFloat(e.target.value) || 0 })
                }
                className="w-full font-mono text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Move className="w-3 h-3 text-slate-400" /> Pos Y (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={Math.round(sceneAsset.initialY)}
                onChange={(e) =>
                  onUpdateSceneAsset({ ...sceneAsset, initialY: parseFloat(e.target.value) || 0 })
                }
                className="w-full font-mono text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <Maximize2 className="w-3 h-3 text-slate-400" /> Scale
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="3"
                value={sceneAsset.initialScale}
                onChange={(e) =>
                  onUpdateSceneAsset({ ...sceneAsset, initialScale: parseFloat(e.target.value) || 1 })
                }
                className="w-full font-mono text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500 flex items-center gap-1 mb-1 font-medium">
                <RotateCw className="w-3 h-3 text-slate-400" /> Rotate (deg)
              </label>
              <input
                type="number"
                min="-360"
                max="360"
                value={sceneAsset.initialRotate || 0}
                onChange={(e) =>
                  onUpdateSceneAsset({ ...sceneAsset, initialRotate: parseFloat(e.target.value) || 0 })
                }
                className="w-full font-mono text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Animation Primitives List */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Motion Keyframes ({spec?.animations?.length || 0})
            </span>
            <button
              onClick={handleAddPrimitive}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {(!spec || spec.animations.length === 0) && (
              <p className="text-xs text-slate-400 italic">No animation keyframes mapped yet.</p>
            )}

            {spec?.animations?.map((prim) => (
              <div
                key={prim.id}
                className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 font-mono text-[11px]">
                    {prim.type.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleRemovePrimitive(prim.id)}
                    className="text-slate-400 hover:text-red-600 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-slate-600 flex justify-between">
                  <span>Start: {prim.startTime}s</span>
                  <span>Duration: {prim.duration}s</span>
                  <span className="text-blue-600">{prim.easing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons: Render Independent Clip */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <Button
            size="sm"
            variant="outline"
            className="w-full text-blue-700 bg-blue-50/60 border-blue-200 hover:bg-blue-100"
            onClick={() => onRenderSingleAsset(selectedAssetId)}
            leftIcon={<DownloadCloud className="w-3.5 h-3.5 text-blue-600" />}
          >
            Render Independent Clip ({asset.id})
          </Button>

          <button
            onClick={() => onUnassignAssetFromScene(selectedAssetId)}
            className="w-full text-center text-xs text-slate-500 hover:text-red-600 py-1 transition-colors"
          >
            Remove from this Scene
          </button>
        </div>
      </div>
    </div>
  );
};
