interface NavItemProps {
  href: string;
  label: string;
}

function NavItem({ href, label }: NavItemProps) {
  return (
    <li className="nav-item">
      <a className="nav-link" href={href}>{label}</a>
    </li>
  );
}

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="#home">Portfolio</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <NavItem href="#home" label="Home" />
            <NavItem href="#about" label="About" />
            <NavItem href="#projects" label="Projects" />
            <NavItem href="#contact" label="Contact" />
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
