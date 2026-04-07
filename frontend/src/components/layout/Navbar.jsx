import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: '250px', // Sidebar width
      right: 0,
      height: '4rem',
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      zIndex: 1000
    }}>
      {/* Breadcrumb/Title */}
      <div>
        <h1 style={{
          margin: 0,
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#111827'
        }}>
          Admin Panel
        </h1>
      </div>

      {/* User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
            {user?.name || 'Admin User'}
          </p>
          <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
            {user?.role || 'admin'}
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;