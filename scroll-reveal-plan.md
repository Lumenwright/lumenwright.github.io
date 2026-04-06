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

---

---

# ADDENDUM: Project Card Refactor + Reordering

## Goal

1. **Reorder sections**: Move Projects to appear immediately after About (light panel flow: Hero → About → Projects → Contact → Footer)
2. **Refactor ProjectCard**: Show brief Netflix-style description + skill tags by default. Full description displays in a modal overlay when clicked.
3. **Add brief descriptions**: Each project gets a concise 1-2 sentence `briefDescription` field that captures the project's essence and core achievement.

---

## Part 1: Reorder sections in light content

**File: `src/App.tsx`**

Change the `lightContent` JSX to:
```tsx
lightContent={
  <>
    <HeroSection title="ROSE CHUNG" subtitle="Senior Unity/C# Developer · 8 years in real-time 3D" />
    <AboutSection />
    <ProjectsSection projects={lightProjects} />
    <ContactSection />
    <Footer />
  </>
}
```

Note: Move the `HeroSection` import inside `App()` if it isn't already, or just keep it inline as shown. Actually, looking at the current App.tsx, `HeroSection` is passed to `SplitLayout` separately. So this change just reorders the lightContent JSX, which is already correct in the current file — **no changes needed to App.tsx**, the order is already right. ✓

---

## Part 2: Update Project type to support brief description + full description

**File: `src/types/project.ts`**

Replace with:
```ts
export interface Project {
  title: string;
  briefDescription: string;          // new: 1-2 sentences for card view
  description: string;               // full description for modal
  thumbnail: string;
  company?: string;
  years?: string;
  skills?: string[];
  externalLink?: string;
}
```

---

## Part 3: Update projects data with brief descriptions

**File: `src/data/projects-light.json`**

Add `briefDescription` to each project. See the list below — copy the brief descriptions into the appropriate projects:

```json
[
  {
    "title": "VR Training Platform SDK",
    "briefDescription": "Owned reusable components and core infrastructure for thousands of VR training simulations. Delivered 80% reduction in app-launch time and a visual scripting tool for designers.",
    "company": "Transfr Inc.",
    "years": "2023–2026",
    "skills": ["Unity", "C#", "Oculus Quest", "Pico", "WebGL", "REST API", "Azure DevOps"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/TransfrCoastalBend-hero.webp"
  },
  {
    "title": "Asset Bundle Management System",
    "briefDescription": "Built an end-to-end content delivery system from scratch that discovered and enabled a 90% reduction in patch sizes through intelligent asset grouping.",
    "company": "Transfr Inc.",
    "years": "2023–2026",
    "skills": ["Unity", "C#", "Unity Addressables", "Asynchronous programming", "Oculus Quest", "Pico"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/TransfrCoastalBend-hero.webp"
  },
  {
    "title": "Synthetic Training Data for Computer Vision",
    "briefDescription": "Generated 20,000–50,000 labeled synthetic images per scene for ML model training, including real-time robotics sensor simulation with compute shader visualization.",
    "company": "Unity Technologies",
    "years": "2022–2023",
    "skills": ["Unity Perception", "C#", "HLSL", "Computer Vision", "Machine Learning", "WebSocket"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/Unity_2021.svg"
  },
  {
    "title": "YVR Vancouver International Airport Digital Twin",
    "briefDescription": "Built real-time UI systems and optimized performance for an international airport digital twin, collaborating with domain experts across the project lifecycle.",
    "company": "Unity Technologies",
    "years": "2020–2023",
    "skills": ["Unity", "C#", "AR", "VR", "UI Systems", "Rendering", "Performance Optimization"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/Unity_2021.svg",
    "externalLink": "https://youtu.be/1rWNu1zqC5k?t=112"
  },
  {
    "title": "Thunder",
    "briefDescription": "A Blackfoot language learning VR experience for Oculus Go that premiered at Vancouver and Nashville International Film Festivals in 2019.",
    "company": "Mammoth XR",
    "years": "2019",
    "skills": ["Unity", "C#", "Oculus Go", "Oculus SDK", "Ableton"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/Thunder-Postcard.jpg"
  },
  {
    "title": "AR Assistant for Retail (HoloLens)",
    "briefDescription": "Designed spatial UI on HoloLens with custom editor tools for designers, solving resource-constrained 3D interaction challenges with linear algebra and calculus.",
    "company": "Finger Food / Unity",
    "years": "2019–2021",
    "skills": ["Unity", "C#", "AR", "HoloLens", "MRTK", "Jenkins"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/fingerfood-atg-logo.png"
  },
  {
    "title": "PASS VR Fire Extinguisher Training",
    "briefDescription": "Optimized a desktop fire extinguisher training experience for mobile VR on Oculus Go using particle system and pooling techniques for performance-constrained hardware.",
    "company": "Mammoth XR",
    "years": "2018",
    "skills": ["Unreal Engine 4", "VR", "Oculus Go", "Mobile Optimization"],
    "description": "[... keep the full description as-is ...]",
    "thumbnail": "/thumbnails/PASS-VR.png"
  }
]
```

