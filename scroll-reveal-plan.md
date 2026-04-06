# Scroll-Reveal Implementation Plan

## Goal

On initial page load, the dark hero + NavBar form a fixed overlay covering the bottom 50vh of the viewport. As the user scrolls down, the overlay slides downward (with a subtle fade at the tail end), revealing the full light section beneath. After the overlay clears, normal scroll resumes through the light content. The dark panel lives at the bottom of the page in normal flow.

---

## Behavior spec

- **scrollY 0 → innerHeight/2**: Dark overlay translates from `translateY(0)` to `translateY(50vh)`. Opacity stays at 1 until ~80% progress, then fades to 0 by 100%.
- **scrollY >= innerHeight/2**: Overlay is off-screen and invisible. Light content scrolls normally. Dark panel is accessible by continuing to scroll or via the "Music" nav link.
- **FloatingMenu FAB**: Always visible on mobile (no change). On desktop, hidden while the overlay is visible, shown once `introProgress >= 1`.
- **Clicking the overlay** (before it scrolls away): Should scroll to the dark panel at the bottom of the page.

---

## Files to change

### 1. `src/hooks/useSplitScroll.ts` — full rewrite

Replace entirely with the following logic:

```ts
import { useState, useEffect, useLayoutEffect } from 'react';

export function useSplitScroll() {
  const [introProgress, setIntroProgress] = useState(0);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setReady(true);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const threshold = window.innerHeight / 2;
      const progress = Math.min(window.scrollY / threshold, 1);
      setIntroProgress(progress);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navScrolledAway = introProgress >= 1;

  return { introProgress, navScrolledAway, ready };
}
```

**What is removed:** `ActiveSection` type, `SCROLL_DURATION_MS`, `activeSection` state, `setActiveSection`, `darkScrollTarget`, `overflow: hidden` body lock, all `useEffect` blocks that managed programmatic scrolling.

---

### 2. `src/components/SplitLayout.tsx` — full rewrite

Key structural changes:
- Dark hero + NavBar move into a single `div.darkOverlay` with `position: fixed`
- Light panel is always `min-height: 100vh` and always renders its content
- Dark panel renders at the bottom of the page in normal flow with `id="music"` so the Music nav link can scroll to it
- `introProgress` drives `translateY` and `opacity` on the overlay
- `navScrolledAway` is passed to `FloatingMenu`
- `expandLightThen` simplifies to just `scrollToId` (light content is always rendered)

```tsx
import { ReactNode, CSSProperties } from 'react';
import { useSplitScroll } from '../hooks/useSplitScroll';
import NavBar from './NavBar';
import MobileDivider from './MobileDivider';
import FloatingMenu from './FloatingMenu';
import styles from './SplitLayout.module.css';

interface SplitLayoutProps {
  lightHero: ReactNode;
  lightContent: ReactNode;
  darkHero: ReactNode;
  darkContent: ReactNode;
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function SplitLayout({ lightHero, lightContent, darkHero, darkContent }: SplitLayoutProps) {
  const { introProgress, navScrolledAway, ready } = useSplitScroll();

  // Overlay slides down and fades out at the tail
  const overlayTranslateY = introProgress * 100; // percent, relative to overlay's own height
  const overlayOpacity = introProgress < 0.8 ? 1 : 1 - (introProgress - 0.8) / 0.2;

  const overlayStyle: CSSProperties = {
    transform: `translateY(${overlayTranslateY}%)`,
    opacity: overlayOpacity,
    pointerEvents: introProgress >= 1 ? 'none' : 'auto',
  };

  return (
    <div style={{ visibility: ready ? 'visible' : 'hidden' }}>
      {/* Light panel — always full height, always rendered */}
      <div className={styles.lightPanel}>
        {lightHero}
        {lightContent}
      </div>

      {/* Dark overlay — fixed, covers bottom 50vh, animates away on scroll */}
      <div className={styles.darkOverlay} style={overlayStyle}>
        <NavBar
          onAboutClick={() => scrollToId('about')}
          onWorkClick={() => scrollToId('projects')}
          onMusicClick={() => scrollToId('music')}
          onContactClick={() => scrollToId('contact')}
        />
        <div
          className={styles.darkOverlayHero}
          onClick={() => scrollToId('music')}
          style={{ cursor: 'pointer', flex: 1 }}
        >
          {darkHero}
        </div>
      </div>

      {/* Mobile divider and floating menu */}
      <MobileDivider />
      <FloatingMenu
        navScrolledAway={navScrolledAway}
        onAboutClick={() => scrollToId('about')}
        onWorkClick={() => scrollToId('projects')}
        onMusicClick={() => scrollToId('music')}
        onContactClick={() => scrollToId('contact')}
      />

      {/* Dark panel — normal flow, at bottom of page */}
      <div id="music" className={styles.darkPanel}>
        {darkHero}
        {darkContent}
      </div>
    </div>
  );
}

export default SplitLayout;
```

