import React, { useState } from 'react';
import { StudioTab, Project } from '../../types';
import {
  FolderKanban,
  Layers,
  Mic,
  Clapperboard,
  DownloadCloud,
  ChevronDown,
  Plus,
  PlayCircle,
  Video,
  BookOpen,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  projects: Project[];
  activeProject: Project;
  onSelectProject: (projectId: string) => void;
  onOpenNewProjectModal: () => void;
  onTriggerRenderModal: () => void;
  onOpenGuideModal: () => void;
  activeJobsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  projects,
  activeProject,
  onSelectProject,
  onOpenNewProjectModal,
  onTriggerRenderModal,
  onOpenGuideModal,
  activeJobsCount,
}) => {
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Zone 1: Brand & Project Context */}
      <div className="flex items-center gap-5">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onSelectTab('animation');
          }}
          className="flex items-center gap-2 group cursor-pointer"
        >
          {/* Logo Mark */}
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition-colors">
            <Video className="w-4 h-4 fill-white/20" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight">
              BlueStudio
            </span>
            <span className="text-[10px] text-slate-400 font-medium leading-none">
              Creative Production
            </span>
          </div>
        </a>

        <div className="h-4 w-px bg-slate-200" />

        {/* Project Selector */}
        <div className="relative">
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <FolderKanban className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[150px] truncate font-semibold text-slate-800">
              {activeProject.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {projectDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProjectDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Project
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      setProjectDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                      p.id === activeProject.id
                        ? 'font-semibold text-blue-600 bg-blue-50/60'
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    {p.id === activeProject.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                    )}
                  </button>
                ))}
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    setProjectDropdownOpen(false);
                    onOpenNewProjectModal();
                  }}
                  className="w-full text-left px-3.5 py-2 text-xs text-blue-600 hover:bg-blue-50 font-semibold flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Project...</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Zone 2: Creative Studio Modes */}
      <nav className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
        <button
          onClick={() => onSelectTab('animation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            currentTab === 'animation'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clapperboard className="w-3.5 h-3.5 text-blue-600" />
          <span>Animation</span>
        </button>

        <button
          onClick={() => onSelectTab('voice')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            currentTab === 'voice'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-blue-600" />
          <span>Voice</span>
        </button>

        <button
          onClick={() => onSelectTab('video')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            currentTab === 'video'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-blue-600" />
          <span>Video Director</span>
        </button>
      </nav>

      {/* Zone 3: Supporting Utilities & Primary Action */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenGuideModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg transition-colors"
          title="Studio Guide & Tour Documentation"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Guide & Tour</span>
        </button>

        <button
          onClick={() => onSelectTab('assets')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            currentTab === 'assets'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:border-slate-300'
          }`}
          title="Project Asset Library"
        >
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          <span>Assets</span>
        </button>

        <button
          onClick={() => onSelectTab('renders')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
            currentTab === 'renders'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:border-slate-300'
          }`}
          title="Render Jobs Queue"
        >
          <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />
          <span>Renders</span>
          {activeJobsCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 bg-blue-600 text-white rounded text-[10px] font-mono tabular-nums">
              {activeJobsCount}
            </span>
          )}
        </button>

        <div className="h-4 w-px bg-slate-200 mx-0.5" />

        <Button
          size="sm"
          variant="primary"
          onClick={onTriggerRenderModal}
          leftIcon={<PlayCircle className="w-3.5 h-3.5" />}
        >
          Render Scene
        </Button>
      </div>
    </header>
  );
};
