import React, { useState } from 'react';
import { AnimationPrimitive, AnimationSpec, Asset, EasingType } from '../../types';
import { Modal } from '../common/Modal';
import { Check, Trash2, Sliders, ArrowRight, Play, Eye } from 'lucide-react';
import { getInterpolatedTransform } from '../../utils/videoRenderer';

export interface EditableMappingItem {
  id: string;
  assetId: string;
  rawInstruction: string;
  matchedBy: string;
  spec: AnimationSpec;
}

interface MappingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: EditableMappingItem[];
  availableAssets: Asset[];
  onConfirmMappings: (confirmedItems: EditableMappingItem[]) => void;
}

export const MappingReviewModal: React.FC<MappingReviewModalProps> = ({
  isOpen,
  onClose,
  items: initialItems,
  availableAssets,
  onConfirmMappings,
}) => {
  const [items, setItems] = useState<EditableMappingItem[]>(initialItems);
  const [previewingItemId, setPreviewingItemId] = useState<string | null>(null);
  const [previewProgress, setPreviewProgress] = useState<number>(0);

  // Sync with initialItems when modal opens
  React.useEffect(() => {
    setItems(initialItems);
    if (initialItems.length > 0) {
      setPreviewingItemId(initialItems[0].id);
    }
  }, [initialItems]);

  // Preview animation loop for the selected item
  React.useEffect(() => {
    if (!previewingItemId) return;
    let animFrame: number;
    let startTimestamp: number | null = null;
    const duration = 2.5;

    const tick = (now: number) => {
      if (startTimestamp === null) startTimestamp = now;
      const elapsed = (now - startTimestamp) / 1000;
      const t = elapsed % duration;
      setPreviewProgress(t);
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [previewingItemId]);

  const handleUpdateAssetId = (itemId: string, newAssetId: string) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        return {
          ...it,
          assetId: newAssetId,
          spec: { ...it.spec, assetId: newAssetId },
        };
      })
    );
  };

  const handleUpdateInstruction = (itemId: string, newText: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, rawInstruction: newText } : it))
    );
  };

  const handleUpdatePrimitiveEasing = (itemId: string, primIdx: number, newEasing: EasingType) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const newPrimitives = [...it.spec.animations];
        if (newPrimitives[primIdx]) {
          newPrimitives[primIdx] = { ...newPrimitives[primIdx], easing: newEasing };
        }
        return {
          ...it,
          spec: { ...it.spec, animations: newPrimitives },
        };
      })
    );
  };

  const handleUpdatePrimitiveDuration = (itemId: string, primIdx: number, newDuration: number) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const newPrimitives = [...it.spec.animations];
        if (newPrimitives[primIdx]) {
          newPrimitives[primIdx] = { ...newPrimitives[primIdx], duration: Math.max(0.2, newDuration) };
        }
        return {
          ...it,
          spec: { ...it.spec, animations: newPrimitives },
        };
      })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const activeItem = items.find((it) => it.id === previewingItemId) || items[0];
  const activeAsset = activeItem ? availableAssets.find((a) => a.id === activeItem.assetId) : null;
  const activeTransform = activeItem
    ? getInterpolatedTransform(previewProgress, activeItem.spec)
    : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Animation Mappings & Specifications"
      subtitle="Verify asset bindings and fine-tune animation primitives before applying to the scene."
      maxWidth="4xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Mappings list (2 cols) */}
        <div className="md:col-span-2 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const currentAsset = availableAssets.find((a) => a.id === item.assetId);
            const isPreviewing = item.id === previewingItemId;

            return (
              <div
                key={item.id}
                onClick={() => setPreviewingItemId(item.id)}
                className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                  isPreviewing
                    ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500">
                      Matched by: <span className="font-mono text-slate-700">{item.matchedBy}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewingItemId(item.id);
                      }}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded text-xs flex items-center gap-1"
                      title="Preview in isolation"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Remove mapping"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Target Asset Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Assigned Asset:
                    </label>
                    <select
                      value={item.assetId}
                      onChange={(e) => handleUpdateAssetId(item.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-xs font-mono bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-hidden focus:border-blue-500"
                    >
                      {availableAssets.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.id} — {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">
                      Instruction Text:
                    </label>
                    <input
                      type="text"
                      value={item.rawInstruction}
                      onChange={(e) => handleUpdateInstruction(item.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Generated Animation Primitives Details */}
                <div className="bg-slate-50 p-2 rounded border border-slate-100 space-y-1.5">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    Generated Primitives ({item.spec.animations.length})
                  </div>
                  {item.spec.animations.map((prim, primIdx) => (
                    <div
                      key={prim.id}
                      className="flex items-center justify-between text-xs gap-2 bg-white px-2 py-1 rounded border border-slate-200/60"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700">
                        <span className="font-semibold">{prim.type}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">
                          {prim.type === 'translate' && `(${prim.from.x}, ${prim.from.y}) → (0, 0)`}
                          {prim.type === 'scale' && `${prim.from.scale || 1}x → ${prim.to.scale}x`}
                          {prim.type === 'rotate' && `0° → ${prim.to.rotate}°`}
                          {prim.type === 'fade' && `${prim.from.opacity ?? 0} → ${prim.to.opacity ?? 1}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                          <span>Dur:</span>
                          <input
                            type="number"
                            step="0.2"
                            min="0.2"
                            max="10"
                            value={prim.duration}
                            onChange={(e) =>
                              handleUpdatePrimitiveDuration(item.id, primIdx, parseFloat(e.target.value))
                            }
                            className="w-12 px-1 py-0.5 border border-slate-200 rounded text-center"
                          />
                          <span>s</span>
                        </div>

                        <select
                          value={prim.easing}
                          onChange={(e) =>
                            handleUpdatePrimitiveEasing(item.id, primIdx, e.target.value as EasingType)
                          }
                          className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700"
                        >
                          <option value="easeInOut">easeInOut</option>
                          <option value="easeOut">easeOut</option>
                          <option value="easeIn">easeIn</option>
                          <option value="linear">linear</option>
                          <option value="bounce">bounce</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Isolation Preview Box */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-blue-600" />
                Isolated Animation Preview
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {previewProgress.toFixed(2)}s / 2.50s
              </span>
            </div>

            {/* Preview Stage Box */}
            <div className="w-full aspect-square bg-white rounded-md border border-slate-200 relative overflow-hidden flex items-center justify-center">
              {/* Subtle Grid */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />

              {activeAsset ? (
                <div
                  style={{
                    transform: `translate(${activeTransform.x * 0.4}px, ${activeTransform.y * 0.4}px) rotate(${activeTransform.rotate}deg) scale(${activeTransform.scale * 0.6})`,
                    opacity: activeTransform.opacity,
                    transition: 'none',
                  }}
                  className="relative z-10"
                >
                  <img
                    src={activeAsset.url}
                    alt={activeAsset.name}
                    className="max-h-40 max-w-40 object-contain drop-shadow-md"
                  />
                </div>
              ) : (
                <span className="text-xs text-slate-400">Select an item to preview</span>
              )}
            </div>

            {activeAsset && (
              <div className="mt-3 text-xs space-y-1 text-slate-600">
                <div className="font-semibold text-slate-900">{activeAsset.name}</div>
                <div className="text-[11px] font-mono text-slate-500">
                  ID: {activeAsset.id} · Size: {(activeAsset.sizeBytes / 1024).toFixed(1)} KB
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirmMappings(items)}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm & Apply to Scene</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
