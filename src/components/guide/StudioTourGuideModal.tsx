import React, { useState } from 'react';
import { StudioTab } from '../../types';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Compass,
  BookOpen,
  Clapperboard,
  Mic,
  Video,
  Layers,
  DownloadCloud,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Command,
  HelpCircle,
  CheckCircle2,
  Sliders,
  Move,
  Type,
  Film,
  Zap,
  Play,
  RotateCw,
  Search,
} from 'lucide-react';

interface StudioTourGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTab?: (tab: StudioTab) => void;
}

export const StudioTourGuideModal: React.FC<StudioTourGuideModalProps> = ({
  isOpen,
  onClose,
  onSwitchTab,
}) => {
  const [activeView, setActiveView] = useState<'tour' | 'docs'>('tour');
  const [currentStep, setCurrentStep] = useState(0);
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedDocCategory, setSelectedDocCategory] = useState<
    'quickstart' | 'prompts' | 'voice' | 'director' | 'shortcuts'
  >('quickstart');

  const tourSteps = [
    {
      id: 'welcome',
      title: 'Welcome to BlueStudio',
      subtitle: 'Your professional creative studio for narrated, animated video production.',
      tab: 'animation' as StudioTab,
      badge: 'Introduction',
      icon: Compass,
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed text-xs">
            BlueStudio combines three core disciplines into one seamless creative workflow:
            <strong className="text-slate-900 font-semibold"> Natural Language Animation</strong>,{' '}
            <strong className="text-slate-900 font-semibold">Voice & Narration</strong>, and an{' '}
            <strong className="text-slate-900 font-semibold">Automated Video Director</strong>.
          </p>
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-center">
              <Clapperboard className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <div className="font-bold text-slate-900 text-xs">1. Animation</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Stage & plain words</div>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-center">
              <Mic className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <div className="font-bold text-slate-900 text-xs">2. Voice Studio</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Personas & speech sync</div>
            </div>
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 text-center">
              <Video className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
              <div className="font-bold text-slate-900 text-xs">3. Video Director</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Camera & subtitles</div>
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Follow this interactive tour to master the studio controls in under 3 minutes.</span>
          </div>
        </div>
      ),
    },
    {
      id: 'scenes_and_canvas',
      title: 'Scene Drawer & Interactive Stage',
      subtitle: 'Organize sequences and position assets on the canvas.',
      tab: 'animation' as StudioTab,
      badge: 'Scene Anatomy',
      icon: Layers,
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            Every project is composed of sequential <strong className="text-slate-900 font-semibold">Scenes</strong>.
            Click a scene on the left drawer to edit its assets, duration, or narration.
          </p>
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">1</div>
              <div>
                <strong className="text-slate-900">Select & Inspect:</strong> Click any asset on stage or timeline to open the right-hand Inspector.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">2</div>
              <div>
                <strong className="text-slate-900">Stage Transform:</strong> Adjust Pos X, Pos Y, Scale, and Rotate directly in percentage coordinates.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-[11px]">3</div>
              <div>
                <strong className="text-slate-900">Isolate Mode:</strong> Use the eye icon to solo an asset and preview its independent motion curve.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'instructions_editor',
      title: 'Natural Language Instruction Engine',
      subtitle: 'Type what you want to happen in ordinary, friendly English.',
      tab: 'animation' as StudioTab,
      badge: 'Motion Prompting',
      icon: Sparkles,
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            Instead of manually clicking through complex keyframing editors, simply describe the motion:
          </p>
          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-1">
            <div className="text-blue-400">// Example Natural Instruction:</div>
            <div>[A001] Character walks from left to center and fades in over 2.5s with bounce ease</div>
            <div className="text-emerald-400">[A002] Laptop slides upward from bottom in 2s with easeInOut</div>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <p>
              • <strong>Keywords:</strong> Supports <code>slide</code>, <code>walk</code>, <code>zoom</code>, <code>scale</code>, <code>rotate</code>, <code>fade in/out</code>.
            </p>
            <p>
              • <strong>Timing:</strong> Specify durations with <code>in 2s</code>, <code>over 3.5s</code>, and delays with <code>after 1s</code>.
            </p>
            <p>
              • <strong>Review First:</strong> Click <em>Review & Apply</em> to inspect all calculated keyframes before applying them to the stage.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'voice_studio',
      title: 'Voice Studio & Speech Alignment',
      subtitle: 'Synthesize narration and sync visual motion to vocal pacing.',
      tab: 'voice' as StudioTab,
      badge: 'Narration & Speech',
      icon: Mic,
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            Write script lines per scene and bring them to life with realistic voice personas:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900 text-xs">Curated Personas</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Sophia, Alex, Marcus, and Emma with custom pitch & cadence.</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="font-bold text-slate-900 text-xs">Sync Animations</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Click "Sync Animations to Voice" to automatically map keyframes to word timestamps!</div>
            </div>
          </div>
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Pro-tip:</strong> When speech duration changes, BlueStudio calculates the exact seconds so animations never end prematurely.
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'video_director',
      title: 'Automated Video Director',
      subtitle: 'Orchestrate camera motion, transitions, and automatic subtitles.',
      tab: 'video' as StudioTab,
      badge: 'Cinematography',
      icon: Video,
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            The <strong className="text-slate-900 font-semibold">Video Director</strong> elevates independent scene animations into a cohesive film:
          </p>
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Dynamic Camera:</span>
              <span className="text-slate-600">Zoom In, Pan Left/Right, Dramatic Push</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Scene Transitions:</span>
              <span className="text-slate-600">Crossfade, Slide Left, Zoom, Direct Cut</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Subtitles Generator:</span>
              <span className="text-slate-600">One-click auto captions from narration</span>
            </div>
          </div>
          <p className="text-[11px]">
            Use the <strong>Play Full Sequence</strong> transport to watch all scenes flow together with real-time camera movements.
          </p>
        </div>
      ),
    },
    {
      id: 'export_production',
      title: 'Multi-Format Production & Export',
      subtitle: 'Export across YouTube, TikTok, and Instagram in crisp quality.',
      tab: 'renders' as StudioTab,
      badge: 'Export & Output',
      icon: Film,
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p className="leading-relaxed">
            Export your finished video in multiple aspect ratios or download independent asset clips:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Aspect Ratios</strong>
              <span>16:9 Landscape, 9:16 Vertical (Reels/Shorts), 1:1 Square, 4:5 Portrait</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Standalone Bundle</strong>
              <span>Download JSON archive or a self-contained HTML video player</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            All render jobs process frame-by-frame and appear in your <strong>Render Queue</strong> for instant playback and high-speed download.
          </p>
        </div>
      ),
    },
  ];

  const currentStepData = tourSteps[currentStep];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      if (onSwitchTab && tourSteps[currentStep + 1]?.tab) {
        onSwitchTab(tourSteps[currentStep + 1].tab);
      }
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      if (onSwitchTab && tourSteps[currentStep - 1]?.tab) {
        onSwitchTab(tourSteps[currentStep - 1].tab);
      }
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={activeView === 'tour' ? 'BlueStudio Interactive Tour' : 'Studio Documentation & Reference'}
      subtitle={
        activeView === 'tour'
          ? `Step ${currentStep + 1} of ${tourSteps.length} · Interactive Walkthrough`
          : 'Complete guide to natural animation, voice synthesis, camera direction, and export.'
      }
      maxWidth="2xl"
      footer={
        activeView === 'tour' ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1.5">
              {tourSteps.map((step, idx) => (
                <div
                  key={step.id}
                  onClick={() => {
                    setCurrentStep(idx);
                    if (onSwitchTab && step.tab) onSwitchTab(step.tab);
                  }}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    idx === currentStep
                      ? 'w-6 bg-blue-600'
                      : idx < currentStep
                      ? 'w-2 bg-blue-300'
                      : 'w-2 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setActiveView('docs')}
                leftIcon={<BookOpen className="w-3.5 h-3.5 text-slate-500" />}
              >
                Read Full Docs
              </Button>

              {currentStep > 0 && (
                <Button size="sm" variant="outline" onClick={handlePrev} leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}>
                  Back
                </Button>
              )}

              <Button
                size="sm"
                variant="primary"
                onClick={handleNext}
                rightIcon={currentStep < tourSteps.length - 1 ? <ChevronRight className="w-3.5 h-3.5" /> : undefined}
                leftIcon={currentStep === tourSteps.length - 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : undefined}
              >
                {currentStep < tourSteps.length - 1 ? 'Next Step' : 'Finish Tour'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveView('tour')}
              leftIcon={<Compass className="w-3.5 h-3.5 text-blue-600" />}
            >
              Back to Tour
            </Button>
            <Button size="sm" variant="primary" onClick={onClose}>
              Done Reading
            </Button>
          </div>
        )
      }
    >
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('tour')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'tour'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive Tour</span>
          </button>
          <button
            onClick={() => setActiveView('docs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeView === 'docs'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Documentation Manual</span>
          </button>
        </div>

        {activeView === 'tour' && (
          <Badge variant="brand" size="sm">
            {currentStepData.badge}
          </Badge>
        )}
      </div>

      {/* TOUR VIEW */}
      {activeView === 'tour' && (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
              <currentStepData.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{currentStepData.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{currentStepData.subtitle}</p>
            </div>
          </div>

          <div className="pt-2">{currentStepData.content}</div>

          {/* Jump to specific tab action */}
          {onSwitchTab && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  onSwitchTab(currentStepData.tab);
                  onClose();
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
              >
                <span>Jump to this workspace now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* DOCUMENTATION VIEW */}
      {activeView === 'docs' && (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Docs Navigation Subtabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'quickstart', label: 'Quick Start', icon: Zap },
              { id: 'prompts', label: 'Prompting Syntax', icon: Sparkles },
              { id: 'voice', label: 'Voiceover & Sync', icon: Mic },
              { id: 'director', label: 'Camera & Direction', icon: Video },
              { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Command },
            ].map((cat) => {
              const IconComp = cat.icon;
              const isSelected = selectedDocCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDocCategory(cat.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border whitespace-nowrap font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Docs Content Sections */}
          {selectedDocCategory === 'quickstart' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Quick Start: 5 Steps to Your First Animated Video</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong className="text-slate-900">Select or Create a Scene:</strong> Use the left Scene Drawer to pick an opening scene or create a new sequence.
                </li>
                <li>
                  <strong className="text-slate-900">Add Assets to Stage:</strong> Drag assets from the Asset Library or use pre-loaded elements (presenters, laptops, shields, cards).
                </li>
                <li>
                  <strong className="text-slate-900">Write Animation Prompts:</strong> Describe how assets move in plain English in the bottom prompt box and review the generated primitives.
                </li>
                <li>
                  <strong className="text-slate-900">Add Narration in Voice Studio:</strong> Type your script, choose a persona (e.g. Sophia or Alex), and click <em>Sync Animations to Voice</em>.
                </li>
                <li>
                  <strong className="text-slate-900">Direct Camera & Render:</strong> Go to the Video Director tab to select your camera motion, and hit <em>Render Full Composition</em>.
                </li>
              </ol>
            </div>
          )}

          {selectedDocCategory === 'prompts' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Natural Language Animation Syntax Guide</h4>
              <p>BlueStudio parses ordinary English statements into deterministic transforms and keyframes:</p>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    <tr>
                      <th className="p-2.5">Pattern</th>
                      <th className="p-2.5">Example Prompt</th>
                      <th className="p-2.5">Generated Transform</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px] font-mono">
                    <tr>
                      <td className="p-2.5 text-blue-700 font-semibold">[ID] Move</td>
                      <td className="p-2.5 font-sans">"[A001] Character walks from left to center in 2.5s"</td>
                      <td className="p-2.5">translate X: 0 to 50%</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-700 font-semibold">[ID] Scale & Bounce</td>
                      <td className="p-2.5 font-sans">"[A005] Security shield scales with bounce ease"</td>
                      <td className="p-2.5">scale: 0 to 1.1 (bounce)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-700 font-semibold">[ID] Slide & Fade</td>
                      <td className="p-2.5 font-sans">"[A002] Laptop slides from bottom and fades in"</td>
                      <td className="p-2.5">translate Y + opacity 0 to 1</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-blue-700 font-semibold">[ID] Rotate Glide</td>
                      <td className="p-2.5 font-sans">"[A004] Card rotates 15 degrees over 2s"</td>
                      <td className="p-2.5">rotate: 0 to 15deg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedDocCategory === 'voice' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Voice Synthesis & Rhythm Alignment</h4>
              <p>
                Natural voice narration tracks automatically estimate speaking durations using an average rate of 140 words per minute.
              </p>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <p>
                  • <strong>Speech Boundary Detection:</strong> When previewing audio, BlueStudio highlights the active spoken word in real-time.
                </p>
                <p>
                  • <strong>Keyframe Pacing Sync:</strong> Clicking <em>Sync Animations to Voice</em> stretches and shifts keyframe start times to match sentence beats.
                </p>
                <p>
                  • <strong>Pitch Modulation:</strong> Adjust pitch sliders between 0.8x (deep authority) to 1.2x (energetic enthusiasm).
                </p>
              </div>
            </div>
          )}

          {selectedDocCategory === 'director' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Cinematography, Transitions & Subtitles</h4>
              <p>The Video Director acts as an automated post-production suite:</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Camera Motions</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li><strong>Zoom In:</strong> Slow Ken Burns focal push.</li>
                    <li><strong>Zoom Out:</strong> Spatial reveal of scene assets.</li>
                    <li><strong>Pan Left / Right:</strong> Cinematic horizontal tracking.</li>
                    <li><strong>Dramatic Push:</strong> High-impact hero moment.</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Transitions & Captions</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li><strong>Crossfade:</strong> Soft dissolve between scenes.</li>
                    <li><strong>Slide:</strong> Fast dynamic sequence change.</li>
                    <li><strong>Burned-in Captions:</strong> Exported straight to video with dark backdrop cards for readability.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {selectedDocCategory === 'shortcuts' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Keyboard Shortcuts Cheat Sheet</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="p-2.5">Key</th>
                      <th className="p-2.5">Function</th>
                      <th className="p-2.5">Context</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="p-2.5"><kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold">Space</kbd></td>
                      <td className="p-2.5 font-sans">Toggle Play / Pause</td>
                      <td className="p-2.5 font-sans text-slate-500">Global Timeline</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold">← / →</kbd></td>
                      <td className="p-2.5 font-sans">Scrub Frame (±0.25s)</td>
                      <td className="p-2.5 font-sans text-slate-500">Global Timeline</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold">J / K / L</kbd></td>
                      <td className="p-2.5 font-sans">Rewind / Pause / Forward</td>
                      <td className="p-2.5 font-sans text-slate-500">NLE Transport</td>
                    </tr>
                    <tr>
                      <td className="p-2.5"><kbd className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold">Home / 0</kbd></td>
                      <td className="p-2.5 font-sans">Jump to Start of Scene</td>
                      <td className="p-2.5 font-sans text-slate-500">Timeline Transport</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
};
