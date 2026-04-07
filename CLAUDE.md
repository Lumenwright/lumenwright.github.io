# Portfolio Site — AI Assistant Guide

This is Rose Chung's personal portfolio site. It is a React TypeScript SPA deployed to GitHub Pages at https://lumenwright.github.io. This guide covers everything an AI assistant needs to add content, move components, or refactor the site.

---

## Quick orientation

The site has two panels — **light** (engineering portfolio) and **dark** (music/LUMENWRIGHT). Only one is fully expanded at a time. Clicking the collapsed panel expands it. The dark panel is intentionally minimal for now; it may become a separate external link or be built out later.

**Build & deploy:**
```bash
npm start          # dev server at localhost:3000
npm run build      # production bundle
npm run deploy     # build + push to GitHub Pages (main branch)
```

---

## File structure

```
src/
  components/      # React components + co-located *.module.css
  data/            # All editable content lives here
  types/           # TypeScript interfaces
  hooks/           # useSplitScroll (split-panel behavior)
  utils/           # parseInlineBold (renders **bold** in prose)
  App.tsx          # Root — wires SplitLayout with content
```

---

## How to add or edit content

All content is data-driven. Edit the file in `src/data/` — the component picks it up automatically via `.map()`. Do not hardcode content inside components.

### About bio prose
**File:** `src/data/about.ts` — edit the `aboutProse` string array.
- Supports `**bold**` inline formatting (rendered by `parseInlineBold`).
- Each string becomes its own paragraph.

### Skills
**File:** `src/data/skills.ts` — edit the `SkillCategory[]` array.
- Each object has `category: string` and `skills: string[]`.
- Order in the array controls display order.

### Education
**File:** `src/data/education.ts` — edit the `EducationEntry[]` array.
- Fields: `institution`, `degree`, `years`, `description`.

### Technical writing / publications
**File:** `src/data/technical-writing.ts` — edit the `TechWritingEntry[]` array.
- Fields: `title`, `description`, and optional `url`.
- If `url` is present, the title renders as a link.

### Projects (engineering)
**File:** `src/data/projects-light.json` — add/edit entries.
- Schema: `src/data/projects.schema.json`
- Fields: `title`, `description`, `thumbnail`, `company?`, `years?`, `skills?[]`, `externalLink?`
- Thumbnails: place image files in `public/thumbnails/` and reference as `"/thumbnails/filename.jpg"`.

### Recommendations
**File:** `src/data/recommendations.json` — add/edit entries.
- Schema: `src/data/recommendations.schema.json`
- Fields: `name`, `tagline`, `date`, `workedWith`, `review`.
- Renders in a horizontally scrollable carousel with expand/collapse for long reviews.

---

## How navigation works

There is no router. Navigation is anchor-based with smooth scroll:

- `NavBar` and `FloatingMenu` (mobile hamburger) each have click handlers passed in from `SplitLayout`.
- `expandLightThen(id)` in `SplitLayout.tsx` expands the light panel if collapsed, then scrolls to a section ID.
- Section IDs in use: `about`, `projects`, `contact`.
- Adding a new section: give it an `id` attribute in JSX, then add a nav item in both `NavBar.tsx` and `FloatingMenu.tsx` with a corresponding `expandLightThen('your-id')` call.

---

## How the split layout works

`SplitLayout` (`src/components/SplitLayout.tsx`) receives four props:
- `lightHero` / `darkHero` — always visible (shown even when panel is collapsed).
- `lightContent` / `darkContent` — only rendered when that panel is active.

`useSplitScroll` (`src/hooks/useSplitScroll.ts`) manages the `activeSection` state. Panels are `50vh` collapsed, `100vh` expanded.

**To add content to the light panel:** edit the `lightContent` block in `App.tsx`.
**To add content to the dark panel:** edit the `darkContent` block in `App.tsx`.

---

## Styling

- **CSS Modules**: each component has a co-located `*.module.css`. Import as `import styles from './Component.module.css'` and apply as `className={styles.className}`.
- **Bootstrap 5**: available globally (imported in `App.tsx`). Use Bootstrap grid and utility classes freely.
- **Inline styles**: acceptable for one-off dynamic values; avoid for anything that might be reused.
- **Color palette:**
  - Cream: `#e5e0d8`
  - Dark green: `#1a431f`
  - Gold accent: `#bf9b30`

Light panel uses dark green text on cream background; dark panel is the inverse.

---

## Resume PDF

The resume is served from `public/resume.pdf` and linked in `NavBar.tsx`.
- To update: replace `public/resume.pdf` with the new file (keep the same filename — no code changes needed).
- The NavBar link uses `download` attribute so it triggers a download rather than opening in-browser.

---

## The dark panel (LUMENWRIGHT / music side)

Currently shows only a hero and footer. `src/data/projects-dark.json` has placeholder data but is not imported anywhere. The intended direction is either:
1. Build it out as a music projects section (import and render `projects-dark.json`), or
2. Replace the hero click with a link to an external site.

Do not build out the dark panel without confirming with the owner first.

---

## Component reference

| Component | Purpose | Key props / notes |
|-----------|---------|-------------------|
| `SplitLayout` | Main layout, manages panel state | `lightHero`, `lightContent`, `darkHero`, `darkContent` |
| `NavBar` | Desktop navigation bar | Fixed in dark panel; Resume is an external download link |
| `FloatingMenu` | Mobile hamburger menu | Overlay sheet, mirrors NavBar actions |
| `HeroSection` | Title + subtitle display | Used in both panels |
| `AboutSection` | Bio, skills, education, writing, recommendations | Reads from `src/data/` |
| `ProjectsSection` | Portfolio grid | Accepts `projects: Project[]` prop |
| `ProjectCard` | Individual project tile | Rendered by ProjectsSection |
| `RecommendationsSection` | Carousel wrapper | Reads `recommendations.json` |
| `Carousel` | Horizontal scroll with nav buttons | Disables buttons at scroll boundaries |
| `RecommendationCard` | Single recommendation | Expand/collapse for long text |
| `SkillsGrid` | Skills by category | Reads `skills.ts` |
| `EducationBlock` | Education entries | Reads `education.ts` |
| `ContactSection` | Email + LinkedIn links | Static content in component |
| `Footer` | GitHub link | Used in both panels |
| `ProfileCircle` | Profile photo | Used in NavBar and MobileDivider |
| `MobileDivider` | Visual divider between panels on mobile | — |

---

## TypeScript types

```typescript
// src/types/project.ts
interface Project {
  title: string;
  description: string;
  thumbnail: string;
  company?: string;
  years?: string;
  skills?: string[];
  externalLink?: string;
}

// src/types/recommendation.ts
interface Recommendation {
  name: string;
  tagline: string;
  date: string;
  workedWith: string;
  review: string;
}

// src/data/skills.ts
interface SkillCategory {
  category: string;
  skills: string[];
}

// src/data/education.ts
interface EducationEntry {
  institution: string;
  degree: string;
  years: string;
  description: string;
}

// src/data/technical-writing.ts
interface TechWritingEntry {
  title: string;
  url?: string;
  description: string;
}
```
