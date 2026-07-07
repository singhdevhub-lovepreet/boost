# Boost Website — Structured Design & Development Prompt

## Project Overview

Build a single-page marketing website for **Boost** — an open-source developer productivity toolkit. The core message: **"Make your productivity 100x."** The site must feel like it was built by developers, for developers. Dark mode only. Terminal-native aesthetic. Every animation should reinforce the idea that Boost eliminates context-switching friction.

---

## 1. Design System

### 1.1 Color Palette

```
Background layers:
  --bg-primary:      #0A0A0F        (deep void black)
  --bg-secondary:    #12121A        (card/section surfaces)
  --bg-tertiary:     #1A1A28        (elevated surfaces, terminal bg)
  --bg-terminal:     #0D1117        (GitHub-dark terminal feel)

Accent gradient (primary CTA, highlights):
  --accent-start:    #6366F1        (indigo)
  --accent-mid:      #8B5CF6        (violet)
  --accent-end:      #A855F7        (purple)

Secondary accent (success states, branch labels):
  --green:           #10B981        (terminal green)
  --cyan:            #22D3EE        (info, links)
  --amber:           #F59E0B        (warnings, second branch color)
  --rose:            #F43F5E        (destructive, third branch color)

Text:
  --text-primary:    #E2E8F0        (headings, body)
  --text-secondary:  #94A3B8        (muted, descriptions)
  --text-tertiary:   #475569        (disabled, line numbers)

Borders:
  --border-subtle:   #1E293B
  --border-glow:     rgba(99, 102, 241, 0.4)   (accent glow on focus/hover)
```

### 1.2 Typography

```
Primary font:     "Inter" (headings, body)
Monospace font:   "JetBrains Mono" or "Fira Code" (terminal, code blocks, feature labels)

Scale (clamp-based fluid):
  --text-hero:      clamp(3rem, 6vw, 5.5rem)     (main headline)
  --text-h2:        clamp(2rem, 4vw, 3rem)        (section headings)
  --text-h3:        clamp(1.25rem, 2.5vw, 1.75rem)
  --text-body:      1rem / 1.6 line-height
  --text-small:     0.875rem
  --text-mono:      0.9rem / 1.5 line-height

Weights:
  Hero headline:    800 (Extra Bold)
  Section heads:    700 (Bold)
  Body:             400 (Regular)
  Code/terminal:    450 (JetBrains Mono Regular)
```

### 1.3 Spacing & Layout

```
Max content width:   1280px
Section padding:     clamp(4rem, 8vw, 8rem) vertical
Card border-radius:  12px
Terminal radius:     8px (top), 0 (bottom) — mimics real terminal
```

### 1.4 Gradients & Effects

```
Hero gradient (text):
  background: linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)
  -webkit-background-clip: text

Section divider glow:
  radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)

Card hover:
  box-shadow: 0 0 40px rgba(99,102,241,0.08)
  border: 1px solid var(--border-glow)

Noise overlay (subtle):
  Apply a very faint SVG noise texture at 3-5% opacity over --bg-primary
  to prevent banding and add depth.
```

---

## 2. Page Structure & Sections

### Section 1: Hero

```
Layout:
  Full viewport height. Centered content.
  Subtle radial gradient glow behind the headline (indigo/purple, 20% opacity).

Content:
  [Top]     Small pill badge: "Open Source Developer Toolkit"
  [Center]  Headline (gradient text, 800 weight):
                "Make Your Productivity"
                "100x"                          ← massive, gradient, slightly animated scale pulse
  [Below]   Subheadline (--text-secondary, 1.125rem):
                "A collection of terminal-native tools that eliminate
                 context-switching friction. Built for developers who
                 live in the terminal."
  [CTA]     Two buttons side by side:
                [Get Started]    — filled, accent gradient, glow shadow
                [View on GitHub] — outlined, border-glow on hover
  [Bottom]  Scroll indicator: subtle animated chevron or "scroll" text

Background animation:
  A very subtle floating grid of dots (like a starfield or matrix grid)
  slowly drifting upward at 0.5px/s, fading at edges. Low opacity (5-8%).
```

### Section 2: Live Terminal Animation (THE HERO PIECE)

