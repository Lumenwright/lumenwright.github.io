interface NavItemProps {
  label: string;
  onClick: () => void;
}

function NavItem({ label, onClick }: NavItemProps) {
  return (
    <li className="nav-item">
      <button className="nav-link btn btn-link text-white" onClick={onClick}>
        {label}
      </button>
    </li>
  );
}

export interface NavBarProps {
  onAboutClick: () => void;
  onWorkClick: () => void;
  onMusicClick: () => void;
}

function NavBar({ onAboutClick, onWorkClick, onMusicClick }: NavBarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button className="navbar-brand btn btn-link text-white" onClick={onAboutClick}>
          Rose Chung
        </button>
        <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-2">
          <NavItem label="About" onClick={onAboutClick} />
          <NavItem label="Work" onClick={onWorkClick} />
          <NavItem label="Music" onClick={onMusicClick} />
          <li className="nav-item">
            <a
              className="btn btn-outline-light btn-sm ms-2"
              href="/resume.pdf"
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
