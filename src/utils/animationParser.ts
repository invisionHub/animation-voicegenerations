import { AnimationPrimitive, AnimationSpec, Asset, EasingType } from '../types';

export interface ParsedInstructionResult {
  assetId: string;
  matchedBy: 'explicit_id' | 'number_index' | 'filename' | 'semantic' | 'fallback';
  rawInstruction: string;
  spec: AnimationSpec;
}

// Helper to generate a unique animation id
function uid(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Extract easing from instruction text
export function parseEasing(text: string): EasingType {
  const lower = text.toLowerCase();
  if (lower.includes('bounce') || lower.includes('spring')) return 'bounce';
  if (lower.includes('linear')) return 'linear';
  if (lower.includes('ease in and out') || lower.includes('ease-in-out') || lower.includes('smooth')) return 'easeInOut';
  if (lower.includes('ease in') || lower.includes('ease-in')) return 'easeIn';
  if (lower.includes('ease out') || lower.includes('ease-out')) return 'easeOut';
  return 'easeInOut';
}

// Extract duration from text (e.g. "in 2.5s", "for 3 seconds")
export function parseDuration(text: string, defaultDuration = 2.0): number {
  const durMatch = text.match(/(?:in|for|duration of|over)\s+([\d.]+)\s*(?:s|sec|seconds?)/i);
  if (durMatch && durMatch[1]) {
    const val = parseFloat(durMatch[1]);
    if (!isNaN(val) && val > 0 && val <= 30) return val;
  }
  return defaultDuration;
}

// Extract delay from text (e.g. "after 1s", "delay 0.5s", "starts at 2s")
export function parseDelay(text: string, defaultDelay = 0): number {
  const delayMatch = text.match(/(?:after|delay(?:ed)?(?: by)?|starting at|starts? at)\s+([\d.]+)\s*(?:s|sec|seconds?)/i);
  if (delayMatch && delayMatch[1]) {
    const val = parseFloat(delayMatch[1]);
    if (!isNaN(val) && val >= 0 && val <= 30) return val;
  }
  return defaultDelay;
}

/**
 * Parses natural language instruction into deterministic animation primitives
 */
export function instructionToPrimitives(rawText: string): AnimationPrimitive[] {
  const primitives: AnimationPrimitive[] = [];
  const lower = rawText.toLowerCase();
  const duration = parseDuration(rawText, 2.0);
  const startTime = parseDelay(rawText, 0.0);
  const easing = parseEasing(rawText);

  // Check for Translation / Slide / Walk / Move
  if (
    lower.includes('walk') ||
    lower.includes('slide') ||
    lower.includes('move') ||
    lower.includes('glide') ||
    lower.includes('enter') ||
    lower.includes('translate')
  ) {
    let fromX = 0;
    let fromY = 0;
    const toX = 0;
    const toY = 0;

    if (lower.includes('from left') || lower.includes('left to center') || lower.includes('walks in from left')) {
      fromX = -450;
    } else if (lower.includes('from right') || lower.includes('right to center')) {
      fromX = 450;
    } else if (lower.includes('upward') || lower.includes('from bottom') || lower.includes('slides up')) {
      fromY = 280;
    } else if (lower.includes('downward') || lower.includes('from top') || lower.includes('slides down')) {
      fromY = -280;
    } else {
      fromX = -300; // default lateral entry
    }

    primitives.push({
      id: uid(),
      type: 'translate',
      from: { x: fromX, y: fromY },
      to: { x: toX, y: toY },
      startTime,
      duration,
      easing,
    });
  }

  // Check for Fade / Opacity
  if (lower.includes('fade in') || lower.includes('appears') || lower.includes('reveal')) {
    primitives.push({
      id: uid(),
      type: 'fade',
      from: { opacity: 0 },
      to: { opacity: 1 },
      startTime,
      duration: Math.min(duration, 1.5),
      easing: 'easeOut',
    });
  } else if (lower.includes('fade out') || lower.includes('disappear')) {
    primitives.push({
      id: uid(),
      type: 'fade',
      from: { opacity: 1 },
      to: { opacity: 0 },
      startTime: startTime + (duration > 1.5 ? duration - 1.2 : 0),
      duration: 1.2,
      easing: 'easeIn',
    });
  }

  // Check for Scale / Zoom / Pulse
  if (lower.includes('scale') || lower.includes('zoom') || lower.includes('grow') || lower.includes('pulse') || lower.includes('pop')) {
    let targetScale = 1.1;
    let initialScale = 1.0;

    const scalePercent = lower.match(/(?:to|by)\s*(\d+)%/);
    const scaleFactor = lower.match(/(?:to|by)\s*([\d.]+)(?:x)?/);
    if (scalePercent && scalePercent[1]) {
      targetScale = parseInt(scalePercent[1], 10) / 100;
    } else if (scaleFactor && scaleFactor[1]) {
      targetScale = parseFloat(scaleFactor[1]);
    } else if (lower.includes('pop') || lower.includes('grow from zero') || lower.includes('from 0')) {
      initialScale = 0;
      targetScale = 1.0;
    }

    primitives.push({
      id: uid(),
      type: 'scale',
      from: { scale: initialScale },
      to: { scale: targetScale },
      startTime: startTime + 0.2,
      duration: Math.max(0.8, duration - 0.4),
      easing: lower.includes('pop') ? 'bounce' : easing,
    });
  }

  // Check for Rotate / Spin
  if (lower.includes('rotate') || lower.includes('spin') || lower.includes('tilt') || lower.includes('degrees')) {
    let degrees = 12;
    const degMatch = lower.match(/(-?\d+)\s*(?:deg|degrees?)/);
    if (degMatch && degMatch[1]) {
      degrees = parseInt(degMatch[1], 10);
    } else if (lower.includes('spin')) {
      degrees = 360;
    }

    primitives.push({
      id: uid(),
      type: 'rotate',
      from: { rotate: 0 },
      to: { rotate: degrees },
      startTime: startTime + 0.1,
      duration,
      easing,
    });
  }

  // Fallback if no specific keyword matched: provide subtle pleasant slide & fade
  if (primitives.length === 0) {
    primitives.push(
      {
        id: uid(),
        type: 'translate',
        from: { x: -200, y: 0 },
        to: { x: 0, y: 0 },
        startTime,
        duration,
        easing: 'easeInOut',
      },
      {
        id: uid(),
        type: 'fade',
        from: { opacity: 0 },
        to: { opacity: 1 },
        startTime,
        duration: Math.min(duration, 1.2),
        easing: 'easeOut',
      }
    );
  }

  return primitives;
}

/**
 * Maps a single instruction line to an asset from available assets
 */
export function mapInstructionToAsset(
  line: string,
  index: number,
  availableAssets: Asset[],
  assignedAssetIds: Set<string>
): ParsedInstructionResult {
  const trimmed = line.trim();

  // 1. Explicit ID mapping: e.g. "[A001] ...", "A001: ...", "(A001) ..."
  const explicitMatch = trimmed.match(/^\[([A-Za-z0-9_-]+)\]|^([A-Za-z0-9_-]+):\s*|^\(([A-Za-z0-9_-]+)\)/);
  if (explicitMatch) {
    const rawId = (explicitMatch[1] || explicitMatch[2] || explicitMatch[3]).toUpperCase();
    const foundAsset = availableAssets.find((a) => a.id.toUpperCase() === rawId);
    if (foundAsset) {
      const cleanInstruction = trimmed.replace(explicitMatch[0], '').trim();
      return {
        assetId: foundAsset.id,
        matchedBy: 'explicit_id',
        rawInstruction: cleanInstruction || trimmed,
        spec: {
          assetId: foundAsset.id,
          animations: instructionToPrimitives(cleanInstruction || trimmed),
        },
      };
    }
  }

  // 2. Number mapping: e.g. "1. ..." or "Instruction 1: ..."
  const numberMatch = trimmed.match(/^(?:Instruction\s+)?(\d+)[.:)]\s*/i);
  if (numberMatch && numberMatch[1]) {
    const assetIdx = parseInt(numberMatch[1], 10) - 1;
    if (assetIdx >= 0 && assetIdx < availableAssets.length) {
      const targetAsset = availableAssets[assetIdx];
      const cleanInstruction = trimmed.replace(numberMatch[0], '').trim();
      return {
        assetId: targetAsset.id,
        matchedBy: 'number_index',
        rawInstruction: cleanInstruction || trimmed,
        spec: {
          assetId: targetAsset.id,
          animations: instructionToPrimitives(cleanInstruction || trimmed),
        },
      };
    }
  }

  // 3. Filename mapping: e.g. "character_presenter.svg -> ..." or "laptop.svg: ..."
  for (const asset of availableAssets) {
    const baseName = asset.name.toLowerCase().replace(/\.[^/.]+$/, '');
    const fullName = asset.name.toLowerCase();
    if (trimmed.toLowerCase().includes(fullName) || trimmed.toLowerCase().includes(baseName)) {
      return {
        assetId: asset.id,
        matchedBy: 'filename',
        rawInstruction: trimmed,
        spec: {
          assetId: asset.id,
          animations: instructionToPrimitives(trimmed),
        },
      };
    }
  }

  // 4. Semantic keyword mapping
  const semanticKeywords: Record<string, string[]> = {
    A001: ['character', 'person', 'presenter', 'actor', 'avatar', 'man', 'woman', 'human', 'walk'],
    A002: ['laptop', 'computer', 'screen', 'dashboard', 'notebook', 'macbook', 'web'],
    A003: ['phone', 'mobile', 'smartphone', 'iphone', 'handset', 'app'],
    A004: ['card', 'credit', 'debit', 'platinum', 'payment', 'visa', 'mastercard'],
    A005: ['shield', 'security', 'vault', 'lock', 'safe', 'protection'],
    A006: ['badge', 'notification', 'transfer', 'alert', 'popup', 'pill', 'banner'],
  };

  const lower = trimmed.toLowerCase();
  for (const [assetId, keywords] of Object.entries(semanticKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      const matched = availableAssets.find((a) => a.id === assetId);
      if (matched) {
        return {
          assetId: matched.id,
          matchedBy: 'semantic',
          rawInstruction: trimmed,
          spec: {
            assetId: matched.id,
            animations: instructionToPrimitives(trimmed),
          },
        };
      }
    }
  }

  // 5. Fallback: match by positional index among unassigned assets
  const unassigned = availableAssets.filter((a) => !assignedAssetIds.has(a.id));
  const fallbackAsset = unassigned.length > 0 ? unassigned[0] : availableAssets[index % availableAssets.length];

  return {
    assetId: fallbackAsset.id,
    matchedBy: 'fallback',
    rawInstruction: trimmed,
    spec: {
      assetId: fallbackAsset.id,
      animations: instructionToPrimitives(trimmed),
    },
  };
}

/**
 * Batch parses multiple instruction lines
 */
export function parseInstructionsBlock(
  inputText: string,
  availableAssets: Asset[]
): ParsedInstructionResult[] {
  const lines = inputText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith('//') && !l.startsWith('#'));

  const results: ParsedInstructionResult[] = [];
  const assigned = new Set<string>();

  lines.forEach((line, idx) => {
    const res = mapInstructionToAsset(line, idx, availableAssets, assigned);
    assigned.add(res.assetId);
    results.push(res);
  });

  return results;
}