```
Layout:
  Centered terminal window (max-width: 900px).
  macOS-style title bar with three dots (red/yellow/green).
  Title bar text: "boost — tmux-auto-adjust"
  Below terminal: caption text explaining what's happening.

Terminal specs:
  Background: --bg-terminal (#0D1117)
  Font: JetBrains Mono, 14px
  Cursor: blinking block cursor, accent color (#6366F1)
  Prompt style: "~/projects/myapp (main) $"  — green path, cyan branch

Animation sequence (looping, ~18-22 seconds total):

  PHASE 1 — INITIAL STATE (3s)
    Show a tmux window with 3 disorganized panes:
    ┌─────────────────────────────────────────────┐
    │ ~/projects/myapp (main) $                   │
    ├──────────────────┬──────────────────────────┤
    │ ~/myapp (feat) $ │ ~/myapp (main) $         │
    └──────────────────┴──────────────────────────┘
    Pane borders show labels: "myapp/main", "myapp/feature-login", "myapp/main"
    Labels are plain white — no grouping yet.
    Caption below: "Three panes, two branches, no organization."

  PHASE 2 — TYPING (4s)
    In the top pane, typewriter-animate the command:
      $ cd ../myapp-feature-login
    Cursor blinks, then types character by character (60ms per char).
    Press Enter (brief pause).
    Prompt changes to: "~/myapp-feature-login (feature-login) $"
    Caption: "Developer switches to the feature branch worktree..."

  PHASE 3 — BOOST REGROUPS (3s)
    A brief flash/pulse on the pane borders (accent glow).
    Small status text appears at bottom of terminal:
      "[boost] regrouping panes by branch..."
    Then panes smoothly animate (CSS transform/transition) into grouped columns:
    ┌──────────────────────┬──────────────────────┐
    │  myapp/feature-login │     myapp/main       │
    ├──────────────────────┼──────────────────────┤
    │ ~/myapp-feature      │ ~/myapp (main) $     │
    │ -login (feature      ├──────────────────────┤
    │ -login) $            │ ~/myapp (main) $     │
    └──────────────────────┴──────────────────────┘
    Pane labels are now COLOR-CODED:
      - "myapp/feature-login" panes → cyan (#22D3EE)
      - "myapp/main" panes → green (#10B981)
    Caption: "Boost auto-groups panes by branch. Same branch = same column."

  PHASE 4 — HOLD & HIGHLIGHT (4s)
    Hold the grouped state.
    Briefly highlight each column with a subtle border glow
    (left column glows cyan, right column glows green).
    Caption: "Color-coded labels. Automatic layout. Zero manual work."

  PHASE 5 — RESET (fade out, 2s)
    Fade terminal to slightly dimmed state.
    Brief pause, then loop back to Phase 1 with a smooth crossfade.

Implementation notes:
  - Use CSS animations + JS for the typewriter effect.
  - Pane rearrangement should use CSS Grid or absolute positioning
    with smooth transitions (transform, width, height).
  - The terminal content is NOT a real terminal — it's styled divs
    with monospace text. This gives full control over animation.
  - Use Intersection Observer to only play when visible.
  - Respect prefers-reduced-motion: skip to final grouped state.
```

### Section 3: Features Grid

```
Layout:
  Section heading: "Tools That Compound" (gradient text)
  Subheading: "Each tool solves one friction point. Together, they multiply."
  3-column grid on desktop, 1-column on mobile.

Feature card design:
  Background: --bg-secondary
  Border: 1px solid --border-subtle, glows on hover
  Top: icon or small terminal-style illustration
  Title: monospace font, --text-primary
  Description: --text-secondary, 2-3 lines max

Cards:

  1. tmux-auto-adjust
     Icon: terminal window with columns
     Title: "tmux-auto-adjust"
     Description: "Auto-group tmux panes by git branch. Switch worktrees
      and panes rearrange into labeled, color-coded columns — automatically."
     Tag pill: "Available Now"

  2. [Placeholder — Future Tool]
     Icon: greyed-out / dashed border
     Title: "Coming Soon"
     Description: "More tools are on the way. Each one designed to remove
      one more piece of developer friction."
     Tag pill: "In Progress"

  3. [Placeholder — Future Tool]
     Icon: greyed-out / dashed border
     Title: "Coming Soon"
     Description: "Have an idea? Open an issue. Boost is open source and
      community-driven."
     Tag pill: "Contribute"
```

### Section 4: How It Works (for tmux-auto-adjust)

