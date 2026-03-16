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

interface NavBarProps {
  onLightClick: () => void;
  onDarkClick: () => void;
}

function NavBar({ onLightClick, onDarkClick }: NavBarProps) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <button className="navbar-brand btn btn-link text-white" onClick={onLightClick}>
          Portfolio
        </button>
        <div className="navbar-nav ms-auto d-flex flex-row">
          <NavItem label="About" onClick={onLightClick} />
          <NavItem label="Projects" onClick={onDarkClick} />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
