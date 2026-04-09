import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const menuItems = user?.role === 'manager' ? [
    { path: '/manager/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/manager/equipment', label: 'Equipment', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/manager/issue-part', label: 'Pending Requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { path: '/manager/issue-equipment', label: 'Issue Equipment', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/manager/issue-history', label: 'Issue History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { path: '/admin/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ] : user?.role === 'technician' ? [
    { path: '/technician/schedule', label: 'My Schedule', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/technician/log-maintenance', label: 'Log Maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { path: '/technician/report-damage', label: 'Report Damage', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { path: '/technician/maintenance-history', label: 'History', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ] : user?.role === 'employee' || user?.role === 'user' ? [
    { path: '/user/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/user/browse', label: 'Browse Equipment', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/user/my-requests', label: 'My Requests', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { path: '/user/history', label: 'My History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ] : [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/equipment', label: 'Equipment', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/admin/categories', label: 'Categories', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
    { path: '/admin/locations', label: 'Locations', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
    { path: '/admin/users', label: 'Users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { path: '/admin/maintenance', label: 'Maintenance', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { path: '/admin/alerts', label: 'Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { path: '/admin/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)';
      case 'manager': return 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)';
      case 'technician': return 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)';
      case 'employee': return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
    }
  };

  const renderIcon = (path) => {
    return (
      <svg style={styles.navIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    );
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.sidebarPattern}></div>
      
      <div style={styles.logoSection}>
        <div style={styles.logoBadge}>
          <svg style={styles.logoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div style={styles.logoText}>
          <h2 style={styles.brandName}>EEIMS</h2>
          <p style={styles.brandTagline}>Equipment Management</p>
        </div>
      </div>

      <div style={styles.profileSection}>
        <div style={{ ...styles.avatar, background: getRoleColor() }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div style={styles.userInfo}>
          <p style={styles.userName}>{user?.name}</p>
          <span style={{ ...styles.roleBadge, background: getRoleColor() }}>
            {user?.role}
          </span>
        </div>
      </div>

      <nav style={styles.nav}>
        <p style={styles.navLabel}>MENU</p>
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item.path) ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.navIconWrapper}>
              {renderIcon(item.icon)}
            </span>
            <span style={styles.navText}>{item.label}</span>
            {isActive(item.path) && <div style={styles.activeIndicator}></div>}
          </Link>
        ))}
      </nav>

      <div style={styles.logoutSection}>
        <button onClick={logout} style={styles.logoutBtn}>
          <svg style={styles.logoutIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '280px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 50,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
  },
  sidebarPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
    pointerEvents: 'none',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1.75rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  logoBadge: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
  },
  logoIcon: {
    width: '24px',
    height: '24px',
    color: 'white',
  },
  logoText: {
    color: 'white',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: '800',
    margin: 0,
    letterSpacing: '-0.025em',
    background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandTagline: {
    fontSize: '0.6875rem',
    margin: 0,
    opacity: 0.6,
    fontWeight: 500,
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
    zIndex: 1,
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: '700',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: '0.9375rem',
    fontWeight: '600',
    margin: 0,
    marginBottom: '0.25rem',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  nav: {
    flex: 1,
    padding: '1.25rem 0.875rem',
    overflowY: 'auto',
    position: 'relative',
    zIndex: 1,
  },
  navLabel: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '0.6875rem',
    fontWeight: '700',
    letterSpacing: '0.1em',
    marginBottom: '1rem',
    padding: '0 0.75rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    color: 'rgba(255, 255, 255, 0.65)',
    textDecoration: 'none',
    marginBottom: '0.375rem',
    transition: 'all 0.2s ease',
    position: 'relative',
    fontWeight: 500,
  },
  navItemActive: {
    background: 'rgba(255, 255, 255, 0.15)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  navIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '22px',
    height: '22px',
  },
  navIcon: {
    width: '20px',
    height: '20px',
  },
  navText: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
  activeIndicator: {
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '24px',
    background: 'linear-gradient(180deg, #818cf8 0%, #a78bfa 100%)',
    borderRadius: '4px',
    boxShadow: '0 0 12px rgba(129, 140, 248, 0.5)',
  },
  logoutSection: {
    padding: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    zIndex: 1,
  },
  logoutBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.625rem',
    padding: '0.875rem',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#fca5a5',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  logoutIcon: {
    width: '18px',
    height: '18px',
  },
};

export default Sidebar;