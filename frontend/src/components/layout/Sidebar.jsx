import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = user?.role === 'manager' ? [
{ path: '/manager/dashboard', label: 'Dashboard', icon: '📊' },

    { path: '/manager/equipment', label: 'Equipment', icon: '📦' },
    { path: '/manager/issue-part', label: 'Pending Requests', icon: '📩' },
    { path: '/manager/issue-history', label: 'Request History', icon: '🕘' },
    { path: '/manager/issue-equipment', label: 'Issue Equipment', icon: '📤' },
    { path: '/manager/track-returns', label: 'Return Equipment', icon: '↩️' },
    { path: '/manager/maintenance-tracking', label: 'Maintenance', icon: '🔧' },
    { path: '/admin/categories', label: 'Categories', icon: '🏷️' },
    { path: '/admin/locations', label: 'Locations', icon: '📍' },
    { path: '/admin/reports', label: 'Reports', icon: '📋' },
  ] : [
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
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'var(--white)',
    borderRight: '1px solid var(--border)',
    position: 'fixed',
    left: 0,
    top: 0
  }}>

    {/* Top Section (Scrollable) */}
    <div style={{ flex: 1, overflowY: 'auto' }}>

      {/* Logo */}
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--primary)',
        color: 'white'
      }}>
        <h2 style={{ margin: 0 }}>EEIMS</h2>
        <p style={{ margin: 0, fontSize: '0.8rem' }}>
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
            color: 'white'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div>
            <p style={{ margin: 0 }}>{user?.name}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
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
              borderRight: isActive(item.path) ? '3px solid var(--primary)' : 'transparent',
              fontWeight: isActive(item.path) ? '600' : '500',
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

    </div>

    {/* Bottom Logout (Fixed Properly) */}
    <div style={{
      padding: '1rem 1.5rem',
      borderTop: '1px solid var(--border)',
      background: '#fff'
    }}>
      <button
        onClick={logout}
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        🚪 Logout
      </button>
    </div>

  </div>
  );
};

export default Sidebar;