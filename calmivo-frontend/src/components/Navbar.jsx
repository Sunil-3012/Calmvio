import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/',          label: 'Home'      },
    { to: '/chat',      label: 'Chat'      },
    { to: '/mood',      label: 'Mood'      },
    { to: '/resources', label: 'Resources' },
  ];

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-dot" />
          Calmivo
        </Link>
        <ul className="navbar__links">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={pathname === to ? 'navbar__cta' : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
