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

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'manager') navigate('/manager/dashboard');
      else if (user.role === 'technician') navigate('/technician/schedule');
      else if (user.role === 'employee') navigate('/user/dashboard');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      return toast.error('All fields are required');
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }

    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setIsLoading(true);
    try {
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.leftSection}>
        <div style={styles.brandContent}>
          <div style={styles.logoBadge}>
            <span style={styles.logoIcon}>⚡</span>
          </div>
          <h1 style={styles.brandTitle}>Join EEIMS</h1>
          <p style={styles.brandSubtitle}>Create your employee account</p>
          <div style={styles.benefits}>
            <div style={styles.benefitItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Request equipment online</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>Track your requests</span>
            </div>
            <div style={styles.benefitItem}>
              <span style={styles.checkIcon}>✓</span>
              <span>View issue history</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.rightSection}>
        <div style={styles.registerCard}>
          <div style={styles.cardHeader}>
            <Link to="/login" style={styles.backLink}>← Back to Login</Link>
            <h2 style={styles.cardTitle}>Create Account</h2>
            <p style={styles.cardSubtitle}>Register as an employee to request equipment</p>
          </div>

          <form onSubmit={handleRegister} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Full Name</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Email Address</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>📧</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔐</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                style={styles.checkbox}
              />
              <label htmlFor="showPassword" style={styles.checkboxLabel}>Show passwords</label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={styles.submitBtn}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.loginLink}>
            <p>Already have an account? <Link to="/login" style={styles.link}>Sign In</Link></p>
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
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4f46e5 100%)',
  },
  leftSection: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3rem',
  },
  brandContent: {
    textAlign: 'center',
    color: 'white',
  },
  logoBadge: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    backdropFilter: 'blur(10px)',
  },
  logoIcon: {
    fontSize: '2.5rem',
  },
  brandTitle: {
    fontSize: '3rem',
    fontWeight: '800',
    marginBottom: '0.5rem',
  },
  brandSubtitle: {
    fontSize: '1.125rem',
    opacity: 0.9,
    marginBottom: '2rem',
  },
  benefits: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '2rem',
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1rem',
  },
  checkIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  rightSection: {
    flex: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#f8fafc',
  },
  registerCard: {
    width: '100%',
    maxWidth: '420px',
    background: 'white',
    borderRadius: '24px',
    padding: '2.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  cardHeader: {
    marginBottom: '2rem',
  },
  backLink: {
    fontSize: '0.875rem',
    color: '#6b7280',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.5rem',
  },
  cardSubtitle: {
    color: '#6b7280',
    fontSize: '0.875rem',
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
    fontWeight: '500',
    color: '#374151',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    fontSize: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.875rem 1rem 0.875rem 2.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'all 0.2s',
    background: '#f9fafb',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#4f46e5',
  },
  checkboxLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
  },
  submitBtn: {
    width: '100%',
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '0.5rem',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: '0.875rem',
  },
  link: {
    color: '#4f46e5',
    fontWeight: '600',
    textDecoration: 'none',
  },
};

export default Register;
