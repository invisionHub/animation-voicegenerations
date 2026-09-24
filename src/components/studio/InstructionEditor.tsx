import React, { useState } from 'react';
import { Asset } from '../../types';
import { Sparkles, ArrowRight, Wand2, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface InstructionEditorProps {
  availableAssets: Asset[];
  onOpenMappingReview: (rawText: string) => void;
  currentInstructionsText: string;
}

export const InstructionEditor: React.FC<InstructionEditorProps> = ({
  availableAssets,
  onOpenMappingReview,
  currentInstructionsText,
}) => {
  const [text, setText] = useState(currentInstructionsText);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const quickTemplates = [
    {
      label: 'Walk in',
      text: '[A001] Character walks from left to center and fades in over 2.5s',
    },
    {
      label: 'Slide up & scale',
      text: '[A002] Laptop slides upward from bottom and scales to 110% over 2s with easeInOut',
    },
    {
      label: 'Pulse & bounce',
      text: '[A005] Security shield fades in and scales with bounce easing for 2.2s',
    },
    {
      label: 'Glide & rotate',
      text: '[A004] Platinum card glides from right to center and rotates 10 degrees in 2s',
    },
  ];

  const handleApplyTemplate = (snippet: string) => {
    setText((prev) => (prev.trim() ? `${prev.trim()}\n${snippet}` : snippet));
    setCopiedTemplate(snippet);
    setTimeout(() => setCopiedTemplate(null), 1500);
  };

  return (
    <div className="bg-white border-t border-slate-200 p-4 shrink-0 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Header & Helpers */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800">
              Animation Instructions
            </h4>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-500">
              Describe how your assets should move or appear in plain words.
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-600">Quick Starters:</span>
            {quickTemplates.map((t, i) => (
              <button
                key={i}
                onClick={() => handleApplyTemplate(t.text)}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors"
              >
                {copiedTemplate === t.text ? (
                  <span className="flex items-center gap-0.5 text-emerald-600">
                    <Check className="w-3 h-3" /> Added
                  </span>
                ) : (
                  `+ ${t.label}`
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea Input */}
        <div className="relative">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Describe your animation in plain words, one per line:\n[A001] Character walks from left to center over 2.5s\n[A002] Laptop slides upward from bottom and scales to 110%\n[A003] Smartphone fades in and rotates 15 degrees`}
            className="w-full text-xs font-mono p-3 bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed transition-all"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              disabled={!text.trim()}
              onClick={() => onOpenMappingReview(text)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Review & Apply
            </Button>
          </div>
        </div>

        {/* Available Asset Chips / Reference List */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 overflow-x-auto py-0.5">
          <span className="font-semibold text-slate-700 shrink-0">In this scene:</span>
          {availableAssets.length === 0 ? (
            <span className="text-slate-400 italic">No assets assigned yet</span>
          ) : (
            availableAssets.map((a) => (
              <button
                key={a.id}
                onClick={() => handleApplyTemplate(`[${a.id}] ${a.name} slides in over 2s`)}
                className="shrink-0 font-mono text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/90 transition-colors flex items-center gap-1"
                title="Click to insert starter instruction for this asset"
              >
                <span className="font-bold text-blue-700">{a.id}</span>
                <span className="truncate max-w-[120px]">{a.name.split('.')[0]}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
