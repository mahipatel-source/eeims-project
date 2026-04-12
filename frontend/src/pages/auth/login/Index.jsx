import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const navigateByRole = (role) => {
    const normalizedRole = typeof role === 'string' ? role.trim().toLowerCase() : role;
    if (normalizedRole === 'employee') navigate('/user/dashboard', { replace: true });
  };

  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === 'employee') {
        navigateByRole(user.role);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const user = await login(email, password);
      if (user.role.toLowerCase() !== 'employee') {
        setPassword('');
        toast.error(
          <div>
            This portal is for employees only.
            <Link to="/staff-login" style={{ color: '#10b981', marginLeft: '8px', textDecoration: 'underline' }}>
              Use Staff login
            </Link>
          </div>
        );
        setIsLoading(false);
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      navigateByRole(user.role);
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setErrors({ password: 'Invalid email or password' });
      } else {
        toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          <p style={styles.brandSubtitle}>Employee Self Service Portal</p>
          
          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span style={styles.featureText}>Browse Available Equipment</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span style={styles.featureText}>Request Equipment Online</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span style={styles.featureText}>Track Request Status</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <span style={styles.featureText}>Return Equipment Easily</span>
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 style={styles.cardTitle}>Employee Sign In</h2>
            <p style={styles.cardSubtitle}>Access your equipment request portal</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.roleToggle}>
              <span style={styles.roleLabel}>Employee Login</span>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: null}); }}
                  style={{...styles.input, borderColor: errors.email ? '#ef4444' : '#e2e8f0'}}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: null}); }}
                  style={{...styles.input, borderColor: errors.password ? '#ef4444' : '#e2e8f0'}}
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
              disabled={isLoading}
              style={{...styles.submitBtn, opacity: isLoading ? 0.7 : 1}}
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
                  Sign In
                  <svg style={styles.arrowIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={styles.registerLink}>
            <div style={styles.divider}>
              <span style={styles.dividerText}>New employee?</span>
            </div>
            <p style={styles.registerText}>Don't have an account? <Link to="/register" style={styles.link}>Create Account</Link></p>
          </div>

          <div style={styles.staffLink}>
            <span style={styles.staffText}>Are you staff? </span>
            <Link to="/staff-login" style={styles.staffLinkText}>Admin / Manager / Technician login →</Link>
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
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
    border: '1px solid rgba(255,255,255,0.3)',
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
  },
  brandSubtitle: {
    fontSize: '1.25rem',
    opacity: 0.9,
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
    fontSize: '1rem',
    opacity: 0.95,
  },
  featureIconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    background: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23ffffff\' fill-opacity=\'0.1\' d=\'M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
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
    maxWidth: '460px',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  cardIconWrapper: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
  },
  cardIcon: {
    width: '32px',
    height: '32px',
    color: '#2563eb',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em',
  },
  cardSubtitle: {
    color: '#64748b',
    fontSize: '0.875rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
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
    padding: '0.875rem 1rem 0.875rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
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
  errorText: {
    color: '#ef4444',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  roleToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    borderRadius: '12px',
    marginBottom: '0.5rem',
  },
  roleLabel: {
    color: 'white',
    fontWeight: '700',
    fontSize: '0.9375rem',
  },
  submitBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem',
    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
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
  registerLink: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  divider: {
    textAlign: 'center',
    marginBottom: '1rem',
    position: 'relative',
  },
  dividerText: {
    background: 'white',
    padding: '0 1rem',
    color: '#64748b',
    fontSize: '0.8125rem',
    position: 'relative',
    zIndex: 1,
  },
  registerText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.9375rem',
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
    textDecoration: 'none',
  },
  staffLink: {
    textAlign: 'center',
    marginTop: '1.25rem',
    paddingTop: '1rem',
    borderTop: '1px solid #e2e8f0',
  },
  staffText: {
    color: '#94a3b8',
    fontSize: '0.75rem',
  },
  staffLinkText: {
    color: '#64748b',
    fontSize: '0.75rem',
    textDecoration: 'none',
  },
};

export default Login;