import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();
const normalizeRole = (role) => (typeof role === 'string' ? role.trim().toLowerCase() : role);
const normalizeUser = (value) => (
  value
    ? { ...value, role: normalizeRole(value.role) }
    : value
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    return t && t !== 'undefined' ? t : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // load user on app start
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (savedToken && savedUser && savedUser !== 'undefined') {
        let parsedUser;
        try {
          parsedUser = normalizeUser(JSON.parse(savedUser));
        } catch {
          parsedUser = null;
        }
        if (!parsedUser || !parsedUser.role) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setIsLoading(false);
          return;
        }

        setUser(parsedUser);
        setToken(savedToken);

        try {
          const response = await authService.getMe();
          const normalizedUser = normalizeUser(response.data.data);
          setUser(normalizedUser);
          localStorage.setItem('user', JSON.stringify(normalizedUser));
        } catch (err) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // login function
  const login = async (email, password, role = null) => {
    const response = await authService.login(email, password, role);
    const { token, user } = response.data.data;
    const normalizedUser = normalizeUser(user);

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(normalizedUser));

    setToken(token);
    setUser(normalizedUser);

    return normalizedUser;
  };

  // logout function
  const logout = (navigate) => {
    const userRole = user?.role;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    if (navigate) {
      if (userRole?.toLowerCase() === 'employee') {
        navigate('/login');
      } else {
        navigate('/staff-login');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
