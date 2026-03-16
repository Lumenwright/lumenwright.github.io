import { ReactNode, CSSProperties } from 'react';
import { useSplitScroll } from '../hooks/useSplitScroll';
import Divider from './Divider';
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

function SplitLayout({ lightHero, lightContent, darkHero, darkContent }: SplitLayoutProps) {
  const { activeSection, setActiveSection, ready } = useSplitScroll();

  return (
    <div style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <div className={styles.lightPanel} style={panelStyle(activeSection === 'light')}>
        {lightHero}
        {activeSection === 'light' && lightContent}
      </div>
      <Divider
        onLightClick={() => setActiveSection('light')}
        onDarkClick={() => setActiveSection('dark')}
      />
      <div className={styles.darkPanel} style={panelStyle(activeSection === 'dark')}>
        {darkHero}
        {activeSection === 'dark' && darkContent}
      </div>
    </div>
  );
}

export default SplitLayout;
