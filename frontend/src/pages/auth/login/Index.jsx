import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'manager') navigate('/manager/dashboard');
      else if (user.role === 'technician') navigate('/technician/schedule');
      else if (user.role === 'employee') navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'manager') navigate('/manager/dashboard');
      else if (user.role === 'technician') navigate('/technician/schedule');
      else if (user.role === 'employee') navigate('/user/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Login failed');
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
          <p style={styles.brandSubtitle}>Electric Equipment Inventory Management System</p>
          
          <div style={styles.featureList}>
            <div style={styles.featureItem}>
              <div style={styles.featureIconBox}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span style={styles.featureText}>Track Equipment</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span style={styles.featureText}>Manage Maintenance</span>
            </div>
            <div style={styles.featureItem}>
              <div style={{...styles.featureIconBox, background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'}}>
                <svg style={styles.featureIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span style={styles.featureText}>Generate Reports</span>
            </div>
          </div>
        </div>
        
        <div style={styles.statsSection}>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>4</span>
            <span style={styles.statsLabel}>User Roles</span>
          </div>
          <div style={styles.statsDivider}></div>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>100%</span>
            <span style={styles.statsLabel}>Secure</span>
          </div>
          <div style={styles.statsDivider}></div>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>24/7</span>
            <span style={styles.statsLabel}>Active</span>
          </div>
        </div>

        <div style={styles.wavePattern}></div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.loginCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIconWrapper}>
              <svg style={styles.cardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 style={styles.cardTitle}>Welcome Back</h2>
            <p style={styles.cardSubtitle}>Sign in to continue to your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  required
                />
              </div>
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
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.toggleBtn}
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
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={styles.submitBtn}
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
            <p>New employee? <Link to="/register" style={styles.link}>Create Account</Link></p>
          </div>

          <div style={styles.demoSection}>
            <p style={styles.demoTitle}>Demo Credentials</p>
            <div style={styles.credentialsList}>
              <div style={styles.credentialItem}>
                <span style={{...styles.roleBadge, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'}}>Admin</span>
                <span style={styles.credential}>admin@eeims.com</span>
                <span style={styles.password}>Admin@123</span>
              </div>
              <div style={styles.credentialItem}>
                <span style={{...styles.roleBadge, background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)'}}>Manager</span>
                <span style={styles.credential}>manager@eeims.com</span>
                <span style={styles.password}>Manager@123</span>
              </div>
              <div style={styles.credentialItem}>
                <span style={{...styles.roleBadge, background: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)'}}>Technician</span>
                <span style={styles.credential}>tech@eeims.com</span>
                <span style={styles.password}>Tech@123</span>
              </div>
              <div style={styles.credentialItem}>
                <span style={{...styles.roleBadge, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'}}>Employee</span>
                <span style={styles.credential}>Use /register page</span>
                <span style={styles.password}>Your password</span>
              </div>
            </div>
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
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
  },
  featureIcon: {
    width: '22px',
    height: '22px',
    color: 'white',
  },
  featureText: {
    fontWeight: 500,
  },
  statsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginTop: '3rem',
    padding: '1.25rem 2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    position: 'relative',
    zIndex: 2,
  },
  statsItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  statsNumber: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: 'white',
  },
  statsLabel: {
    fontSize: '0.75rem',
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statsDivider: {
    width: '1px',
    height: '32px',
    background: 'rgba(255, 255, 255, 0.2)',
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
  submitBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
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
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: '0.9375rem',
  },
  link: {
    color: '#6366f1',
    fontWeight: '700',
    textDecoration: 'none',
  },
  demoSection: {
    marginTop: '1.5rem',
    padding: '1.25rem',
    background: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
  },
  demoTitle: {
    fontSize: '0.6875rem',
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  credentialsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.875rem',
  },
  credentialItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.8125rem',
    flexWrap: 'wrap',
  },
  roleBadge: {
    padding: '0.3125rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.625rem',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    minWidth: '80px',
    textAlign: 'center',
  },
  credential: {
    color: '#334155',
    fontFamily: 'monospace',
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  password: {
    color: '#94a3b8',
    fontFamily: 'monospace',
    fontSize: '0.6875rem',
    marginLeft: 'auto',
  },
};

export default Login;