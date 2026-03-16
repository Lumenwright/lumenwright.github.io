import { useState, useRef, useLayoutEffect, useEffect } from 'react';

export type ActiveSection = 'light' | 'dark' | null;

const SCROLL_DURATION_MS = 600;

// Dark panel starts immediately after the 50vh light panel + 2px divider line.
const darkScrollTarget = () => window.innerHeight / 2 + 2;

export function useSplitScroll() {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [ready, setReady] = useState(false);
  const mounted = useRef(false);

  // Lock scroll at top before first paint — panels are 50vh each so
  // the divider lands exactly at the viewport center.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    setReady(true);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    if (activeSection === null) {
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const t = setTimeout(() => {
        document.body.style.overflow = 'hidden';
      }, SCROLL_DURATION_MS);
      return () => clearTimeout(t);
    }

    document.body.style.overflow = '';
    const target = activeSection === 'light' ? 0 : darkScrollTarget();
    window.scrollTo({ top: target, behavior: 'smooth' });
  }, [activeSection]);

  useEffect(() => {
    return () => { document.body.style.overflow = ''; };
  }, []);

  return { activeSection, setActiveSection, ready };
}
