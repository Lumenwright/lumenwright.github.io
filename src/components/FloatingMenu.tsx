import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from './FloatingMenu.module.css';

export interface FloatingMenuProps {
  navScrolledAway: boolean;
  onAboutClick: () => void;
  onWorkClick: () => void;
  onMusicClick: () => void;
  onContactClick: () => void;
}

function FloatingMenu({ navScrolledAway, onAboutClick, onWorkClick, onMusicClick, onContactClick }: FloatingMenuProps) {
  const [open, setOpen] = useState(false);

  function handle(fn: () => void) {
    fn();
    setOpen(false);
  }

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button className={styles.sheetItem} onClick={() => handle(onAboutClick)}>About</button>
            <button className={styles.sheetItem} onClick={() => handle(onWorkClick)}>Work</button>
            <button className={styles.sheetItem} onClick={() => handle(onMusicClick)}>Music</button>
            <button className={styles.sheetItem} onClick={() => handle(onContactClick)}>Let's Talk!</button>
            <hr className={styles.sheetDivider} />
            <a className={styles.sheetResume} href="/Rose Chung - resume - 2026.pdf" download>
              Download Resume
            </a>
          </div>
        </div>
      )}
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

export default FloatingMenu;
