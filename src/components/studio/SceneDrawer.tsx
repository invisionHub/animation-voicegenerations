import React, { useState } from 'react';
import { Scene, SceneAsset } from '../../types';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Clock,
  Film,
  Edit2,
  Check,
  Layers,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface SceneDrawerProps {
  scenes: Scene[];
  activeSceneId: string;
  onSelectScene: (id: string) => void;
  onCreateScene: () => void;
  onUpdateScene: (updated: Scene) => void;
  onDeleteScene: (id: string) => void;
  onReorderScene: (index: number, direction: 'up' | 'down') => void;
  sceneAssets: SceneAsset[];
}

export const SceneDrawer: React.FC<SceneDrawerProps> = ({
  scenes,
  activeSceneId,
  onSelectScene,
  onCreateScene,
  onUpdateScene,
  onDeleteScene,
  onReorderScene,
  sceneAssets,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDuration, setEditDuration] = useState('5.0');

  const startEditing = (scene: Scene, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(scene.id);
    setEditName(scene.name);
    setEditDuration(scene.duration.toString());
  };

  const saveEditing = (scene: Scene) => {
    const dur = parseFloat(editDuration);
    onUpdateScene({
      ...scene,
      name: editName.trim() || scene.name,
      duration: isNaN(dur) || dur <= 0 ? 5.0 : Math.min(60, dur),
      updatedAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full shrink-0 select-none">
      {/* Drawer Header */}
      <div className="px-3.5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">Scenes</span>
          <span className="text-[11px] font-mono text-slate-400">({scenes.length})</span>
        </div>
        <button
          onClick={onCreateScene}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
          title="Add New Scene"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Scene</span>
        </button>
      </div>

      {/* Scene List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {scenes.length === 0 ? (
          <div className="p-4 text-center border border-dashed border-slate-200 rounded-xl my-4">
            <Layers className="w-8 h-8 text-blue-500/60 mx-auto mb-2" />
            <h4 className="text-xs font-semibold text-slate-800">No scenes yet</h4>
            <p className="text-[11px] text-slate-500 mt-1 mb-3 leading-relaxed">
              Scenes are the building blocks of your video. Create your first scene to begin animating.
            </p>
            <Button size="sm" variant="primary" onClick={onCreateScene} leftIcon={<Plus className="w-3 h-3" />}>
              Create your first scene
            </Button>
          </div>
        ) : (
          scenes.map((scene, idx) => {
            const isActive = scene.id === activeSceneId;
            const assignedCount = sceneAssets.filter((sa) => sa.sceneId === scene.id).length;
            const isEditing = editingId === scene.id;

            return (
              <div
                key={scene.id}
                onClick={() => onSelectScene(scene.id)}
                className={`group relative rounded-xl border p-2.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/80 border-blue-400 shadow-2xs ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                {/* Active Accent Pill */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r" />
                )}

                {isEditing ? (
                  <div className="space-y-2 pl-1.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-xs font-semibold px-2 py-1 bg-white border border-blue-500 rounded-md focus:outline-hidden"
                      placeholder="Scene title"
                      autoFocus
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Sec:
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="60"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        className="w-16 text-xs px-1.5 py-0.5 font-mono bg-white border border-slate-200 rounded"
                      />
                      <button
                        onClick={() => saveEditing(scene)}
                        className="ml-auto p-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-2xs"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-1.5 pl-1.5">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isActive ? 'text-blue-950 font-bold' : 'text-slate-800'
                        }`}
                      >
                        {scene.name}
                      </p>
                      {/* Zero-pill metadata */}
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1 font-mono">
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {scene.duration.toFixed(1)}s
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{assignedCount} {assignedCount === 1 ? 'asset' : 'assets'}</span>
                      </div>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => startEditing(scene, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded"
                        title="Edit scene settings"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderScene(idx, 'up');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        disabled={idx === scenes.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReorderScene(idx, 'down');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {scenes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Remove "${scene.name}"?`)) onDeleteScene(scene.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded"
                          title="Delete scene"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