---

## Part 4: Refactor ProjectCard component

**File: `src/components/ProjectsSection.tsx`**

Replace the `ProjectCard` component with:

```tsx
import { useState } from 'react';
import { Project } from '../types/project';
import styles from './ProjectsSection.module.css';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="col-md-4 mb-4">
        <div className={`card h-100 ${styles.card}`} onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }}>
          <img src={project.thumbnail} alt={project.title} className="card-img-top" />
          <div className="card-body d-flex flex-column">
            {(project.company || project.years) && (
              <p className={`card-subtitle mb-1 ${styles.subtitle}`} style={{ fontSize: '0.8rem' }}>
                {[project.company, project.years].filter(Boolean).join(' · ')}
              </p>
            )}
            <h5 className="card-title">{project.title}</h5>
            {/* Brief description — always shown */}
            <p className="card-text small flex-grow-1">{project.briefDescription}</p>
            {/* Skills tags */}
            {project.skills && project.skills.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge rounded-pill"
                    style={{ fontSize: '0.7rem', background: '#bf9b30', color: '#081c09' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal overlay for full description */}
      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>
              ✕
            </button>
            <img src={project.thumbnail} alt={project.title} className={styles.modalImage} />
            <div className={styles.modalBody}>
              {(project.company || project.years) && (
                <p className={styles.modalSubtitle}>
                  {[project.company, project.years].filter(Boolean).join(' · ')}
                </p>
              )}
              <h3>{project.title}</h3>
              <p className={styles.modalDescription}>{project.description}</p>
              {project.externalLink && (
                <a
                  href={project.externalLink}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View external link
                </a>
              )}
              {project.skills && project.skills.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mt-3">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="badge rounded-pill"
                      style={{ fontSize: '0.75rem', background: '#bf9b30', color: '#081c09' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

No changes needed to `ProjectsSection` component itself.

---

## Part 5: Add CSS for modal overlay

**File: `src/components/ProjectsSection.module.css`**

Add the following CSS at the end:

```css
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modalContent {
  position: relative;
  background: #e5e0d8;
  color: #1a431f;
  border-radius: 0.5rem;
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modalClose {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #1a431f;
  z-index: 1001;
}

.modalImage {
  width: 100%;
  display: block;
  border-radius: 0.5rem 0.5rem 0 0;
}

.modalBody {
  padding: 2rem;
}

.modalSubtitle {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.modalDescription {
  margin: 1rem 0;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .modalContent {
    max-width: 90vw;
    max-height: 90vh;
  }

  .modalBody {
    padding: 1.5rem;
  }
}
```

---

## What is removed / changed

- ProjectCard no longer displays full `description` by default — only the brief description
- Full description is now modal-only, triggered by clicking the card
- No changes to `ProjectsSection` logic
- `externalLink` button moves into the modal (was in the card, now only in modal)

---

## What stays the same

- Project data structure for company, years, skills, thumbnail, externalLink
- `ProjectsSection` component (wraps ProjectCard)
- Section ID `id="projects"` (used for navigation)
- Grid layout and styling (card is still `col-md-4`)

---

## Implementation notes

- The modal is simple and inline — no separate modal component created (follows "don't over-abstract" guideline)
- Modal content fits up to 600px wide on desktop, responsive on mobile
- Close button is an × symbol (U+2717), clickable and keyboard-accessible would require adding an `onKeyDown` handler if desired (optional)
- Clicking outside the modal closes it (overlay click handler)
- The brief description uses the `.small` Bootstrap class for slightly smaller font

---

## Testing checklist after implementation

1. ✓ Click a project card — modal opens with full description
2. ✓ Click outside the modal — it closes
3. ✓ Click the × button — modal closes
4. ✓ Skills badges display in both card view and modal view
5. ✓ External links work in modal (if project has one)
6. ✓ Card text is truncated properly with flex layout (`flex-grow-1` on brief desc pushes skills to bottom)
7. ✓ Modal scrolls if content is taller than 85vh
8. ✓ Mobile responsive: modal uses 90vw and 90vh max sizes

---

---

# ADDENDUM 2: Extract sections from AboutSection + Reorder

## Goal

1. Extract Skills, Education, Technical Writing, and Recommendations out of `AboutSection`
2. Make each an independent component at the same level as AboutSection
3. Reorder light content so the new flow is: About → Projects → Skills → Education → Technical Writing → Recommendations → Contact → Footer

---

## Overview: What already exists vs what needs creating

The following components already exist and just need to be promoted to top-level sections:
- `SkillsGrid.tsx` — renders the skills tags grid (already in AboutSection)
- `EducationBlock.tsx` — renders education entries (already in AboutSection)
- `RecommendationsSection.tsx` — renders the carousel with heading and LinkedIn link (already exists, just not in AboutSection)

What needs to be created:
- `SkillsSection.tsx` — wrapper around SkillsGrid with section styling
- `EducationSection.tsx` — wrapper around EducationBlock with section styling
- `TechWritingSection.tsx` — new component (Technical Writing wasn't extracted yet)

---

## Part 1: Refactor AboutSection to contain only bio prose

**File: `src/components/AboutSection.tsx`**

Replace entirely with:

```tsx
import { parseInlineBold } from '../utils/parseInlineBold';
import { aboutProse } from '../data/about';
import styles from './AboutSection.module.css';

function AboutSection() {
  return (
    <section id="about" className="py-5">
      <div className="container">
        <h2>Who am I?</h2>
        <ul className={styles.list}>
          {aboutProse.map((b) => (
            <p key={b}>{parseInlineBold(b)}</p>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AboutSection;
```

Remove imports for: `SkillsGrid`, `EducationBlock`, `RecommendationsSection`, `technicalWriting`, `styles.techWritingList`, `styles.techWritingEntry`, `styles.techWritingTitle`, `styles.techWritingDescription`

---

## Part 2: Create SkillsSection component

**File: `src/components/SkillsSection.tsx`** (new file)

```tsx
import SkillsGrid from './SkillsGrid';
import styles from './SkillsSection.module.css';

function SkillsSection() {
  return (
    <section id="skills" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Skills</h2>
        <SkillsGrid />
      </div>
    </section>
  );
}

export default SkillsSection;
```

**File: `src/components/SkillsSection.module.css`** (new file)

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}
```

---

## Part 3: Create EducationSection component

**File: `src/components/EducationSection.tsx`** (new file)

```tsx
import EducationBlock from './EducationBlock';
import styles from './EducationSection.module.css';

function EducationSection() {
  return (
    <section id="education" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Education</h2>
        <EducationBlock />
      </div>
    </section>
  );
}

export default EducationSection;
```

**File: `src/components/EducationSection.module.css`** (new file)

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}
```

---

## Part 4: Create TechWritingSection component

**File: `src/components/TechWritingSection.tsx`** (new file)

```tsx
import technicalWriting from '../data/technical-writing';
import styles from './TechWritingSection.module.css';

function TechWritingSection() {
  return (
    <section id="technical-writing" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Technical Writing</h2>
        <div className={styles.techWritingList}>
          {technicalWriting.map((entry) => (
            <div key={entry.title} className={styles.techWritingEntry}>
              {entry.url
                ? <a href={entry.url} className={styles.techWritingTitle}>{entry.title}</a>
                : <span className={styles.techWritingTitle}>{entry.title}</span>
              }
              <p className={styles.techWritingDescription}>{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechWritingSection;
```

**File: `src/components/TechWritingSection.module.css`** (new file)

Copy the relevant styles from the old `AboutSection.module.css`:

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}

.techWritingList {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.techWritingEntry {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.techWritingTitle {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1a431f;
  text-decoration: none;
}

.techWritingTitle:hover {
  text-decoration: underline;
}

.techWritingDescription {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
```

---

## Part 5: Create RecommendationsSection component

**File: `src/components/RecommendationsSection.tsx`** (new file)

Replace the existing `RecommendationsSection.tsx` with a wrapper that just renders the carousel:

```tsx
import Carousel from './Carousel';
import RecommendationCard from './RecommendationCard';
import recommendations from '../data/recommendations.json';
import styles from './RecommendationsSection.module.css';

function RecommendationsSection() {
  return (
    <section id="recommendations" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Recommendations</h2>
        <Carousel>
          {recommendations.map((rec) => (
            <RecommendationCard key={rec.name} recommendation={rec} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

export default RecommendationsSection;
```

**File: `src/components/RecommendationsSection.module.css`** (new file)

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}
```

---

## Part 6: Update AboutSection.module.css

**File: `src/components/AboutSection.module.css`**

Remove any tech writing related styles. Keep only:

```css
.list {
  list-style: none;
  padding: 0;
}

.list p {
  margin-bottom: 1rem;
  line-height: 1.6;
}
```

---

## Part 7: Update App.tsx with new component imports and reordered lightContent

**File: `src/App.tsx`**

Update imports and lightContent:

```tsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SplitLayout from './components/SplitLayout';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import EducationSection from './components/EducationSection';
import TechWritingSection from './components/TechWritingSection';
import RecommendationsSection from './components/RecommendationsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import lightProjects from './data/projects-light.json';

function App() {
  return (
    <SplitLayout
      lightHero={<HeroSection title="ROSE CHUNG" subtitle="Senior Unity/C# Developer · 8 years in real-time 3D" />}
      lightContent={
        <>
          <AboutSection />
          <ProjectsSection projects={lightProjects} />
          <SkillsSection />
          <EducationSection />
          <TechWritingSection />
          <RecommendationsSection />
          <ContactSection />
          <Footer />
        </>
      }
      darkHero={<HeroSection title="LUMENWRIGHT" subtitle="Music producer and Twitch DJ · 'The Oath' out now on FSOE" />}
      darkContent={
        <>
          <Footer />
        </>
      }
    />
  );
}

export default App;
```

---

## Section IDs for navigation

The new section IDs are:
- `about` — AboutSection (bio prose only)
- `projects` — ProjectsSection (portfolio)
- `skills` — SkillsSection
- `education` — EducationSection
- `technical-writing` — TechWritingSection
- `recommendations` — RecommendationsSection
- `contact` — ContactSection

Update nav links in `NavBar.tsx` and `FloatingMenu.tsx` if needed to point to the correct section IDs. Currently they point to `about`, `projects`, and `contact`, which still exist and are in the right place.

---

## What is removed

- Skills, Education, Technical Writing subsections from `AboutSection.tsx`
- Related styles from `AboutSection.module.css`
- Duplicated imports in `AboutSection` (SkillsGrid, EducationBlock, technicalWriting data, RecommendationsSection)

---

## What stays the same

- All data files remain unchanged (`skills.ts`, `education.ts`, `technical-writing.ts`, `recommendations.json`)
- Component logic remains the same (SkillsGrid, EducationBlock, Carousel, RecommendationCard unchanged)
- Section styling — each new section has its own `.module.css` for encapsulation
- Nav behavior — existing nav links still work (About, Work, Contact are still accessible)

---

## Files created (new)

1. `src/components/SkillsSection.tsx` + `.module.css`
2. `src/components/EducationSection.tsx` + `.module.css`
3. `src/components/TechWritingSection.tsx` + `.module.css`
4. `src/components/RecommendationsSection.tsx` (replaces existing if it only wraps the carousel) + `.module.css`

---

## Files modified

1. `src/components/AboutSection.tsx` — remove everything except bio prose
2. `src/components/AboutSection.module.css` — trim to only bio styles
3. `src/App.tsx` — new imports, reordered lightContent

---

## Testing checklist

1. ✓ About section displays only bio prose (no subsections)
2. ✓ Projects section appears immediately after About
3. ✓ Skills, Education, Technical Writing, Recommendations each appear in their own sections below Projects
4. ✓ Each section has proper spacing/styling
5. ✓ Navigation links still work (About, Work, Contact)
6. ✓ Carousel in Recommendations section functions correctly
7. ✓ Mobile responsive — sections stack properly
