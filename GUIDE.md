# BlueStudio — User Guide & Technical Documentation

> **Professional creative studio for natural-language asset animation, voiceover narration, automated video direction, and multi-format video rendering.**

---

## Table of Contents

1. [Introduction & Philosophy](#1-introduction--philosophy)
2. [Interface Anatomy & Studio Workspaces](#2-interface-anatomy--studio-workspaces)
3. [Quick Start: 5 Steps to Your First Animated Video](#3-quick-start-5-steps-to-your-first-animated-video)
4. [Creative Workspace 1: Animation Stage & Natural Language Engine](#4-creative-workspace-1-animation-stage--natural-language-engine)
5. [Creative Workspace 2: Natural Voice Studio & Keyframe Sync](#5-creative-workspace-2-natural-voice-studio--keyframe-sync)
6. [Creative Workspace 3: Automated Video Director & Cinematography](#6-creative-workspace-3-automated-video-director--cinematography)
7. [Asset Management & Library](#7-asset-management--library)
8. [Rendering Engine & Multi-Format Production Exports](#8-rendering-engine--multi-format-production-exports)
9. [Keyboard Shortcuts Cheat Sheet](#9-keyboard-shortcuts-cheat-sheet)
10. [Architecture & Storage Schema](#10-architecture--storage-schema)

---

## 1. Introduction & Philosophy

**BlueStudio** bridges the gap between complex non-linear video editors (NLEs) and modern generative creative tooling. It operates on four core principles:

- **Friendly & Plain English:** Describe motion naturally (e.g., *"Character walks from left to center and fades in over 2.5s"*), and let the engine construct deterministic transforms.
- **Voice-First Rhythm:** Spoken word pacing dictates animation speed. Durations and keyframes synchronize directly to vocal cadence.
- **Cinematic Direction:** Elevate 2D vector assets into polished productions using camera movements (Zoom, Pan, Push), dynamic transitions, and burnt-in subtitles.
- **Multi-Format Export Ready:** Export directly for YouTube (16:9), TikTok/Reels (9:16), Instagram (1:1, 4:5), or download full project JSON archives and standalone HTML players.

---

## 2. Interface Anatomy & Studio Workspaces

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] BlueStudio  [Project ▾]    [Animation] [Voice] [Video]   [Guide]│
├──────────────┬───────────────────────────────────────────┬─────────────┤
│ Scene Drawer │           Interactive Stage               │ Inspector   │
│              │                                           │             │
│ • Scene 01   │            [Canvas Viewport]              │ • Position  │
│ • Scene 02   │                                           │ • Scale     │
│ • Scene 03   ├───────────────────────────────────────────┤ • Opacity   │
│              │ Natural Language Instruction Prompt       │ • Easing    │
├──────────────┴───────────────────────────────────────────┴─────────────┤
│ Timeline Transport: Play/Pause, Scrubber, Keyframe Markers, Audio Wave │
└────────────────────────────────────────────────────────────────────────┘
```

The header provides instant access to the three creative modes and secondary drawers:
- **Animation (`Clapperboard`):** Stage staging, positioning, layer hierarchy, and natural-language prompt instructions.
- **Voice (`Mic`):** Script generation, tone refinement, persona selection, speech modulation, and speech-to-keyframe alignment.
- **Video Director (`Video`):** Scene sequence composition, camera motions, transitions, and automatic subtitles.
- **Assets (`Layers`):** Project-wide graphic assets upload, assignment, and SVG previews.
- **Renders (`DownloadCloud`):** Real-time render job queue, preview player, and video clip downloads.
- **Guide & Tour (`BookOpen`):** Interactive walkthrough and searchable documentation manual.

---

## 3. Quick Start: 5 Steps to Your First Animated Video

1. **Create or Pick a Scene:**
   - In the left Scene Drawer, click **+ Add Scene** or click on **Scene 01**.
2. **Arrange Your Visual Assets:**
   - Click assets from the Asset Library or stage. Use the **Inspector Panel** on the right to position them using percentage coordinates ($X, Y$), scale, and opacity.
3. **Write Natural Language Motion Instructions:**
   - In the bottom prompt editor, type what each asset should do:
     ```text
     [A001] Character walks from left to center and fades in over 2s with bounce ease
     [A002] Laptop slides from bottom in 1.5s after 0.5s with easeInOut
     ```
   - Click **Review & Apply** to verify the mapped transforms.
4. **Synthesize Narration in Voice Studio:**
   - Switch to the **Voice** tab, enter your scene script, pick a persona (*Sophia, Alex, Marcus, Emma*), test audio playback, and click **Sync Animations to Voice**.
5. **Direct Camera & Render:**
   - Switch to **Video Director**, pick a camera movement (e.g. *Dramatic Push* or *Zoom In*), click **Auto-Generate Captions**, and click **Render Full Composition**.

---

## 4. Creative Workspace 1: Animation Stage & Natural Language Engine

### Prompting Syntax & Supported Keywords

BlueStudio's parser reads everyday phrasing and decomposes instructions into deterministic primitives:

| Feature | Supported Keywords | Example |
| :--- | :--- | :--- |
| **Movement / Translation** | `walk`, `move`, `slide`, `glide`, `from left`, `from bottom`, `to center` | `[A001] walks from left to center` |
| **Scaling & Zoom** | `scale`, `zoom`, `grow`, `shrink`, `pop in`, `expand` | `[A005] shield pops in and scales to 1.2` |
| **Fading & Opacity** | `fade in`, `fade out`, `appear`, `disappear`, `transparent` | `[A002] fades in over 1.5s` |
| **Rotation** | `rotate`, `spin`, `tilt`, `angle` | `[A004] card tilts 15 degrees` |
| **Duration Timing** | `in [N]s`, `over [N] seconds`, `for [N]s` | `over 2.5s` |
| **Start Delays** | `after [N]s`, `starting at [N]s`, `delay [N]s` | `after 0.8s` |
| **Easing Curves** | `linear`, `ease in`, `ease out`, `ease in out`, `bounce`, `spring` | `with bounce ease` |

### Asset Tagging Methods
- **Explicit ID:** `[A001]`, `A001:`, `(A001)`
- **Number Index:** `1. ...`, `2. ...`
- **Filename / Semantic:** `laptop.svg -> ...`, `character presenter walks ...`

---

## 5. Creative Workspace 2: Natural Voice Studio & Keyframe Sync

### Curated Voice Personas
- **Sophia (Neutral / Professional):** Balanced cadence, clear enunciation (Default 1.0x rate, 1.0x pitch).
- **Alex (Energetic / Tech):** Upbeat, brisk delivery (1.05x rate, 1.02x pitch).
- **Marcus (Authoritative / Warm):** Deep resonant pitch, slower tempo (0.95x rate, 0.90x pitch).
- **Emma (Conversational / Storyteller):** Friendly, narrative pitch (1.02x rate, 1.05x pitch).

### Script Tone Refinement
- **Conversational Tone:** Warm, approachable copy.
- **Professional Explainer:** Direct, clear, structured information delivery.
- **Punchy Promo:** Dynamic, concise, action-oriented lines.

### Automatic Speech-to-Animation Alignment
Clicking **Sync Animations to Voice**:
- Calculates word-boundary markers from spoken text.
- Re-aligns asset animation keyframe start times and durations so visual emphasis lands precisely on vocal inflection points.
- Automatically adjusts scene duration to ensure narration is never cut off.

---

## 6. Creative Workspace 3: Automated Video Director & Cinematography

### Camera Motions
- **Zoom In (Focal):** Smooth continuous push toward center (ideal for detail reveals).
- **Zoom Out (Spatial Reveal):** Wide pull back to show full scene environment.
- **Pan Left / Right:** Cinematic horizontal tracking across the canvas stage.
- **Dramatic Push:** Fast energetic punch-in to hero assets.
- **Locked (Static):** Clean tripod framing without camera movements.

### Transitions
- **Crossfade Dissolve:** Seamless alpha dissolve between scenes.
- **Slide Left / Right:** Swift broadcast-style slide.
- **Zoom Push:** Kinetic zoom into the next scene.
- **Direct Cut:** Instant frame switch.

### Subtitle & Caption Automation
- Click **Auto-Generate Captions** to slice narration into readable sentence chunks.
- Subtitles are rendered with dark background pill cards with high-contrast typography, fully responsive across 16:9, 9:16, 1:1, and 4:5 ratios.

---

## 7. Asset Management & Library

- **Pre-Loaded Production Assets:** Vector SVGs optimized for resolution independence (Presenters, Devices, Cards, Security Shields, Badges).
- **Upload Assets:** Drag & drop any `.svg`, `.png`, or `.jpg` image files into the Asset Library.
- **Scene Layer Assignment:** Assign assets to one or more scenes with custom sort order and visibility.

---

## 8. Rendering Engine & Multi-Format Production Exports

### Export Targets
1. **Full Project Composition Video:** Stitches every scene, transition, camera motion, and narration track into a unified `.webm` video.
2. **Scene Composite Video:** Renders all layered assets in the active scene together.
3. **Independent Asset Clips:** Renders isolated video clips for each asset with transparent alpha backgrounds for external NLE compositing.
4. **Project JSON Archive:** Download `.bluestudio.json` containing complete state, timelines, prompts, and settings.
5. **Standalone HTML Player:** Generates a lightweight, self-contained interactive web player.

### Aspect Ratios
- **16:9 Landscape:** YouTube, Desktop, TV broadcasts ($1920 \times 1080$).
- **9:16 Vertical:** TikTok, Instagram Reels, YouTube Shorts ($1080 \times 1920$).
- **1:1 Square:** Instagram Feed, LinkedIn ($1080 \times 1080$).
- **4:5 Portrait:** Social Mobile Posts ($1080 \times 1350$).

---

## 9. Keyboard Shortcuts Cheat Sheet

| Key Shortcut | Function | Context |
| :--- | :--- | :--- |
| <kbd>Space</kbd> | Toggle Play / Pause | Global Timeline Playback |
| <kbd>←</kbd> | Scrub Backward 0.25s | Global Timeline |
| <kbd>→</kbd> | Scrub Forward 0.25s | Global Timeline |
| <kbd>J</kbd> | Rewind (1.0s) | Transport Control |
| <kbd>K</kbd> | Stop / Pause | Transport Control |
| <kbd>L</kbd> | Fast Forward (1.0s) | Transport Control |
| <kbd>Home</kbd> or <kbd>0</kbd> | Jump to Start of Scene | Timeline Scrubber |
| <kbd>?</kbd> or <kbd>Cmd</kbd>+<kbd>/</kbd> | Open Studio Guide & Tour | Global |

---

## 10. Architecture & Storage Schema

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4.
- **Local Persistence:** `localStorage` synchronization across `projects`, `scenes`, `assets`, `sceneAssets`, `instructions`, `voiceTracks`, and `renderJobs`.
- **Canvas Rendering:** HTML5 2D Canvas deterministic frame-by-frame loop with `MediaRecorder` stream recording.
- **Speech Engine:** Web Speech API (`SpeechSynthesisUtterance`) with live word boundary tracking and synthetic audio preview.
