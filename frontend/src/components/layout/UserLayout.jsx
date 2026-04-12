import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const UserLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout(navigate);
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { path: '/user/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/user/browse', label: 'Browse Equipment', icon: '🔍' },
    { path: '/user/my-requests', label: 'My Requests', icon: '📋' },
    { path: '/user/history', label: 'My History', icon: '📜' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div style={styles.wrapper}>
      {/* sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.brand}>
          <h2 style={styles.brandName}>EEIMS</h2>
          <p style={styles.brandSub}>Equipment Management</p>
        </div>

        <div style={styles.userInfo}>
          <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <p style={styles.userName}>{user?.name}</p>
            <p style={styles.userRole}>{user?.role}</p>
          </div>
        </div>

        <nav style={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.path}
              style={{ ...styles.navItem, ...(isActive(item.path) ? styles.activeNavItem : {}) }}
              onClick={() => navigate(item.path)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      {/* main content */}
      <div style={styles.main}>
        {/* top navbar */}
        <div style={styles.navbar}>
          <h3 style={styles.panelTitle}>Employee Portal</h3>
          <div style={styles.navRight}>
            <span style={styles.navUser}>{user?.name}</span>
            <span style={styles.navRole}>{user?.role}</span>
            <button style={styles.navLogout} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* page content */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', background: '#f8fafc' },
  sidebar: { width: '240px', background: '#2563eb', display: 'flex', flexDirection: 'column', padding: '0', flexShrink: 0 },
  brand: { padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  brandName: { color: '#fff', fontSize: '22px', fontWeight: '700' },
  brandSub: { color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '600' },
  userName: { color: '#fff', fontSize: '14px', fontWeight: '500' },
  userRole: { color: 'rgba(255,255,255,0.6)', fontSize: '12px' },
  nav: { flex: 1, padding: '16px 0' },
  navItem: { width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '14px', cursor: 'pointer', textAlign: 'left' },
  activeNavItem: { background: 'rgba(255,255,255,0.15)', color: '#fff', borderLeft: '3px solid #fff' },
  navIcon: { fontSize: '16px' },
  logoutBtn: { margin: '16px', padding: '12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  navbar: { background: '#fff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  panelTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  navUser: { fontSize: '14px', fontWeight: '500', color: '#1e293b' },
  navRole: { fontSize: '12px', color: '#64748b' },
  navLogout: { padding: '6px 14px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  content: { flex: 1, overflowY: 'auto' },
};

export default UserLayout;