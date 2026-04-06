# Portfolio Site Implementation Plan

## Quick Overview

Three interconnected changes:
1. **Scroll-reveal**: Dark overlay animates away as user scrolls, revealing light panel
2. **Project card refactor**: Show brief description + skills by default; full description in modal
3. **Section extraction**: Pull Skills, Education, Tech Writing, Recommendations out of AboutSection; reorder flow

**Branch:** `UI-UX-feedback-rework`

---

## Master Changes Summary

| File | Action | Priority |
|------|--------|----------|
| `src/hooks/useSplitScroll.ts` | Full rewrite | 1 |
| `src/components/SplitLayout.tsx` | Full rewrite | 1 |
| `src/components/SplitLayout.module.css` | Replace entirely | 1 |
| `src/components/FloatingMenu.tsx` | Add `navScrolledAway` prop | 1 |
| `src/components/FloatingMenu.module.css` | Add `.fabVisible` rule | 1 |
| `src/components/NavBar.module.css` | Remove conflicting positioning | 1 |
| `src/components/AboutSection.tsx` | Keep only bio prose | 2 |
| `src/components/AboutSection.module.css` | Trim to bio-only styles | 2 |
| `src/components/SkillsSection.tsx` | Create new wrapper | 2 |
| `src/components/SkillsSection.module.css` | Create new | 2 |
| `src/components/EducationSection.tsx` | Create new wrapper | 2 |
| `src/components/EducationSection.module.css` | Create new | 2 |
| `src/components/TechWritingSection.tsx` | Create new wrapper | 2 |
| `src/components/TechWritingSection.module.css` | Create new | 2 |
| `src/components/RecommendationsSection.tsx` | Refactor as standalone section | 2 |
| `src/components/RecommendationsSection.module.css` | Create new | 2 |
| `src/components/ProjectsSection.tsx` | Refactor ProjectCard with modal | 3 |
| `src/components/ProjectsSection.module.css` | Add modal styles | 3 |
| `src/types/project.ts` | Add `briefDescription` field | 3 |
| `src/data/projects-light.json` | Add `briefDescription` to all 7 projects | 3 |
| `src/App.tsx` | Update imports & reorder `lightContent` | All |

---

## Navigation IDs Reference

These section IDs are used for nav links and scroll-to behavior:
- `about` — AboutSection (bio prose)
- `projects` — ProjectsSection (portfolio grid)
- `skills` — SkillsSection
- `education` — EducationSection
- `technical-writing` — TechWritingSection
- `recommendations` — RecommendationsSection
- `contact` — ContactSection
- `music` — Dark panel (bottom of page)

NavBar/FloatingMenu nav links point to: `about`, `projects`, `contact`, `music`. No changes needed to those link handlers.

---

## Implementation Details by File

### Priority 1: Scroll-Reveal Architecture

#### `src/hooks/useSplitScroll.ts` — Full rewrite

**Replace the entire file with:**

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

**Removed:** `ActiveSection` type, `SCROLL_DURATION_MS`, `activeSection` state, `setActiveSection`, `darkScrollTarget`, `overflow: hidden` body lock, all programmatic scroll effects.

---

#### `src/components/SplitLayout.tsx` — Full rewrite

**Replace the entire file with:**

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

  // Dark overlay slides down and fades at tail end (80%-100%)
  const overlayTranslateY = introProgress * 100;
  const overlayOpacity = introProgress < 0.8 ? 1 : 1 - (introProgress - 0.8) / 0.2;

  const overlayStyle: CSSProperties = {
    transform: `translateY(${overlayTranslateY}%)`,
    opacity: overlayOpacity,
    pointerEvents: introProgress >= 1 ? 'none' : 'auto',
  };

  return (
    <div style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div className={styles.lightPanel}>
        {lightHero}
        {lightContent}
      </div>

      <div className={styles.darkOverlay} style={overlayStyle}>
        <NavBar
          onAboutClick={() => scrollToId('about')}
          onWorkClick={() => scrollToId('projects')}
          onMusicClick={() => scrollToId('music')}
          onContactClick={() => scrollToId('contact')}
        />
        <div className={styles.darkOverlayHero} onClick={() => scrollToId('music')} style={{ cursor: 'pointer', flex: 1 }}>
          {darkHero}
        </div>
      </div>

      <MobileDivider />
      <FloatingMenu
        navScrolledAway={navScrolledAway}
        onAboutClick={() => scrollToId('about')}
        onWorkClick={() => scrollToId('projects')}
        onMusicClick={() => scrollToId('music')}
        onContactClick={() => scrollToId('contact')}
      />

      <div id="music" className={styles.darkPanel}>
        {darkHero}
        {darkContent}
      </div>
    </div>
  );
}

