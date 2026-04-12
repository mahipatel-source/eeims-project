import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import equipmentService from '../../../services/equipmentService';
import alertService from '../../../services/alertService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const ReportDamage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    severity: '',
    description: ''
  });

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentService.getAll();
      setEquipment(response.data || []);
    } catch (error) {
      console.error('Error loading equipment:', error);
      toast.error('Failed to load equipment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.equipmentId) {
      toast.error('Please select equipment');
      return;
    }
    if (!formData.severity) {
      toast.error('Please select damage severity');
      return;
    }
    if (!formData.description || formData.description.length < 30) {
      toast.error('Please describe the damage (minimum 30 characters)');
      return;
    }

    try {
      setSubmitting(true);
      
      const selectedEquipment = equipment.find(e => e.id === parseInt(formData.equipmentId));
      const message = `Damage reported by ${user.name}: Severity: ${formData.severity.toUpperCase()}. Description: ${formData.description}`;
      
      await alertService.reportDamage({
        equipmentId: parseInt(formData.equipmentId),
        message: message,
        type: 'general'
      });
      
      setShowSuccess(true);
      toast.success('Damage report submitted. Admin has been notified.');
      
      setTimeout(() => {
        navigate('/technician/schedule');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting damage report:', error);
      toast.error(error.response?.data?.message || 'Failed to submit damage report');
    } finally {
      setSubmitting(false);
    }
  };

  const severityOptions = [
    { 
      value: 'minor', 
      label: 'Minor', 
      description: 'Equipment can still operate but needs attention soon',
      bg: '#fef3c7',
      border: '#f59e0b',
      color: '#92400e'
    },
    { 
      value: 'moderate', 
      label: 'Moderate', 
      description: 'Equipment performance affected, needs repair within 24 hours',
      bg: '#fed7aa',
      border: '#f97316',
      color: '#c2410c'
    },
    { 
      value: 'severe', 
      label: 'Severe', 
      description: 'Equipment should not be used, immediate repair required',
      bg: '#fee2e2',
      border: '#dc2626',
      color: '#991b1b'
    }
  ];

  const selectedEquipment = equipment.find(e => e.id === parseInt(formData.equipmentId));
  const selectedSeverity = severityOptions.find(s => s.value === formData.severity);

  if (loading) {
    return (
      <TechnicianLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading...</div>
        </div>
      </TechnicianLayout>
    );
  }

  if (showSuccess) {
    return (
      <TechnicianLayout>
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '2rem auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            Report Submitted Successfully
          </h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            Admin has been notified about the damage.
          </p>
          <button
            onClick={() => navigate('/technician/schedule')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9375rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Schedule
          </button>
        </div>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/technician/schedule"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#0f766e',
            textDecoration: 'none',
            fontWeight: '600',
            marginBottom: '1rem'
          }}
        >
          <span>←</span> Back to Schedule
        </Link>
        
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>Report Equipment Damage</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Report damaged or faulty equipment to admin</p>
      </div>

      <div style={{
        background: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: 'var(--radius-lg)',
        padding: '1rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <p style={{ margin: 0, color: '#92400e', fontSize: '0.9375rem', fontWeight: '500' }}>
          This report will be sent directly to Admin as an alert
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>
                Select Equipment *
              </label>
              <select
                value={formData.equipmentId}
                onChange={(e) => handleChange('equipmentId', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="">-- Select damaged equipment --</option>
                {equipment.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.Location?.name || 'No Location'}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.75rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>
                Damage Severity *
              </label>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {severityOptions.map(option => (
                  <label
                    key={option.value}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem',
                      background: formData.severity === option.value ? option.bg : 'white',
                      border: `2px solid ${formData.severity === option.value ? option.border : 'var(--border-light)'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={option.value}
                      checked={formData.severity === option.value}
                      onChange={(e) => handleChange('severity', e.target.value)}
                      style={{ marginTop: '0.25rem', accentColor: option.border }}
                    />
                    <div>
                      <p style={{ fontWeight: '700', color: option.color, marginBottom: '0.25rem', fontSize: '1rem' }}>
                        {option.label}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                        {option.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>
                Damage Description *
                <span style={{ fontWeight: '400', color: '#64748b', marginLeft: '0.5rem' }}>(Minimum 30 characters)</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={`Describe what you observed...
Example:
- Motor making loud grinding noise
- Visible sparks from electrical panel
- Belt completely broken
- Coolant leaking from bottom`}
                rows={8}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <span style={{ 
                  fontSize: '0.8125rem', 
                  color: formData.description.length < 30 ? '#dc2626' : '#10b981',
                  fontWeight: '600'
                }}>
                  {formData.description.length} characters
                </span>
                {formData.description.length < 30 && (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>Minimum 30 characters required</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/technician/schedule')}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.equipmentId || !formData.severity || formData.description.length < 30}
                style={{
                  flex: 2,
                  padding: '0.875rem',
                  background: (!formData.equipmentId || !formData.severity || formData.description.length < 30 || submitting)
                    ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                    : 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9375rem',
                  fontWeight: '700',
                  cursor: (!formData.equipmentId || !formData.severity || formData.description.length < 30 || submitting) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <span>⚠️</span> Submit Damage Report
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div style={{
            background: formData.equipmentId && formData.severity ? '#f0fdf4' : 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1rem'
            }}>Report Summary</h3>

            {formData.equipmentId && formData.severity ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Equipment</p>
                  <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0f172a' }}>{selectedEquipment?.name || 'N/A'}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Severity</p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    background: selectedSeverity?.bg,
                    color: selectedSeverity?.color
                  }}>
                    {selectedSeverity?.label.toUpperCase()}
                  </span>
                </div>
                <div style={{
                  background: '#f0fdf4',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #bbf7d0'
                }}>
                  <p style={{ fontSize: '0.8125rem', color: '#166534', margin: 0, fontWeight: '500' }}>
                    ✓ This report will be sent to Admin immediately
                  </p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>
                Fill in the form to see summary
              </p>
            )}
          </div>
        </div>
      </div>
    </TechnicianLayout>
  );
};

export default ReportDamage;