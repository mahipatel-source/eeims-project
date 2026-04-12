import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [errors, setErrors] = useState({});
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const roleConfig = {
    admin: {
      label: 'Admin',
      badge: '#2563eb',
      gradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
    manager: {
      label: 'Manager',
      badge: '#4f46e5',
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a4 4 0 11-8 0 4 4 0 018 0zM17 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0'
    },
    technician: {
      label: 'Technician',
      badge: '#0f766e',
      gradient: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    }
  };

  const navigateByRole = (role) => {
    const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : role;
    if (normalizedRole === 'admin') navigate('/admin/dashboard', { replace: true });
    else if (normalizedRole === 'manager') navigate('/manager/dashboard', { replace: true });
    else if (normalizedRole === 'technician') navigate('/technician/schedule', { replace: true });
  };

  useEffect(() => {
    if (user) {
      navigateByRole(user.role);
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedRole) {
      newErrors.role = 'Please select your role';
    }
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password, selectedRole);
      
      const actualRole = user.role.toLowerCase().trim();
      const selectedRoleLower = selectedRole.toLowerCase().trim();
      
      if (actualRole === 'employee') {
        setPassword('');
        toast.error(
          <div>
            This portal is for staff only. 
            <Link to="/login" style={{ color: '#3b82f6', marginLeft: '8px', textDecoration: 'underline' }}>
              Use Employee login
            </Link>
          </div>
        );
        setIsLoading(false);
        return;
      }
      
      if (actualRole !== selectedRoleLower) {
        setPassword('');
        toast.error(
          `Access denied. You selected ${roleConfig[selectedRole]?.label || selectedRole} but your account is ${user.role}. Please select the correct role.`
        );
        setIsLoading(false);
        return;
      }
      
      toast.success(`Welcome back, ${user.name}!`);
      navigateByRole(user.role);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 403) {
        setPassword('');
      } else {
        toast.error(error.response?.data?.message || error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoleConfig = roleConfig[selectedRole] || null;
  const btnGradient = currentRoleConfig?.gradient || 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)';

  return (
    <div style={styles.wrapper}>
      <div style={styles.backgroundPattern}></div>
      
      <div style={styles.leftSection}>
        <div style={styles.brandContent}>
          <div style={styles.logoBadge}>
            <svg style={styles.logoIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 style={styles.brandTitle}>EEIMS</h1>
          <p style={styles.brandSubtitle}>Electric Equipment Inventory Management System</p>
          
          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span style={styles.featureText}>Track Equipment Inventory</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span style={styles.featureText}>Manage Maintenance Schedules</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span style={styles.featureText}>Generate Reports</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span style={styles.featureText}>Role Based Access Control</span>
            </div>
          </div>
        </div>
        
        <div style={styles.wavePattern}></div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.loginCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIconWrapper}>
              <svg style={styles.cardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 style={styles.cardTitle}>Staff Portal</h2>
            <p style={styles.cardSubtitle}>Select your role and sign in</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Select Your Role</label>
              <div style={styles.selectWrapper}>
                <svg style={styles.selectIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <select
                  value={selectedRole}
                  onChange={(e) => { setSelectedRole(e.target.value); setErrors({...errors, role: null}); }}
                  style={{
                    ...styles.select,
                    borderColor: errors.role ? '#ef4444' : (currentRoleConfig ? currentRoleConfig.badge : '#e2e8f0'),
                  }}
                >
                  <option value="" disabled>-- Select Role --</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="technician">Technician</option>
                </select>
                <svg style={styles.selectArrow} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.role && <span style={styles.errorText}>{errors.role}</span>}
              {currentRoleConfig && (
                <div style={styles.selectedRoleBadge}>
                  <span style={{...styles.roleBadge, background: currentRoleConfig.badge}}>
                    {currentRoleConfig.label.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div style={styles.inputGroup}>
              <label style={{...styles.inputLabel, color: currentRoleConfig ? currentRoleConfig.badge : '#334155'}}>Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={{...styles.inputIcon, color: currentRoleConfig ? currentRoleConfig.badge : '#94a3b8'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: null}); }}
                  style={{
                    ...styles.input,
                    borderColor: errors.email ? '#ef4444' : (currentRoleConfig ? currentRoleConfig.badge : '#e2e8f0'),
                  }}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={{...styles.inputLabel, color: currentRoleConfig ? currentRoleConfig.badge : '#334155'}}>Password</label>
              <div style={styles.inputWrapper}>
                <svg style={{...styles.inputIcon, color: currentRoleConfig ? currentRoleConfig.badge : '#94a3b8'}} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: null}); }}
                  style={{
                    ...styles.input,
                    borderColor: errors.password ? '#ef4444' : (currentRoleConfig ? currentRoleConfig.badge : '#e2e8f0'),
                  }}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg style={styles.eyeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg style={styles.eyeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              style={{
                ...styles.submitBtn,
                background: btnGradient,
                opacity: (isLoading || !selectedRole) ? 0.6 : 1,
                cursor: (isLoading || !selectedRole) ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? (
                <span style={styles.loadingState}>
                  <svg style={styles.spinnerIcon} fill="none" viewBox="0 0 24 24">
                    <circle style={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path style={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In as {currentRoleConfig ? currentRoleConfig.label : 'Staff'}
                  <svg style={styles.arrowIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={styles.employeeLink}>
            <span style={styles.employeeText}>Employee? </span>
            <Link to="/login" style={styles.employeeLinkText}>Sign in here →</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
    zIndex: 0,
  },
  leftSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
    position: 'relative',
    zIndex: 1,
  },
  brandContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    color: 'white',
  },
  logoBadge: {
    width: '100px',
    height: '100px',
    borderRadius: '28px',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  logoIcon: {
    width: '48px',
    height: '48px',
    color: 'white',
  },
  brandTitle: {
    fontSize: '3.5rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em',
    background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  brandSubtitle: {
    fontSize: '1.25rem',
    opacity: 0.85,
    marginBottom: '3rem',
    fontWeight: 500,
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '1rem',
    textAlign: 'left',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1.0625rem',
    opacity: 0.9,
  },
  featureIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
    flexShrink: 0,
  },
  featureIcon: {
    width: '22px',
    height: '22px',
    color: 'white',
  },
  featureText: {
    fontWeight: 500,
  },
  wavePattern: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'0.08\' d=\'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
    backgroundSize: 'cover',
    zIndex: 1,
  },
  rightSection: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#f8fafc',
    position: 'relative',
    zIndex: 1,
  },
  loginCard: {
    width: '100%',
    maxWidth: '480px',
    background: 'white',
    borderRadius: '28px',
    padding: '2.75rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  cardIconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  cardIcon: {
    width: '32px',
    height: '32px',
    color: '#6366f1',
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em',
  },
  cardSubtitle: {
    color: '#64748b',
    fontSize: '0.9375rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  inputLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    width: '20px',
    height: '20px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'all 0.2s',
    background: '#f8fafc',
    fontWeight: 500,
  },
  toggleBtn: {
    position: 'absolute',
    right: '1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: '20px',
    height: '20px',
    color: '#94a3b8',
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  selectIcon: {
    position: 'absolute',
    left: '1rem',
    width: '20px',
    height: '20px',
    color: '#94a3b8',
    pointerEvents: 'none',
    zIndex: 1,
  },
  select: {
    width: '100%',
    padding: '1rem 3rem 1rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '14px',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'all 0.2s',
    background: '#f8fafc',
    fontWeight: 500,
    color: '#0f172a',
    cursor: 'pointer',
    appearance: 'none',
  },
  selectArrow: {
    position: 'absolute',
    right: '1rem',
    width: '20px',
    height: '20px',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  selectedRoleBadge: {
    marginTop: '0.5rem',
  },
  roleBadge: {
    display: 'inline-block',
    padding: '0.3125rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    color: 'white',
    border: 'none',
    borderRadius: '14px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.75rem',
    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    opacity: 0.9,
  },
  spinnerIcon: {
    width: '20px',
    height: '20px',
    animation: 'spin 1s linear infinite',
  },
  spinnerCircle: {
    opacity: 0.25,
  },
  spinnerPath: {
    opacity: 0.75,
  },
  arrowIcon: {
    width: '20px',
    height: '20px',
    transition: 'transform 0.2s',
  },
  employeeLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  employeeText: {
    color: '#64748b',
    fontSize: '0.875rem',
  },
  employeeLinkText: {
    color: '#6366f1',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '0.875rem',
  },
};

export default StaffLogin;