export default SplitLayout;
```

---

#### `src/components/SplitLayout.module.css` — Replace entirely

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

#### `src/components/FloatingMenu.tsx` — Add prop

**Change:**
- Add `navScrolledAway: boolean` to `FloatingMenuProps`
- Apply class toggle to FAB: `className={`${styles.fab} ${navScrolledAway ? styles.fabVisible : ''}`}`

---

#### `src/components/FloatingMenu.module.css` — Add rule

```css
.fabVisible {
  display: flex !important;
}
```

Append after the existing `.fab` block. This overrides the media query `display: none` on desktop when navbar scrolls away.

---

#### `src/components/NavBar.module.css` — Clean up

**Remove:** `position: relative`, `z-index`, `overflow: visible` from `.nav` rule if they conflict with the fixed overlay parent. The `.profileCircleWrapper` absolute positioning is still valid (positioned relative to navbar).

---

### Priority 2: Section Extraction & Reordering

#### `src/components/AboutSection.tsx` — Bio prose only

**Replace with:**

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

**Remove imports:** `SkillsGrid`, `EducationBlock`, `RecommendationsSection`, `technicalWriting` data.

---

#### `src/components/AboutSection.module.css` — Trim

**Replace with:**

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

#### `src/components/SkillsSection.tsx` — New wrapper

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

---

#### `src/components/SkillsSection.module.css` — New

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}
```

---

#### `src/components/EducationSection.tsx` — New wrapper

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

---

#### `src/components/EducationSection.module.css` — New

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}
```

---

#### `src/components/TechWritingSection.tsx` — New

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

---

#### `src/components/TechWritingSection.module.css` — New

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

#### `src/components/RecommendationsSection.tsx` — Refactor existing

**Replace with:**

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

---

#### `src/components/RecommendationsSection.module.css` — New

```css
.section {
  background-color: #e5e0d8;
  color: #1a431f;
}
```

---

### Priority 3: Project Card Refactor

#### `src/types/project.ts` — Add field

**Change:** Add `briefDescription: string` field before `description`.

```ts
export interface Project {
  title: string;
  briefDescription: string;          // new: 1-2 sentences for card
  description: string;               // full description for modal
  thumbnail: string;
  company?: string;
  years?: string;
  skills?: string[];
  externalLink?: string;
}
```

---

#### `src/data/projects-light.json` — Add brief descriptions

Add `briefDescription` field to all 7 projects. Use these summaries:

1. **VR Training Platform SDK**: "Owned reusable components and core infrastructure for thousands of VR training simulations. Delivered 80% reduction in app-launch time and a visual scripting tool for designers."

2. **Asset Bundle Management System**: "Built an end-to-end content delivery system from scratch that discovered and enabled a 90% reduction in patch sizes through intelligent asset grouping."

3. **Synthetic Training Data for Computer Vision**: "Generated 20,000–50,000 labeled synthetic images per scene for ML model training, including real-time robotics sensor simulation with compute shader visualization."

4. **YVR Vancouver International Airport Digital Twin**: "Built real-time UI systems and optimized performance for an international airport digital twin, collaborating with domain experts across the project lifecycle."

5. **Thunder**: "A Blackfoot language learning VR experience for Oculus Go that premiered at Vancouver and Nashville International Film Festivals in 2019."

6. **AR Assistant for Retail (HoloLens)**: "Designed spatial UI on HoloLens with custom editor tools for designers, solving resource-constrained 3D interaction challenges with linear algebra and calculus."

7. **PASS VR Fire Extinguisher Training**: "Optimized a desktop fire extinguisher training experience for mobile VR on Oculus Go using particle system and pooling techniques for performance-constrained hardware."

---

#### `src/components/ProjectsSection.tsx` — Refactor ProjectCard

**Replace the ProjectCard component entirely with:**

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
            <p className="card-text small flex-grow-1">{project.briefDescription}</p>
            {project.skills && project.skills.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {project.skills.map((skill) => (
                  <span key={skill} className="badge rounded-pill" style={{ fontSize: '0.7rem', background: '#bf9b30', color: '#081c09' }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setShowModal(false)}>✕</button>
            <img src={project.thumbnail} alt={project.title} className={styles.modalImage} />
            <div className={styles.modalBody}>
              {(project.company || project.years) && (
                <p className={styles.modalSubtitle}>{[project.company, project.years].filter(Boolean).join(' · ')}</p>
              )}
              <h3>{project.title}</h3>
              <p className={styles.modalDescription}>{project.description}</p>
              {project.externalLink && (
                <a href={project.externalLink} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  View external link
                </a>
              )}
              {project.skills && project.skills.length > 0 && (
                <div className="d-flex flex-wrap gap-1 mt-3">
                  {project.skills.map((skill) => (
                    <span key={skill} className="badge rounded-pill" style={{ fontSize: '0.75rem', background: '#bf9b30', color: '#081c09' }}>
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

// ProjectsSection component unchanged
interface ProjectsSectionProps {
  projects: Project[];
}

function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className={`py-5 ${styles.section}`}>
      <div className="container">
        <h2>Work</h2>
        <div className="row">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;
```

