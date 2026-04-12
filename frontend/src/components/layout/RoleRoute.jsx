import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

const RoleRoute = ({ children, roles }) => {
  const { user, isLoading } = useAuth();
  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : user?.role;
  const allowedRoles = roles.map((role) => role.trim().toLowerCase());

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <Loader text="Loading..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to staff-login for admin/manager/technician, login for employee
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin') || currentPath.startsWith('/manager') || currentPath.startsWith('/technician')) {
      return <Navigate to="/staff-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // check if user role is allowed
  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RoleRoute;
