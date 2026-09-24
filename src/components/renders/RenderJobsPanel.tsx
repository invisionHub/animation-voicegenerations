import React, { useState } from 'react';
import { RenderJob, Scene } from '../../types';
import {
  DownloadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Play,
  Trash2,
  RefreshCw,
  Film,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';

interface RenderJobsPanelProps {
  jobs: RenderJob[];
  scenes: Scene[];
  onTriggerBatchRender: (sceneId: string) => void;
  onTriggerCompositeRender: (sceneId: string) => void;
  onClearJobs: () => void;
  activeSceneId: string;
}

export const RenderJobsPanel: React.FC<RenderJobsPanelProps> = ({
  jobs,
  scenes,
  onTriggerBatchRender,
  onTriggerCompositeRender,
  onClearJobs,
  activeSceneId,
}) => {
  const [selectedSceneForRender, setSelectedSceneForRender] = useState(activeSceneId);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const activeJobs = jobs.filter((j) => j.status === 'PROCESSING' || j.status === 'QUEUED');
  const completedJobs = jobs.filter((j) => j.status === 'COMPLETED');

  const handleDownload = (outputUrl: string, filename: string) => {
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Action Header */}
      <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <DownloadCloud className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Render Queue & Production Output</h2>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-mono tabular-nums">
            {jobs.length} total {jobs.length === 1 ? 'render' : 'renders'} ({completedJobs.length} completed)
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Target Scene Selector */}
          <select
            value={selectedSceneForRender}
            onChange={(e) => setSelectedSceneForRender(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-hidden focus:border-blue-500"
          >
            {scenes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onTriggerBatchRender(selectedSceneForRender)}
            leftIcon={<Layers className="w-3.5 h-3.5 text-blue-600" />}
          >
            Render Independent Clips
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={() => onTriggerCompositeRender(selectedSceneForRender)}
            leftIcon={<Film className="w-3.5 h-3.5" />}
          >
            Composite Scene
          </Button>

          {jobs.length > 0 && (
            <button
              onClick={onClearJobs}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors ml-1"
              title="Clear all job history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content: Table and Progress Cards */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {jobs.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-400 max-w-md mx-auto my-12 bg-slate-50/50">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-100">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-slate-800">Your Render Queue is Empty</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              When you export scenes, animated clips, or the complete video, they will process frame-by-frame and appear here for preview and download.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Job ID</th>
                  <th className="py-3 px-4">Type & Title</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => {
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">{job.id}</td>

                      <td className="py-3 px-4 text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant={job.jobType === 'full_video' ? 'brand' : 'neutral'}
                            size="sm"
                          >
                            {job.jobType === 'full_video'
                              ? 'Full Video'
                              : job.assetId === 'COMPOSITE'
                              ? 'Scene Composite'
                              : job.assetId}
                          </Badge>
                          <span className="font-semibold truncate max-w-xs">{job.assetName}</span>
                        </div>
                        {job.sceneName && (
                          <div className="text-[11px] text-slate-400 mt-0.5">{job.sceneName}</div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        {job.status === 'PROCESSING' && (
                          <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-[11px]">
                            <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                            Rendering...
                          </span>
                        )}
                        {job.status === 'QUEUED' && (
                          <span className="inline-flex items-center gap-1 text-amber-600 text-[11px]">
                            <Clock className="w-3 h-3" /> Queued
                          </span>
                        )}
                        {job.status === 'COMPLETED' && (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                          </span>
                        )}
                        {job.status === 'FAILED' && (
                          <span className="inline-flex items-center gap-1 text-red-600 text-[11px]">
                            <AlertCircle className="w-3.5 h-3.5" /> Failed
                          </span>
                        )}
                      </td>

                      {/* Progress Bar */}
                      <td className="py-3 px-4">
                        <div className="w-28">
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono">
                            <span>{job.progress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${job.progress}%` }}
                              className={`h-full transition-all duration-150 ${
                                job.status === 'COMPLETED'
                                  ? 'bg-emerald-500'
                                  : job.status === 'FAILED'
                                  ? 'bg-red-500'
                                  : 'bg-blue-600'
                              }`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px] font-mono tabular-nums">
                        {job.duration.toFixed(1)}s
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-[11px] font-mono tabular-nums">
                        {job.fileSize || '—'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        {job.status === 'COMPLETED' && job.outputUrl && (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setPreviewVideoUrl(job.outputUrl!);
                                setPreviewTitle(`${job.assetId} · ${job.assetName}`);
                              }}
                              leftIcon={<Play className="w-3 h-3 text-blue-600" />}
                            >
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                handleDownload(
                                  job.outputUrl!,
                                  `${(job.sceneName || 'video').toLowerCase().replace(/\s+/g, '_')}_${job.assetId}.webm`
                                )
                              }
                              leftIcon={<DownloadCloud className="w-3 h-3" />}
                            >
                              Download
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Video Preview Dialog */}
      {previewVideoUrl && (
        <Dialog
          isOpen={true}
          onClose={() => setPreviewVideoUrl(null)}
          title={previewTitle || 'Rendered Clip Preview'}
          subtitle="Real-time rendered deterministic video output"
          maxWidth="2xl"
          footer={
            <div className="flex justify-between items-center w-full text-xs">
              <span className="text-slate-500 font-mono">Format: WebM Video (VP9 Canvas Stream)</span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleDownload(previewVideoUrl, 'rendered-animation.webm')}
                leftIcon={<DownloadCloud className="w-3.5 h-3.5" />}
              >
                Download Video Clip
              </Button>
            </div>
          }
        >
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center shadow-inner">
            <video
              src={previewVideoUrl}
              controls
              autoPlay
              loop
              className="w-full h-full object-contain"
            />
          </div>
        </Dialog>
      )}
    </div>
  );
};
