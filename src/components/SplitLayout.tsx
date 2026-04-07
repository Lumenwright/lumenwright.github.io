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
