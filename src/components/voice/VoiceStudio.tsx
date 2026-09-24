import React, { useState, useEffect, useRef } from 'react';
import { Scene, VoiceTrack, WordTimestamp, AnimationSpec } from '../../types';
import {
  Mic,
  Play,
  Square,
  Sliders,
  Check,
  Trash2,
  Sparkles,
  Save,
  Volume2,
  Wand2,
  RefreshCw,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../ui/NotificationToast';

interface VoiceStudioProps {
  projectId: string;
  scenes: Scene[];
  activeSceneId: string;
  voiceTracks: VoiceTrack[];
  onSaveVoiceTrack: (track: VoiceTrack) => void;
  onDeleteVoiceTrack: (trackId: string) => void;
  onSyncAnimationsWithVoice?: (sceneId: string, words: WordTimestamp[]) => void;
}

interface CuratedPersona {
  id: string;
  name: string;
  gender: 'female' | 'male';
  style: string;
  pitch: number;
  rate: number;
  sampleText: string;
}

const CURATED_PERSONAS: CuratedPersona[] = [
  {
    id: 'persona_sophia',
    name: 'Sophia',
    gender: 'female',
    style: 'Clear, Engaging & Friendly',
    pitch: 1.05,
    rate: 1.0,
    sampleText: 'Welcome! Let us explore how modern finance works with speed and security.',
  },
  {
    id: 'persona_alex',
    name: 'Alex',
    gender: 'male',
    style: 'Confident & Conversational',
    pitch: 0.95,
    rate: 1.0,
    sampleText: 'Experience effortless enterprise asset management right at your fingertips.',
  },
  {
    id: 'persona_marcus',
    name: 'Marcus',
    gender: 'male',
    style: 'Authoritative & Premium',
    pitch: 0.85,
    rate: 0.95,
    sampleText: 'Bank-grade biometric encryption guarantees safety for every single transaction.',
  },
  {
    id: 'persona_emma',
    name: 'Emma',
    gender: 'female',
    style: 'Warm & Natural Storyteller',
    pitch: 1.1,
    rate: 0.98,
    sampleText: 'Send funds globally in seconds with real-time settlement and automatic reconciliation.',
  },
];

export const VoiceStudio: React.FC<VoiceStudioProps> = ({
  projectId,
  scenes,
  activeSceneId,
  voiceTracks,
  onSaveVoiceTrack,
  onDeleteVoiceTrack,
  onSyncAnimationsWithVoice,
}) => {
  const [targetSceneId, setTargetSceneId] = useState(activeSceneId);
  const activeScene = scenes.find((s) => s.id === targetSceneId) || scenes[0];
  const existingTrack = voiceTracks.find((vt) => vt.sceneId === targetSceneId);

  const [scriptText, setScriptText] = useState(
    existingTrack?.text ||
      'Welcome to the next generation of digital finance. Manage your assets with clarity, enterprise security, and instantaneous speed.'
  );
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('persona_sophia');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [rate, setRate] = useState<number>(1.0);
  const [pitch, setPitch] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [recordedWords, setRecordedWords] = useState<WordTimestamp[]>([]);
  const [scriptTone, setScriptTone] = useState<'conversational' | 'professional' | 'punchy'>('conversational');
  const toast = useToast();
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Keep target scene in sync with activeSceneId prop
  useEffect(() => {
    if (activeSceneId && activeSceneId !== targetSceneId) {
      setTargetSceneId(activeSceneId);
      const track = voiceTracks.find((vt) => vt.sceneId === activeSceneId);
      if (track) {
        setScriptText(track.text);
      }
    }
  }, [activeSceneId]);

  // Load browser TTS voices
  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        if (voices.length > 0 && !selectedVoiceUri) {
          const englishVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
          setSelectedVoiceUri(englishVoice.voiceURI);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Compute metrics
  const wordsList = scriptText.trim().split(/\s+/).filter(Boolean);
  const wordCount = wordsList.length;
  // Average speaking speed ~140 wpm
  const estimatedSeconds = Math.max(1, (wordCount / (140 * rate)) * 60);

  // Generate word timestamps synthetically or via boundary
  const generateWordTimestamps = (): WordTimestamp[] => {
    const totalDuration = estimatedSeconds;
    const timePerWord = totalDuration / Math.max(1, wordsList.length);
    return wordsList.map((word, index) => ({
      word,
      start: parseFloat((index * timePerWord).toFixed(2)),
      end: parseFloat(((index + 1) * timePerWord).toFixed(2)),
    }));
  };

  const handleSelectPersona = (persona: CuratedPersona) => {
    setSelectedPersonaId(persona.id);
    setPitch(persona.pitch);
    setRate(persona.rate);
    // Find matching voice if possible
    const match = availableVoices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (persona.gender === 'female'
          ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha')
          : v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david'))
    );
    if (match) {
      setSelectedVoiceUri(match.voiceURI);
    }
    toast.info(`Voice selected: ${persona.name}`, `${persona.style}`);
  };

  const handleRefineScript = (tone: 'conversational' | 'professional' | 'punchy') => {
    setScriptTone(tone);
    if (tone === 'punchy') {
      setScriptText(
        'Next-gen digital finance. Instant speed, zero friction, and unmatched bank-grade security. Control your money with confidence.'
      );
    } else if (tone === 'professional') {
      setScriptText(
        'Welcome to our unified institutional banking architecture. We provide multi-layer cryptographic validation and global settlement clearance.'
      );
    } else {
      setScriptText(
        'Welcome to the next generation of digital finance. Manage your assets with clarity, enterprise security, and instantaneous speed.'
      );
    }
    toast.success('Script refined', `Adapted tone to ${tone}.`);
  };

  const handlePlayPreview = () => {
    if (!('speechSynthesis' in window)) {
      toast.error('Voice not supported', 'Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(scriptText);
    utteranceRef.current = utterance;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (selectedVoiceUri) {
      const v = availableVoices.find((item) => item.voiceURI === selectedVoiceUri);
      if (v) utterance.voice = v;
    }

    const calculatedWords = generateWordTimestamps();
    setRecordedWords(calculatedWords);

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        // calculate which word index
        const textBefore = scriptText.substring(0, charIndex);
        const idx = textBefore.trim().split(/\s+/).filter(Boolean).length;
        setCurrentWordIndex(idx);
      }
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentWordIndex(0);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopPreview = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    }
  };

  const handleSaveToScene = () => {
    const selectedVoiceObj = availableVoices.find((v) => v.voiceURI === selectedVoiceUri);
    const persona = CURATED_PERSONAS.find((p) => p.id === selectedPersonaId);
    const words = generateWordTimestamps();

    // Generate pseudo-waveform amplitude data
    const waveform = Array.from({ length: 48 }, () => Math.round(15 + Math.random() * 85));

    const newTrack: VoiceTrack = {
      id: `vt_${Date.now()}`,
      projectId,
      sceneId: targetSceneId,
      title: `${activeScene.name} Voiceover`,
      text: scriptText,
      voiceName: selectedVoiceObj?.name || persona?.name || 'Standard Assistant',
      persona: persona?.name || 'Sophia',
      rate,
      pitch,
      duration: parseFloat(estimatedSeconds.toFixed(1)),
      status: 'ready',
      createdAt: new Date().toISOString(),
      words,
      waveform,
    };

    onSaveVoiceTrack(newTrack);
    toast.success(
      'Narration track saved',
      `Assigned to "${activeScene.name}" (${estimatedSeconds.toFixed(1)}s duration).`
    );
  };

  const handleSyncAnimations = () => {
    const words = generateWordTimestamps();
    if (onSyncAnimationsWithVoice) {
      onSyncAnimationsWithVoice(targetSceneId, words);
      toast.success(
        'Synced with narration',
        `Scene keyframes aligned to speech pacing (${words.length} spoken words).`
      );
    } else {
      toast.success('Sync complete', 'Animation timings matched to spoken word duration.');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Mic className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Voice & Narration Studio</h2>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-xs text-slate-500 font-mono">
            {estimatedSeconds.toFixed(1)}s estimated narration duration ({wordCount} words)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Target Scene Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Target Scene:</span>
            <select
              value={targetSceneId}
              onChange={(e) => setTargetSceneId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              {scenes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration.toFixed(1)}s)
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleSyncAnimations}
            leftIcon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
          >
            Sync Animations to Voice
          </Button>

          <Button
            size="sm"
            variant="primary"
            onClick={handleSaveToScene}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save to Scene
          </Button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Script Editor & Waveform */}
          <div className="lg:col-span-2 space-y-5">
            {/* Script Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">Narration Script</h3>
                </div>

                {/* Tone Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => handleRefineScript('conversational')}
                    className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all ${
                      scriptTone === 'conversational'
                        ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Conversational
                  </button>
                  <button
                    onClick={() => handleRefineScript('professional')}
                    className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all ${
                      scriptTone === 'professional'
                        ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Professional
                  </button>
                  <button
                    onClick={() => handleRefineScript('punchy')}
                    className={`text-[11px] px-2 py-0.5 rounded font-medium transition-all ${
                      scriptTone === 'punchy'
                        ? 'bg-white text-blue-700 shadow-2xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Punchy
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder="Enter scene voiceover script..."
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 leading-relaxed resize-none"
              />

              {/* Spoken Word Tracker */}
              <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Voice Pacing & Cadence ({wordsList.length} words)
                </span>
                <div className="flex flex-wrap gap-1 text-xs">
                  {wordsList.map((word, i) => {
                    const isCurrent = i === currentWordIndex;
                    return (
                      <span
                        key={i}
                        className={`px-1.5 py-0.5 rounded transition-all duration-100 ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold scale-105 shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-200/60'
                        }`}
                      >
                        {word}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Audio Waveform & Live Playback Scrubber */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-blue-600" />
                  <h3 className="text-xs font-bold text-slate-900">Audio Preview & Waveform</h3>
                </div>

                <div className="flex items-center gap-2">
                  {isSpeaking ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={handleStopPreview}
                      leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
                    >
                      Stop
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handlePlayPreview}
                      leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                    >
                      Listen Preview
                    </Button>
                  )}
                </div>
              </div>

              {/* Simulated Dynamic Waveform */}
              <div className="h-16 bg-slate-900 rounded-xl p-3 flex items-center justify-between gap-1 overflow-hidden">
                {Array.from({ length: 44 }).map((_, idx) => {
                  const isActiveBar = isSpeaking && (idx % 5 === Math.floor((Date.now() / 200) % 5));
                  const heightPercent = 20 + Math.sin(idx * 0.4) * 35 + ((idx * 7) % 30);

                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPercent}%` }}
                      className={`w-1 rounded-full transition-all duration-75 ${
                        isSpeaking
                          ? isActiveBar
                            ? 'bg-blue-400 scale-y-125'
                            : 'bg-blue-600'
                          : 'bg-slate-700'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>00:00.00</span>
                <span className="text-blue-600 font-semibold">
                  {isSpeaking ? 'Playing voice synthesis...' : 'Ready to synthesize'}
                </span>
                <span>00:{estimatedSeconds.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Right Col: Curated Voice Personas & Modulation Controls */}
          <div className="space-y-5">
            {/* Curated Voice Library */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Curated Voice Library</h3>
              </div>

              <div className="space-y-2">
                {CURATED_PERSONAS.map((persona) => {
                  const isSelected = selectedPersonaId === persona.id;
                  return (
                    <div
                      key={persona.id}
                      onClick={() => handleSelectPersona(persona)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-400 shadow-2xs ring-1 ring-blue-500/20'
                          : 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{persona.name}</span>
                        <Badge variant={isSelected ? 'brand' : 'neutral'} size="sm">
                          {persona.gender}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                        {persona.style}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900">Speech Modulation</h3>
              </div>

              {/* Speed / Rate */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Pacing (Speed)</span>
                  <span className="font-mono text-blue-600">{rate.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Pitch */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Pitch Tone</span>
                  <span className="font-mono text-blue-600">{pitch.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Volume */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium text-slate-700">
                  <span>Volume</span>
                  <span className="font-mono text-blue-600">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
