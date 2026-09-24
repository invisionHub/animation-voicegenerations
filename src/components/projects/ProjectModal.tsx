import React, { useState } from 'react';
import { Project } from '../../types';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { FolderPlus, Trash2, Check, Folder } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (name: string, description: string) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject(name.trim(), description.trim());
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Project Management"
      subtitle="Switch between animation projects or start a new production."
      maxWidth="md"
    >
      <div className="space-y-5 text-xs">
        {/* Create Project Form */}
        <form onSubmit={handleCreate} className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>Create New Project</span>
          </div>

          <Input
            label="Project Name"
            placeholder="e.g. Mobile Payment Explainer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Brief creative goal or summary of what you are building..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              variant="primary"
              disabled={!name.trim()}
              leftIcon={<FolderPlus className="w-3.5 h-3.5" />}
            >
              Create Project
            </Button>
          </div>
        </form>

        {/* Existing Projects List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-[10px] text-slate-400 uppercase tracking-wider">
              Existing Projects ({projects.length})
            </span>
          </div>

          <div className="space-y-2 max-h-52 overflow-y-auto">
            {projects.map((p) => {
              const isActive = p.id === activeProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/70 shadow-2xs ring-1 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <Folder className={`w-4 h-4 shrink-0 mt-0.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 truncate">{p.name}</span>
                        {isActive && <Badge variant="brand" size="sm">Active</Badge>}
                      </div>
                      {p.description && (
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.description}</p>
                      )}
                    </div>
                  </div>

                  {projects.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(p.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors ml-2"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