---

#### `src/components/ProjectsSection.module.css` — Add modal styles

**Append to the end:**

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

### App.tsx — Update imports & reorder

**Update to:**

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
      darkContent={<Footer />}
    />
  );
}

export default App;
```

---

## Testing & Verification

### Scroll-Reveal (Priority 1)
- [ ] Page loads with dark overlay visible at bottom 50vh
- [ ] Scrolling down causes overlay to slide down (not follow scroll normally)
- [ ] Overlay fades out during final 20% of intro phase
- [ ] After scrollY ≥ innerHeight/2, dark overlay is fully off-screen
- [ ] On mobile: FAB remains visible throughout intro phase
- [ ] On desktop: FAB appears once overlay is gone (`navScrolledAway === true`)
- [ ] Clicking overlay during intro scrolls to `#music` (dark panel at bottom)

### Section Extraction (Priority 2)
- [ ] About section shows only bio prose (no subsections)
- [ ] Projects appear immediately after About
- [ ] Skills, Education, Technical Writing, Recommendations each render as independent sections
- [ ] Each section has proper spacing (`py-5`) and styling
- [ ] Skills Grid displays correctly
- [ ] Education Block displays correctly
- [ ] Technical Writing links work (both linked and non-linked entries)
- [ ] Recommendations carousel functions (scrolling, nav buttons)
- [ ] All section IDs exist and nav links work: `about`, `projects`, `skills`, `education`, `technical-writing`, `recommendations`, `contact`

### Project Card Refactor (Priority 3)
- [ ] Project cards show brief description (not full description)
- [ ] Skill badges display on cards
- [ ] Clicking a card opens modal
- [ ] Modal shows full description, company, years, skills, external link
- [ ] Clicking outside modal closes it
- [ ] Clicking × button closes modal
- [ ] Modal scrolls if content > 85vh (test with longer descriptions)
- [ ] Mobile: modal uses 90vw/90vh max sizes
- [ ] All 7 projects have `briefDescription` field in JSON

---

## Notes

- Data files (`skills.ts`, `education.ts`, `technical-writing.ts`, `recommendations.json`) remain unchanged
- Existing child components (SkillsGrid, EducationBlock, Carousel, RecommendationCard) are untouched
- No changes to `NavBar.tsx`, `MobileDivider.tsx`, or `ContactSection.tsx`
