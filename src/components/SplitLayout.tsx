import { ReactNode, CSSProperties } from 'react';
import { useSplitScroll, SCROLL_DURATION_MS } from '../hooks/useSplitScroll';
import NavBar from './NavBar';
import styles from './SplitLayout.module.css';

interface SplitLayoutProps {
  lightHero: ReactNode;
  lightContent: ReactNode;
  darkHero: ReactNode;
  darkContent: ReactNode;
}

function panelStyle(isActive: boolean): CSSProperties {
  return isActive
    ? { minHeight: '100vh' }
    : { height: '50vh', overflow: 'hidden' };
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

function SplitLayout({ lightHero, lightContent, darkHero, darkContent }: SplitLayoutProps) {
  const { activeSection, setActiveSection, ready } = useSplitScroll();

  function expandLightThen(id: string) {
    if (activeSection === 'light') {
      scrollToId(id);
    } else {
      setActiveSection('light');
      setTimeout(() => scrollToId(id), SCROLL_DURATION_MS + 100);
    }
  }

  return (
    <div style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div
        className={styles.lightPanel}
        style={{
          ...panelStyle(activeSection === 'light'),
          cursor: activeSection !== 'light' ? 'pointer' : 'default',
        }}
        onClick={activeSection !== 'light' ? () => setActiveSection('light') : undefined}
      >
        {lightHero}
        {activeSection === 'light' && lightContent}
      </div>
      <NavBar
        onAboutClick={() => expandLightThen('about')}
        onWorkClick={() => expandLightThen('projects')}
        onMusicClick={() => setActiveSection('dark')}
      />
      <div
        className={styles.darkPanel}
        style={{
          ...panelStyle(activeSection === 'dark'),
          cursor: activeSection !== 'dark' ? 'pointer' : 'default',
        }}
        onClick={activeSection !== 'dark' ? () => setActiveSection('dark') : undefined}
      >
        {darkHero}
        {activeSection === 'dark' && darkContent}
      </div>
    </div>
  );
}

export default SplitLayout;