**Note:** `expandLightThen` is removed entirely — it was only needed because light content was conditionally rendered. Now it's always rendered.

---

### 3. `src/components/SplitLayout.module.css` — update

Replace entirely:

```css
.lightPanel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #e5e0d8;
  color: #1a431f;
}

.darkOverlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50vh;
  display: flex;
  flex-direction: column;
  background-color: #1a431f;
  color: #e5e0d8;
  will-change: transform, opacity;
  z-index: 10;
}

.darkOverlayHero {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.darkPanel {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #1a431f;
  color: #e5e0d8;
}
```

---

### 4. `src/components/FloatingMenu.tsx` — add prop

Add `navScrolledAway: boolean` to the props interface and pass it as a class toggle on the FAB:

```tsx
export interface FloatingMenuProps {
  navScrolledAway: boolean;  // new
  onAboutClick: () => void;
  onWorkClick: () => void;
  onMusicClick: () => void;
  onContactClick: () => void;
}

function FloatingMenu({ navScrolledAway, onAboutClick, onWorkClick, onMusicClick, onContactClick }: FloatingMenuProps) {
  // ...existing state...

  return (
    <>
      {/* ...existing overlay/sheet JSX unchanged... */}
      <button
        className={`${styles.fab} ${navScrolledAway ? styles.fabVisible : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        <FontAwesomeIcon icon={open ? faXmark : faBars} />
      </button>
    </>
  );
}
```

---

### 5. `src/components/FloatingMenu.module.css` — add modifier

Add one rule after the existing `.fab` block:

```css
.fabVisible {
  display: flex !important;
}
```

This overrides the `display: none` default on desktop when the navbar has scrolled away.

---

### 6. `src/components/NavBar.module.css` — remove conflicting positioning

The NavBar now lives inside the fixed overlay div (which handles its own stacking context). Remove `position: relative`, `z-index`, and `overflow: visible` from `.nav` if they conflict. The background, color, and responsive `display: none` are all fine to keep.

Review the current file and remove only properties that would conflict with the parent overlay's stacking context. The `.profileCircleWrapper` absolute positioning is still valid (positioned relative to the navbar itself).

---

## What is NOT changing

- `NavBar.tsx` JSX — no changes needed
- `MobileDivider.tsx` — no changes
- All `src/data/` files — no changes
- `App.tsx` — no changes (props passed to SplitLayout stay the same, except note that `darkContent` should be something meaningful or a placeholder; the dark panel is now always rendered)
- The `id` attributes on existing sections (`about`, `projects`, `contact`) — verify these exist in the light content components

---

## Things to verify after implementing

1. `id="about"`, `id="projects"`, `id="contact"` exist in the rendered light content (check `AboutSection.tsx` and `ProjectsSection.tsx`)
2. The dark panel (`id="music"`) renders correctly at the bottom with both `darkHero` and `darkContent` — currently `darkContent` in `App.tsx` may be empty/null; that's fine, it just renders the hero
3. On mobile: the dark overlay is still 50vh and covers the bottom half — test that the FAB (always visible on mobile) still works correctly while the overlay is present
4. Scroll the page fully down to `#music` and confirm the dark panel looks correct at full `min-height: 100vh`
5. Confirm `pointerEvents: none` on the overlay once `introProgress >= 1` so the user can't accidentally click through to the dark panel trigger

---

## Branch

Work on branch `UI-UX-feedback-rework` (already active).
