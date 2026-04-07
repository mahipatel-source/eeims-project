import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/equipment', label: 'Equipment', icon: '📦' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { path: '/admin/locations', label: 'Locations', icon: '📍' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/maintenance', label: 'Maintenance', icon: '🔧' },
    { path: '/admin/alerts', label: 'Alerts', icon: '⚠️' },
    { path: '/admin/reports', label: 'Reports', icon: '📋' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      backgroundColor: 'var(--white)',
      borderRight: '1px solid var(--border)',
      position: 'fixed',
      left: 0,
      top: 0,
      overflowY: 'auto'
    }}>
      {/* Logo/Brand */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--primary)',
        color: 'white'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>EEIMS</h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
          Equipment Management
        </p>
      </div>

      {/* User Info */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '600'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: '500', fontSize: '0.875rem' }}>
              {user?.name || 'Admin User'}
            </p>
            <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
              {user?.role || 'admin'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav style={{ padding: '1rem 0' }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1.5rem',
              textDecoration: 'none',
              color: isActive(item.path) ? 'var(--primary)' : '#374151',
              backgroundColor: isActive(item.path) ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              borderRight: isActive(item.path) ? '3px solid var(--primary)' : '3px solid transparent',
              fontWeight: isActive(item.path) ? '600' : '500',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem 1.5rem',
        borderTop: '1px solid var(--border)'
      }}>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s ease'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;