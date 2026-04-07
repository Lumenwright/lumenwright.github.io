import styles from './NavBar.module.css';
import ProfileCircle from './ProfileCircle';

interface NavItemProps {
  label: string;
  onClick: () => void;
}

function NavItem({ label, onClick }: NavItemProps) {
  return (
    <li className="nav-item">
      <button className="nav-link btn btn-link" onClick={onClick}>
        {label}
      </button>
    </li>
  );
}

export interface NavBarProps {
  onAboutClick: () => void;
  onWorkClick: () => void;
  onMusicClick: () => void;
  onContactClick: () => void;
}

function NavBar({ onAboutClick, onWorkClick, onMusicClick, onContactClick }: NavBarProps) {
  return (
    <nav className={`navbar navbar-expand-lg ${styles.nav}`}>
      <div className={styles.profileCircleWrapper}>
        <ProfileCircle />
      </div>
      <div className="container">
        <button className="navbar-brand btn btn-link text-white" onClick={onAboutClick}>
          Rose Chung
        </button>
        <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-2">
          <NavItem label="About" onClick={onAboutClick} />
          <NavItem label="Work" onClick={onWorkClick} />
          <NavItem label="Music" onClick={onMusicClick} />
          <NavItem label="Let's Talk!" onClick={onContactClick} />
          <li className="nav-item">
            <a
              className={`btn btn-outline-light btn-sm ms-2 ${styles.resumeBtn}`}
              href="/Rose Chung - resume - 2026.pdf"
              download
            >
              Resume
            </a>
          </li>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
