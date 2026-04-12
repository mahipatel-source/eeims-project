import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import API from '../../../services/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      if (user.role.toLowerCase() === 'employee') {
        navigate('/user/dashboard');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: null });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      if (err.response?.status === 409) {
        setErrors({ email: 'This email is already registered. Please sign in.' });
      } else {
        toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
          <p style={styles.brandSubtitle}>Electric Equipment Inventory Management System</p>
          
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
        
        <div style={styles.statsSection}>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>Easy</span>
            <span style={styles.statsLabel}>To Use</span>
          </div>
          <div style={styles.statsDivider}></div>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>Fast</span>
            <span style={styles.statsLabel}>Approval</span>
          </div>
          <div style={styles.statsDivider}></div>
          <div style={styles.statsItem}>
            <span style={styles.statsNumber}>Full</span>
            <span style={styles.statsLabel}>History</span>
          </div>
        </div>

        <div style={styles.wavePattern}></div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.registerCard}>
          <div style={styles.cardHeader}>
            <div style={styles.cardIconWrapper}>
              <svg style={styles.cardIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 style={styles.cardTitle}>Create Employee Account</h2>
            <p style={styles.cardSubtitle}>Join EEIMS to request equipment for your work</p>
          </div>

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Full Name</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{...styles.input, borderColor: errors.name ? '#ef4444' : '#e2e8f0'}}
                  disabled={isLoading}
                />
              </div>
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Work Email Address</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your work email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{...styles.input, borderColor: errors.email ? '#ef4444' : '#e2e8f0'}}
                  disabled={isLoading}
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
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  style={{...styles.input, borderColor: errors.password ? '#ef4444' : '#e2e8f0'}}
                  disabled={isLoading}
                />
              </div>
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{...styles.input, borderColor: errors.confirmPassword ? '#ef4444' : '#e2e8f0'}}
                  disabled={isLoading}
                />
              </div>
              {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
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
                  Creating Account...
                </span>
              ) : (
                <>
                  Create Account
                  <svg style={styles.arrowIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div style={styles.termsNote}>
            By creating an account you agree to use this system for factory work purposes only
          </div>

          <div style={styles.loginLink}>
            <span style={styles.loginText}>Already have an account? </span>
            <Link to="/login" style={styles.link}>Sign In</Link>
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
  statsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    marginTop: '3rem',
    padding: '1.25rem 2rem',
    background: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.2)',
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
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'white',
  },
  statsLabel: {
    fontSize: '0.75rem',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statsDivider: {
    width: '1px',
    height: '32px',
    background: 'rgba(255,255,255,0.3)',
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
  registerCard: {
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
  errorText: {
    color: '#ef4444',
    fontSize: '0.75rem',
    fontWeight: 500,
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
  termsNote: {
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
    lineHeight: '1.4',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e2e8f0',
  },
  loginText: {
    color: '#64748b',
    fontSize: '0.9375rem',
  },
  link: {
    color: '#2563eb',
    fontWeight: '700',
    textDecoration: 'none',
  },
};

export default Register;