```
Layout:
  Three-step horizontal flow (vertical on mobile).
  Each step is a numbered card with a mini terminal illustration.

Steps:
  1.  "Work normally"
      "Open shells, cd between worktrees. Boost watches silently."
      Mini-terminal showing: ~/project (main) $

  2.  "Switch branches"
      "cd into another worktree. Boost detects the branch change."
      Mini-terminal showing: $ cd ../project-feature ↵

  3.  "Auto-regroup"
      "Panes reflow into branch columns. Labels and colors update."
      Mini-terminal showing grouped layout with colored labels.

Connecting line/arrow between steps with animated dash-offset on scroll.
```

### Section 5: Installation

```
Layout:
  Dark terminal-style code block, centered (max-width: 700px).
  Copy button on top-right of each block.

Content:
  Section heading: "Up and Running in 30 Seconds"

  Code block:
    git clone https://github.com/singhdevhub-lovepreet/boost.git
    cd boost/tmux-auto-adjust
    ./install.sh

  Below: three small instruction pills:
    "1. Add ~/.local/bin to PATH"
    "2. Source the shell hook"
    "3. Press prefix + g in tmux"
```

### Section 6: Footer

```
Layout:
  Minimal. --bg-primary with top border (--border-subtle).

Content:
  Left:   "Boost" logo/wordmark + "MIT License"
  Center: Links — GitHub · Documentation · Contribute
  Right:  "Built with frustration and shell scripts."
```

---

## 3. Animations & Interactions

### 3.1 Scroll Animations (use Intersection Observer)

```
- All sections fade-in + translate-up (20px) on enter, 600ms ease-out.
- Feature cards stagger by 100ms each.
- "How it works" steps animate sequentially as you scroll through them.
- Terminal animation only plays when Section 2 is in viewport.
```

### 3.2 Micro-interactions

```
- Buttons: scale(1.02) on hover, 150ms. Glow shadow intensifies.
- Feature cards: border-glow transitions from transparent to accent, 200ms.
- Code blocks: copy button shows "Copied!" tooltip for 2s after click.
- Links: underline slides in from left on hover (width transition).
- "100x" in hero: subtle continuous pulse (scale 1.0 → 1.02 → 1.0, 3s ease-in-out, infinite).
```

### 3.3 Cursor & Typewriter

```
- Blinking cursor: opacity 0/1, 530ms steps.
- Typewriter speed: 60ms per character, 40ms for fast sequences.
- After typing a command, 300ms pause before "pressing Enter."
- After Enter, 200ms pause, then output appears instantly (not typed).
```

---

## 4. Responsive Breakpoints

```
Desktop:    > 1024px   — full layout, 3-col grid, horizontal steps
Tablet:     768-1024px — 2-col grid, terminal slightly narrower
Mobile:     < 768px    — 1-col everything, terminal full-width,
                         hero text scales down, steps go vertical
```

---

## 5. Technical Requirements

```
Framework:      Next.js (App Router) or plain HTML/CSS/JS — developer's choice
Styling:        Tailwind CSS preferred, CSS custom properties for the design tokens
Fonts:          Google Fonts — Inter (400, 700, 800) + JetBrains Mono (400)
Animation lib:  Framer Motion (if React) or pure CSS + Intersection Observer
Hosting:        Vercel or GitHub Pages
Performance:    Lighthouse > 95 on all metrics. No heavy JS. Lazy-load below fold.
Accessibility:  prefers-reduced-motion support, proper heading hierarchy,
                sufficient contrast ratios (WCAG AA minimum), keyboard navigation.
```

---

## 6. Content Tone

```
Voice:        Direct, technical, no fluff. Speak developer-to-developer.
Avoid:        "Revolutionary", "game-changing", corporate jargon.
Prefer:       Short sentences. Concrete examples. Show, don't tell.
Humor:        Dry, understated. E.g., "Built with frustration and shell scripts."
```

---

## 7. Reference Aesthetic

```
Sites to draw inspiration from (layout/feel, not copy):
  - linear.app        (clean dark UI, smooth animations)
  - warp.dev          (terminal product, developer-focused)
  - vercel.com        (typography, gradient text, dark mode)
  - fig.io            (terminal animations, developer marketing)

The final result should feel like a blend of these — polished but not
over-designed. Every visual element should serve the message:
"This tool saves you time. Here's proof. Install it now."
```
