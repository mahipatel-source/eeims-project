import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import alertService from '../../services/alertService';

const titleMap = {
  '/admin/dashboard': 'Dashboard',
  '/admin/equipment': 'Equipment Management',
  '/admin/equipment/add': 'Add Equipment',
  '/admin/categories': 'Categories',
  '/admin/locations': 'Locations',
  '/admin/users': 'User Management',
  '/admin/employees': 'Employees',
  '/admin/maintenance': 'Maintenance Management',
  '/admin/alerts': 'Alerts',
  '/admin/reports': 'Reports & Analytics',
  '/manager/dashboard': 'Manager Dashboard',
  '/manager/equipment-view': 'Equipment',
  '/manager/pending-requests': 'Pending Requests',
  '/manager/issue-part': 'Issue Equipment',
  '/manager/issue-history': 'Issue History',
  '/manager/reports': 'Reports',
  '/technician/schedule': 'My Schedule',
  '/technician/log-maintenance': 'Log Maintenance',
  '/technician/report-damage': 'Report Damage',
  '/technician/maintenance-history': 'Maintenance History',
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const loadUnreadCount = async () => {
      try {
        const response = await alertService.getUnreadCount();
        setUnreadCount(response.data?.count || 0);
      } catch {
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
  }, [user?.role, location.pathname]);

  const handleLogout = () => {
    logout(navigate);
  };

  const title = titleMap[location.pathname] || 'EEIMS';

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 'var(--sidebar-width)',
        right: 0,
        height: 'var(--topbar-height)',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        borderBottom: '1px solid var(--border-light)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem 0 1.75rem',
        zIndex: 1000,
        boxShadow: '0 1px 0 rgba(15, 23, 42, 0.04)',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '1.375rem', fontWeight: '700', color: '#0f172a' }}>{title}</h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        {user?.role === 'admin' && (
          <Link
            to="/admin/alerts"
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
              <path d="M9 17a3 3 0 006 0" />
            </svg>
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '9999px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: '700',
                  padding: '0 0.35rem',
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        )}

        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>
            {user?.name || 'Admin User'}
          </p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.2rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              fontSize: '0.6875rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {user?.role || 'admin'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '0.625rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
