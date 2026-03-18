import { ReactNode, useRef, useState, useEffect } from 'react';
import styles from './Carousel.module.css';

interface CarouselProps {
  children: ReactNode;
}

function Carousel({ children }: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  function updateButtons() {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 0);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener('scroll', updateButtons, { passive: true });
    return () => el.removeEventListener('scroll', updateButtons);
  }, []);

  function scroll(dir: 'left' | 'right') {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? el.offsetWidth : -el.offsetWidth, behavior: 'smooth' });
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.button} onClick={() => scroll('left')} disabled={atStart} aria-label="Previous">
        ‹
      </button>
      <div ref={trackRef} className={styles.track}>
        {children}
      </div>
      <button className={styles.button} onClick={() => scroll('right')} disabled={atEnd} aria-label="Next">
        ›
      </button>
    </div>
  );
}

export default Carousel;
