import { Link, useLocation } from 'react-router-dom';

function CalmiveLogo() {
  return (
    <svg viewBox="0 0 100 95" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="nav-g" x1="5" y1="5" x2="95" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF47C4"/>
          <stop offset="100%" stopColor="#C026D3"/>
        </linearGradient>
        <filter id="nav-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* Speech bubble outline */}
      <path
        d="M15 6 Q5 6 5 16 L5 62 Q5 72 15 72 L20 72 L11 90 L36 72 L85 72 Q95 72 95 62 L95 16 Q95 6 85 6 Z"
        stroke="url(#nav-g)" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"
        filter="url(#nav-glow)"
      />
      {/* Heart left bump */}
      <path
        d="M50 28 C46 19 20 20 20 38 C20 53 35 60 50 67"
        stroke="url(#nav-g)" strokeWidth="5" strokeLinecap="round"
        filter="url(#nav-glow)"
      />
      {/* Heart right bump */}
      <path
        d="M50 28 C54 19 80 20 80 38 C80 53 65 60 50 67"
        stroke="url(#nav-g)" strokeWidth="5" strokeLinecap="round"
        filter="url(#nav-glow)"
      />
    </svg>
  );
}

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
          <CalmiveLogo />
          <span className="navbar__logo-text">Calmivo</span>
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
