import { Link, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const menu = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Transactions', to: '/transactions' },
  { label: 'Categories', to: '/categories' },
  { label: 'Budgets', to: '/budgets' },
  { label: 'Goals', to: '/goals' },
  { label: 'Profile', to: '/profile' }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <aside className="sidebar neo">
        <h2>💰 FinTrack Pro</h2>
        <p className="muted">{user?.full_name}</p>
        <nav>
          {menu.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? 'active-link' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button className="secondary" onClick={logout}>Log out</button>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
