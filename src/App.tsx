import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  AnimationInstruction,
  AnimationSpec,
  Asset,
  Project,
  RenderJob,
  Scene,
  SceneAsset,
  StudioTab,
  VoiceTrack,
  WordTimestamp,
  AspectRatio,
} from './types';
import {
  loadProjects,
  saveProjects,
  loadActiveProjectId,
  saveActiveProjectId,
  loadScenes,
  saveScenes,
  loadAssets,
  saveAssets,
  loadSceneAssets,
  saveSceneAssets,
  loadInstructions,
  saveInstructions,
  loadVoiceTracks,
  saveVoiceTracks,
  loadRenderJobs,
  saveRenderJobs,
} from './utils/storage';
import { parseInstructionsBlock } from './utils/animationParser';
import {
  renderAssetVideoClip,
  renderSceneCompositeVideo,
  renderFullProjectVideo,
} from './utils/videoRenderer';
import { Header } from './components/common/Header';
import { SceneDrawer } from './components/studio/SceneDrawer';
import { CanvasStage } from './components/studio/CanvasStage';
import { Timeline } from './components/studio/Timeline';
import { InstructionEditor } from './components/studio/InstructionEditor';
import { EditableMappingItem, MappingReviewModal } from './components/studio/MappingReviewModal';
import { InspectorPanel } from './components/studio/InspectorPanel';
import { AssetLibrary } from './components/assets/AssetLibrary';
import { VoiceStudio } from './components/voice/VoiceStudio';
import { VideoDirector } from './components/director/VideoDirector';
import { RenderJobsPanel } from './components/renders/RenderJobsPanel';
import { ProjectModal } from './components/projects/ProjectModal';
import { ExportProductionModal } from './components/export/ExportProductionModal';
import { StudioTourGuideModal } from './components/guide/StudioTourGuideModal';
import { useToast } from './components/ui/NotificationToast';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<StudioTab>('animation');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const toast = useToast();

  // Projects State
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState<string>(() => loadActiveProjectId());

  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // Scenes State
  const [scenes, setScenes] = useState<Scene[]>(() => loadScenes(activeProjectId));
  const [activeSceneId, setActiveSceneId] = useState<string>(() => {
    const loaded = loadScenes(activeProjectId);
    return loaded.length > 0 ? loaded[0].id : 'sc_01';
  });

  const activeScene = useMemo(() => {
    return scenes.find((s) => s.id === activeSceneId) || scenes[0];
  }, [scenes, activeSceneId]);

  // Assets & Scene Assets State
  const [assets, setAssets] = useState<Asset[]>(() => loadAssets(activeProjectId));
  const [sceneAssets, setSceneAssets] = useState<SceneAsset[]>(() => loadSceneAssets());

  // Active scene's assigned assets
  const activeSceneAssets = useMemo(() => {
    return sceneAssets
      .filter((sa) => sa.sceneId === activeSceneId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [sceneAssets, activeSceneId]);

  // Animation Instructions & Specs
  const [instructions, setInstructions] = useState<AnimationInstruction[]>(() => loadInstructions());

  // Derive specs keyed by assetId for active scene
  const activeSpecs = useMemo(() => {
    const specsMap: Record<string, AnimationSpec> = {};
    instructions
      .filter((inst) => inst.sceneId === activeSceneId)
      .forEach((inst) => {
        specsMap[inst.assetId] = inst.spec;
      });
    return specsMap;
  }, [instructions, activeSceneId]);

  // Voice Tracks
  const [voiceTracks, setVoiceTracks] = useState<VoiceTrack[]>(() => loadVoiceTracks(activeProjectId));
  const activeVoiceTrack = useMemo(() => {
    return voiceTracks.find((vt) => vt.sceneId === activeSceneId);
  }, [voiceTracks, activeSceneId]);

  // Render Jobs
  const [renderJobs, setRenderJobs] = useState<RenderJob[]>(() => loadRenderJobs());

  // Selection & Preview State
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isolatedAssetId, setIsolatedAssetId] = useState<string | null>(null);

  // Timeline Transport State
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(true);

  // Mapping Review Modal State
  const [isMappingModalOpen, setIsMappingModalOpen] = useState<boolean>(false);
  const [pendingMappingItems, setPendingMappingItems] = useState<EditableMappingItem[]>([]);

  // Animation Loop via requestAnimationFrame
  const lastTimeRef = useRef<number | null>(null);
  const sceneDuration = activeScene?.duration || 5.0;

  useEffect(() => {
    if (!isPlaying) {
      lastTimeRef.current = null;
      return;
    }

    let animFrame: number;
    const tick = (now: number) => {
      if (lastTimeRef.current !== null) {
        const deltaSec = ((now - lastTimeRef.current) / 1000) * playbackSpeed;
        setCurrentTime((prev) => {
          const next = prev + deltaSec;
          if (next >= sceneDuration) {
            if (isLooping) return 0;
            setIsPlaying(false);
            return sceneDuration;
          }
          return next;
        });
      }
      lastTimeRef.current = now;
      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, playbackSpeed, sceneDuration, isLooping]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentTime((prev) => Math.max(0, prev - 0.25));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentTime((prev) => Math.min(sceneDuration, prev + 0.25));
      } else if (e.key === 'j' || e.key === 'J') {
        setCurrentTime((prev) => Math.max(0, prev - 1.0));
      } else if (e.key === 'k' || e.key === 'K') {
        setIsPlaying(false);
      } else if (e.key === 'l' || e.key === 'L') {
        setCurrentTime((prev) => Math.min(sceneDuration, prev + 1.0));
      } else if (e.key === 'Home' || e.key === '0') {
        setCurrentTime(0);
      } else if (e.key === '?' || (e.key === '/' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setIsGuideModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sceneDuration]);

  // Persistence Effects
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveActiveProjectId(activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    saveScenes(scenes);
  }, [scenes]);

  useEffect(() => {
    saveAssets(assets);
  }, [assets]);

  useEffect(() => {
    saveSceneAssets(sceneAssets);
  }, [sceneAssets]);

  useEffect(() => {
    saveInstructions(instructions);
  }, [instructions]);

  useEffect(() => {
    saveVoiceTracks(voiceTracks);
  }, [voiceTracks]);

  useEffect(() => {
    saveRenderJobs(renderJobs);
  }, [renderJobs]);

  // Project Management Handlers
  const handleSelectProject = (projId: string) => {
    setActiveProjectId(projId);
    const loadedScenes = loadScenes(projId);
    setScenes(loadedScenes);
    if (loadedScenes.length > 0) setActiveSceneId(loadedScenes[0].id);
    setAssets(loadAssets(projId));
    setVoiceTracks(loadVoiceTracks(projId));
    setCurrentTime(0);
    setIsPlaying(false);
    toast.info('Switched project', `Loaded project workspace.`);
  };

  const handleCreateProject = (name: string, description: string) => {
    const newId = `proj_${Date.now()}`;
    const newProj: Project = {
      id: newId,
      name,
      description,
      aspectRatio: '16:9',
      exportPreset: '1080p',
      fps: 30,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...projects, newProj];
    setProjects(updated);
    handleSelectProject(newId);
    toast.success('Project created', `"${name}" is now ready.`);
  };

  const handleDeleteProject = (projId: string) => {
    const updated = projects.filter((p) => p.id !== projId);
    setProjects(updated);
    if (activeProjectId === projId && updated.length > 0) {
      handleSelectProject(updated[0].id);
    }
  };

  // Scene Management Handlers
  const handleCreateScene = () => {
    const sceneNum = scenes.length + 1;
    const newScene: Scene = {
      id: `sc_${Date.now()}`,
      projectId: activeProjectId,
      name: `Scene ${sceneNum.toString().padStart(2, '0')} — Untitled`,
      description: 'New creative sequence',
      sortOrder: scenes.length,
      duration: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      directorSettings: {
        cameraMotion: 'zoom_in',
        cameraIntensity: 0.15,
        transitionIn: 'crossfade',
        transitionDuration: 0.5,
        pacingPreset: 'conversational',
        enableSubtitles: true,
      },
      captions: [],
    };
    const updated = [...scenes, newScene];
    setScenes(updated);
    setActiveSceneId(newScene.id);
    toast.success('New scene added', `Created ${newScene.name}.`);
  };

  const handleUpdateScene = (updatedScene: Scene) => {
    setScenes((prev) => prev.map((s) => (s.id === updatedScene.id ? updatedScene : s)));
  };

  const handleDeleteScene = (sceneId: string) => {
    const updated = scenes.filter((s) => s.id !== sceneId);
    setScenes(updated);
    if (activeSceneId === sceneId && updated.length > 0) {
      setActiveSceneId(updated[0].id);
    }
  };

  const handleReorderScene = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;
    const newScenes = [...scenes];
    const [moved] = newScenes.splice(index, 1);
    newScenes.splice(targetIndex, 0, moved);
    const reindexed = newScenes.map((s, idx) => ({ ...s, sortOrder: idx }));
    setScenes(reindexed);
  };

  // Asset Assignment Handlers
  const handleAssignAssetToScene = (assetId: string, sceneId: string) => {
    if (sceneAssets.some((sa) => sa.sceneId === sceneId && sa.assetId === assetId)) return;
    const newSceneAsset: SceneAsset = {
      id: `sa_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sceneId,
      assetId,
      sortOrder: sceneAssets.filter((sa) => sa.sceneId === sceneId).length,
      initialX: 50,
      initialY: 50,
      initialScale: 1.0,
      initialOpacity: 1.0,
      initialRotate: 0,
    };
    setSceneAssets((prev) => [...prev, newSceneAsset]);
    toast.success('Asset placed', `Assigned ${assetId} to scene canvas.`);
  };

  const handleUnassignAssetFromScene = (assetId: string, sceneId: string) => {
    setSceneAssets((prev) =>
      prev.filter((sa) => !(sa.sceneId === sceneId && sa.assetId === assetId))
    );
    if (selectedAssetId === assetId) setSelectedAssetId(null);
    if (isolatedAssetId === assetId) setIsolatedAssetId(null);
    toast.info('Asset removed', `Removed ${assetId} from scene.`);
  };

  // Mapping Review & Natural Language Instruction Handlers
  const handleOpenMappingReview = (rawText: string) => {
    const sceneAvailableAssets = activeSceneAssets
      .map((sa) => assets.find((a) => a.id === sa.assetId))
      .filter((a): a is Asset => a !== undefined);

    const targetAssetPool = sceneAvailableAssets.length > 0 ? sceneAvailableAssets : assets;
    const parsedItems = parseInstructionsBlock(rawText, targetAssetPool);
    const editableItems: EditableMappingItem[] = parsedItems.map((item, index) => ({
      id: `pending_${Date.now()}_${index}`,
      assetId: item.assetId,
      rawInstruction: item.rawInstruction,
      matchedBy: item.matchedBy,
      spec: item.spec,
    }));
    setPendingMappingItems(editableItems);
    setIsMappingModalOpen(true);
  };

  const handleConfirmMappings = (confirmedItems: EditableMappingItem[]) => {
    const newInstructions: AnimationInstruction[] = confirmedItems.map((item) => ({
      id: `inst_${Date.now()}_${item.assetId}`,
      sceneId: activeSceneId,
      assetId: item.assetId,
      rawInstruction: item.rawInstruction,
      spec: item.spec,
      status: 'reviewed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setInstructions((prev) => {
      const otherScenes = prev.filter((i) => i.sceneId !== activeSceneId);
      const activeCurrent = prev.filter((i) => i.sceneId === activeSceneId);

      const updatedActive = [...activeCurrent];
      newInstructions.forEach((newInst) => {
        const idx = updatedActive.findIndex((a) => a.assetId === newInst.assetId);
        if (idx >= 0) {
          updatedActive[idx] = newInst;
        } else {
          updatedActive.push(newInst);
        }
      });

      return [...otherScenes, ...updatedActive];
    });

    toast.success('Animation specifications applied', `${confirmedItems.length} motions updated.`);
  };

  // Voice-Aware Animation Alignment
  const handleSyncAnimationsWithVoice = (sceneId: string, words: WordTimestamp[]) => {
    if (words.length === 0) return;
    const targetSceneAssets = sceneAssets.filter((sa) => sa.sceneId === sceneId);
    if (targetSceneAssets.length === 0) return;

    setInstructions((prev) => {
      const updated = [...prev];
      targetSceneAssets.forEach((sa, assetIdx) => {
        const wordSliceStart = Math.min(words.length - 1, assetIdx * 2);
        const startWord = words[wordSliceStart];
        const endWord = words[Math.min(words.length - 1, wordSliceStart + 3)];

        const startTime = startWord ? startWord.start : 0;
        const duration = endWord ? Math.max(1.0, endWord.end - startTime) : 2.0;

        const existingIndex = updated.findIndex(
          (i) => i.sceneId === sceneId && i.assetId === sa.assetId
        );

        const syncedSpec: AnimationSpec = {
          assetId: sa.assetId,
          animations: [
            {
              id: `anim_sync_${Date.now()}_${sa.assetId}`,
              type: assetIdx % 2 === 0 ? 'scale' : 'translate',
              from: { scale: 1, opacity: 0.8 },
              to: { scale: 1.12, opacity: 1 },
              startTime,
              duration,
              easing: 'easeInOut',
            },
          ],
        };

        if (existingIndex >= 0) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            spec: syncedSpec,
            updatedAt: new Date().toISOString(),
          };
        } else {
          updated.push({
            id: `inst_sync_${Date.now()}_${sa.assetId}`,
            sceneId,
            assetId: sa.assetId,
            rawInstruction: `[${sa.assetId}] Synced to spoken narration cues (${startTime.toFixed(1)}s to ${(startTime + duration).toFixed(1)}s)`,
            spec: syncedSpec,
            status: 'reviewed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      });
      return updated;
    });
  };

  // Rendering Engines Execution
  const runAssetRender = async (asset: Asset, spec: AnimationSpec, targetScene: Scene) => {
    const jobId = `job_${asset.id}_${Date.now().toString().slice(-4)}`;
    const newJob: RenderJob = {
      id: jobId,
      projectId: activeProjectId,
      sceneId: targetScene.id,
      assetId: asset.id,
      assetName: asset.name,
      sceneName: targetScene.name,
      status: 'PROCESSING',
      progress: 0,
      duration: targetScene.duration,
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };

    setRenderJobs((prev) => [newJob, ...prev]);

    try {
      const { url, sizeFormatted } = await renderAssetVideoClip(
        asset,
        spec,
        targetScene.duration,
        (progress) => {
          setRenderJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress } : j))
          );
        }
      );

      setRenderJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'COMPLETED',
                progress: 100,
                outputUrl: url,
                fileSize: sizeFormatted,
                completedAt: new Date().toISOString(),
              }
            : j
        )
      );
      toast.success('Render completed', `Clip for ${asset.name} is ready in the queue.`);
    } catch (err: any) {
      setRenderJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'FAILED',
                error: err.message || 'Rendering error',
              }
            : j
        )
      );
      toast.error('Render failed', err.message || 'Could not export video clip.');
    }
  };

  const handleTriggerBatchRender = async (sceneId: string) => {
    setCurrentTab('renders');
    const targetScene = scenes.find((s) => s.id === sceneId) || activeScene;
    const targetSceneAssets = sceneAssets.filter((sa) => sa.sceneId === targetScene.id);

    if (targetSceneAssets.length === 0) {
      toast.warning('No assets to render', 'Assign at least one asset to this scene first.');
      return;
    }

    for (const sa of targetSceneAssets) {
      const asset = assets.find((a) => a.id === sa.assetId);
      if (!asset) continue;
      const spec = activeSpecs[sa.assetId] || { assetId: sa.assetId, animations: [] };
      await runAssetRender(asset, spec, targetScene);
    }
  };

  const handleTriggerCompositeRender = async (sceneId: string) => {
    setCurrentTab('renders');
    const targetScene = scenes.find((s) => s.id === sceneId) || activeScene;
    const targetSceneAssets = sceneAssets.filter((sa) => sa.sceneId === targetScene.id);

    const jobId = `comp_${targetScene.id}_${Date.now().toString().slice(-4)}`;
    const newJob: RenderJob = {
      id: jobId,
      projectId: activeProjectId,
      sceneId: targetScene.id,
      assetId: 'COMPOSITE',
      assetName: `Full Scene Composite (${targetSceneAssets.length} layers)`,
      sceneName: targetScene.name,
      status: 'PROCESSING',
      progress: 0,
      duration: targetScene.duration,
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };

    setRenderJobs((prev) => [newJob, ...prev]);

    try {
      const { url, sizeFormatted } = await renderSceneCompositeVideo(
        assets,
        targetSceneAssets,
        activeSpecs,
        targetScene.duration,
        (progress) => {
          setRenderJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress } : j))
          );
        }
      );

      setRenderJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'COMPLETED',
                progress: 100,
                outputUrl: url,
                fileSize: sizeFormatted,
                completedAt: new Date().toISOString(),
              }
            : j
        )
      );
      toast.success('Scene Composite Ready', `Rendered "${targetScene.name}".`);
    } catch (err: any) {
      setRenderJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: 'FAILED', error: err.message } : j
        )
      );
    }
  };

  const handleTriggerFullProjectRender = async (settings: {
    target: 'full' | 'scene';
    aspectRatio: AspectRatio;
    resolution: '720p' | '1080p' | '4k';
    fps: 24 | 30 | 60;
  }) => {
    if (settings.target === 'scene') {
      handleTriggerCompositeRender(activeSceneId);
      return;
    }

    setCurrentTab('renders');
    const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
    const jobId = `full_${activeProjectId}_${Date.now().toString().slice(-4)}`;

    const newJob: RenderJob = {
      id: jobId,
      projectId: activeProjectId,
      jobType: 'full_video',
      assetId: 'FULL_VIDEO',
      assetName: `${activeProject.name} — Full Video Composition`,
      sceneName: `All ${scenes.length} Scenes (${settings.aspectRatio})`,
      status: 'PROCESSING',
      progress: 0,
      duration: totalDuration,
      aspectRatio: settings.aspectRatio,
      resolution: settings.resolution,
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString(),
    };

    setRenderJobs((prev) => [newJob, ...prev]);
    toast.info('Starting full render', `Processing all ${scenes.length} scenes in ${settings.aspectRatio}...`);

    try {
      const projToRender: Project = {
        ...activeProject,
        aspectRatio: settings.aspectRatio,
        exportPreset: settings.resolution,
        fps: settings.fps,
      };

      const { url, sizeFormatted } = await renderFullProjectVideo(
        projToRender,
        scenes,
        assets,
        sceneAssets,
        activeSpecs,
        voiceTracks,
        (progress) => {
          setRenderJobs((prev) =>
            prev.map((j) => (j.id === jobId ? { ...j, progress } : j))
          );
        }
      );

      setRenderJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'COMPLETED',
                progress: 100,
                outputUrl: url,
                fileSize: sizeFormatted,
                completedAt: new Date().toISOString(),
              }
            : j
        )
      );
      toast.success('Production video ready', `Full project video export complete (${sizeFormatted}).`);
    } catch (err: any) {
      setRenderJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: 'FAILED', error: err.message || 'Render error' } : j
        )
      );
      toast.error('Render failed', err.message || 'Full video export failed.');
    }
  };

  const handleRenderSingleAsset = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    const spec = activeSpecs[assetId] || { assetId, animations: [] };
    setCurrentTab('renders');
    runAssetRender(asset, spec, activeScene);
  };

  const activeJobsCount = renderJobs.filter(
    (j) => j.status === 'PROCESSING' || j.status === 'QUEUED'
  ).length;

  const currentInstructionsText = useMemo(() => {
    return instructions
      .filter((i) => i.sceneId === activeSceneId)
      .map((i) => i.rawInstruction)
      .join('\n');
  }, [instructions, activeSceneId]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-slate-900 select-none">
      {/* Universal 3-Zone Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={handleSelectProject}
        onOpenNewProjectModal={() => setIsProjectModalOpen(true)}
        onTriggerRenderModal={() => setIsExportModalOpen(true)}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        activeJobsCount={activeJobsCount}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {currentTab === 'animation' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Upper Work Area: Scene Drawer + Canvas Stage + Inspector */}
            <div className="flex-1 flex overflow-hidden">
              <SceneDrawer
                scenes={scenes}
                activeSceneId={activeSceneId}
                onSelectScene={(id) => {
                  setActiveSceneId(id);
                  setCurrentTime(0);
                  setSelectedAssetId(null);
                  setIsolatedAssetId(null);
                }}
                onCreateScene={handleCreateScene}
                onUpdateScene={handleUpdateScene}
                onDeleteScene={handleDeleteScene}
                onReorderScene={handleReorderScene}
                sceneAssets={sceneAssets}
              />

              <div className="flex-1 flex flex-col overflow-hidden">
                <CanvasStage
                  sceneAssets={activeSceneAssets}
                  assets={assets}
                  specs={activeSpecs}
                  currentTime={currentTime}
                  duration={sceneDuration}
                  selectedAssetId={selectedAssetId}
                  onSelectAsset={setSelectedAssetId}
                  isolatedAssetId={isolatedAssetId}
                  onToggleIsolate={setIsolatedAssetId}
                />

                {/* Natural Language Instruction Input Drawer */}
                <InstructionEditor
                  availableAssets={activeSceneAssets
                    .map((sa) => assets.find((a) => a.id === sa.assetId))
                    .filter((a): a is Asset => a !== undefined)}
                  onOpenMappingReview={handleOpenMappingReview}
                  currentInstructionsText={currentInstructionsText}
                />
              </div>

              <InspectorPanel
                selectedAssetId={selectedAssetId}
                assets={assets}
                sceneAssets={activeSceneAssets}
                specs={activeSpecs}
                activeScene={activeScene}
                onUpdateSceneAsset={(updated) => {
                  setSceneAssets((prev) =>
                    prev.map((sa) => (sa.id === updated.id ? updated : sa))
                  );
                }}
                onUpdateSpec={(assetId, updatedSpec) => {
                  setInstructions((prev) => {
                    const found = prev.find(
                      (i) => i.sceneId === activeSceneId && i.assetId === assetId
                    );
                    if (found) {
                      return prev.map((i) =>
                        i.id === found.id ? { ...i, spec: updatedSpec } : i
                      );
                    }
                    return [
                      ...prev,
                      {
                        id: `inst_${Date.now()}_${assetId}`,
                        sceneId: activeSceneId,
                        assetId,
                        rawInstruction: `[${assetId}] Custom animation specification`,
                        spec: updatedSpec,
                        status: 'reviewed',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                      },
                    ];
                  });
                }}
                onRenderSingleAsset={handleRenderSingleAsset}
                onUnassignAssetFromScene={(assetId) =>
                  handleUnassignAssetFromScene(assetId, activeSceneId)
                }
              />
            </div>

            {/* Bottom Timeline Dock */}
            <Timeline
              duration={sceneDuration}
              currentTime={currentTime}
              isPlaying={isPlaying}
              playbackSpeed={playbackSpeed}
              isLooping={isLooping}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onSeek={(t) => setCurrentTime(t)}
              onChangeSpeed={(s) => setPlaybackSpeed(s)}
              onToggleLoop={() => setIsLooping(!isLooping)}
              sceneAssets={activeSceneAssets}
              assets={assets}
              specs={activeSpecs}
              selectedAssetId={selectedAssetId}
              onSelectAsset={setSelectedAssetId}
              isolatedAssetId={isolatedAssetId}
              onToggleIsolate={setIsolatedAssetId}
              voiceTrack={activeVoiceTrack}
            />
          </div>
        )}

        {currentTab === 'voice' && (
          <VoiceStudio
            projectId={activeProjectId}
            scenes={scenes}
            activeSceneId={activeSceneId}
            voiceTracks={voiceTracks}
            onSaveVoiceTrack={(track) => {
              setVoiceTracks((prev) => {
                const others = prev.filter((vt) => vt.sceneId !== track.sceneId);
                return [...others, track];
              });
            }}
            onDeleteVoiceTrack={(trackId) => {
              setVoiceTracks((prev) => prev.filter((vt) => vt.id !== trackId));
            }}
            onSyncAnimationsWithVoice={handleSyncAnimationsWithVoice}
          />
        )}

        {currentTab === 'video' && (
          <VideoDirector
            project={activeProject}
            scenes={scenes}
            assets={assets}
            sceneAssets={sceneAssets}
            voiceTracks={voiceTracks}
            onUpdateScene={handleUpdateScene}
            onUpdateProject={(p) => {
              setProjects((prev) => prev.map((item) => (item.id === p.id ? p : item)));
            }}
            onSelectScene={(id) => {
              setActiveSceneId(id);
            }}
            onTriggerFullRender={() => setIsExportModalOpen(true)}
          />
        )}

        {currentTab === 'assets' && (
          <AssetLibrary
            assets={assets}
            scenes={scenes}
            sceneAssets={sceneAssets}
            onUploadAssets={(newAssets) => {
              setAssets((prev) => [...prev, ...newAssets]);
            }}
            onDeleteAsset={(assetId) => {
              setAssets((prev) => prev.filter((a) => a.id !== assetId));
              setSceneAssets((prev) => prev.filter((sa) => sa.assetId !== assetId));
            }}
            onAssignAssetToScene={handleAssignAssetToScene}
            onUnassignAssetFromScene={handleUnassignAssetFromScene}
          />
        )}

        {currentTab === 'renders' && (
          <RenderJobsPanel
            jobs={renderJobs}
            scenes={scenes}
            onTriggerBatchRender={handleTriggerBatchRender}
            onTriggerCompositeRender={handleTriggerCompositeRender}
            onClearJobs={() => setRenderJobs([])}
            activeSceneId={activeSceneId}
          />
        )}
      </div>

      {/* Production Export & Render Modal */}
      <ExportProductionModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={activeProject}
        scenes={scenes}
        assets={assets}
        sceneAssets={sceneAssets}
        voiceTracks={voiceTracks}
        activeScene={activeScene}
        onStartFullRender={handleTriggerFullProjectRender}
      />

      {/* Mapping Review Modal */}
      <MappingReviewModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        items={pendingMappingItems}
        availableAssets={assets}
        onConfirmMappings={handleConfirmMappings}
      />

      {/* Project Management Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
      />

      {/* Interactive Studio Tour & Documentation Guide Modal */}
      <StudioTourGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onSwitchTab={setCurrentTab}
      />
    </div>
  );
}
