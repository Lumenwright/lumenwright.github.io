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
