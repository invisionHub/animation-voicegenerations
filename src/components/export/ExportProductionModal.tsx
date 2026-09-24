import React, { useState } from 'react';
import { Project, Scene, Asset, SceneAsset, VoiceTrack, AspectRatio } from '../../types';
import {
  Film,
  Download,
  Settings,
  FileJson,
  Monitor,
  Smartphone,
  Square,
  Sparkles,
  Layers,
  Check,
  Code,
} from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { useToast } from '../ui/NotificationToast';

interface ExportProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  scenes: Scene[];
  assets: Asset[];
  sceneAssets: SceneAsset[];
  voiceTracks: VoiceTrack[];
  activeScene: Scene;
  onStartFullRender: (settings: {
    target: 'full' | 'scene';
    aspectRatio: AspectRatio;
    resolution: '720p' | '1080p' | '4k';
    fps: 24 | 30 | 60;
  }) => void;
}

export const ExportProductionModal: React.FC<ExportProductionModalProps> = ({
  isOpen,
  onClose,
  project,
  scenes,
  assets,
  sceneAssets,
  voiceTracks,
  activeScene,
  onStartFullRender,
}) => {
  const [target, setTarget] = useState<'full' | 'scene'>('full');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio || '16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4k'>('1080p');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const toast = useToast();

  const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);

  const handleExportProjectJson = () => {
    const exportBundle = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      project,
      scenes,
      assets,
      sceneAssets,
      voiceTracks,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.name.toLowerCase().replace(/\s+/g, '_')}_project.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success('Project archive downloaded', 'Full project JSON package saved to your device.');
  };

  const handleExportStandaloneHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${project.name} — BlueStudio Production Player</title>
  <style>
    body { margin: 0; background: #0f172a; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    .player-card { background: #1e293b; border-radius: 16px; border: 1px solid #334155; padding: 24px; max-width: 800px; width: 90%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    h1 { font-size: 1.25rem; margin: 0 0 8px 0; color: #f8fafc; }
    p { font-size: 0.875rem; color: #94a3b8; margin: 0 0 20px 0; }
    .scene-pill { display: inline-block; background: #2563eb; color: #fff; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; margin-right: 8px; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="player-card">
    <h1>${project.name}</h1>
    <p>${project.description || 'Exported interactive production bundle from BlueStudio.'}</p>
    <div style="margin-bottom: 16px;">
      ${scenes.map((s, idx) => `<span class="scene-pill">Scene ${idx + 1}: ${s.name} (${s.duration.toFixed(1)}s)</span>`).join('')}
    </div>
    <div style="font-size: 0.75rem; color: #64748b; margin-top: 24px; border-top: 1px solid #334155; padding-top: 12px;">
      Exported via BlueStudio Creative Production Engine · Aspect Ratio: ${aspectRatio}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_player.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    toast.success('HTML Player exported', 'Standalone interactive web player generated.');
  };

  const handleSubmitRender = () => {
    onStartFullRender({
      target,
      aspectRatio,
      resolution,
      fps,
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Production Export & Rendering"
      subtitle="Configure output formats, camera rendering, aspect ratios, and standalone project bundles."
      maxWidth="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportProjectJson}
              leftIcon={<FileJson className="w-3.5 h-3.5 text-blue-600" />}
            >
              Export JSON Archive
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportStandaloneHtml}
              leftIcon={<Code className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Standalone HTML Player
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSubmitRender}
              leftIcon={<Film className="w-3.5 h-3.5" />}
            >
              Start Render
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Target Scope */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Render Scope
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div
              onClick={() => setTarget('full')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                target === 'full'
                  ? 'border-blue-500 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                <span>Complete Video (All Scenes)</span>
                {target === 'full' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Stitches all {scenes.length} scenes, camera motions, speech sync, and subtitles ({totalDuration.toFixed(1)}s total).
              </p>
            </div>

            <div
              onClick={() => setTarget('scene')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                target === 'scene'
                  ? 'border-blue-500 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                <span>Active Scene Only</span>
                {target === 'scene' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                "{activeScene.name}" composite clip with all layered animations ({activeScene.duration.toFixed(1)}s).
              </p>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Selection */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
            Aspect Ratio & Format
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: '16:9', label: '16:9', desc: 'YouTube & Web', icon: Monitor },
              { id: '9:16', label: '9:16', desc: 'TikTok & Shorts', icon: Smartphone },
              { id: '1:1', label: '1:1', desc: 'Square Post', icon: Square },
              { id: '4:5', label: '4:5', desc: 'Social Portrait', icon: Smartphone },
            ].map((ar) => {
              const IconComp = ar.icon;
              const isSelected = aspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id as AspectRatio)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-bold shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <IconComp className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                  <div className="text-xs font-semibold">{ar.label}</div>
                  <div className="text-[10px] text-slate-400">{ar.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality & Framerate */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Resolution
            </label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value as any)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="1080p">1080p Full HD (Recommended)</option>
              <option value="720p">720p Fast Export</option>
              <option value="4k">4K Ultra High Definition</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Framerate
            </label>
            <select
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value) as any)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value={30}>30 FPS (Standard Smooth)</option>
              <option value={24}>24 FPS (Cinematic Film Look)</option>
              <option value={60}>60 FPS (Ultra Fluid Motion)</option>
            </select>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
