import { useState, useEffect } from 'react';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Loader from '../../../components/ui/Loader';
import equipmentService from '../../../services/equipmentService';
import alertService from '../../../services/alertService';
import toast from 'react-hot-toast';

const ReportDamage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    equipmentId: '',
    severity: 'minor',
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
    if (!formData.equipmentId || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      await alertService.reportDamage({
        equipmentId: formData.equipmentId,
        message: `[${formData.severity.toUpperCase()}] ${formData.description}`
      });
      toast.success('Damage report submitted successfully');
      setFormData({
        equipmentId: '',
        severity: 'minor',
        description: ''
      });
    } catch (error) {
      console.error('Error reporting damage:', error);
      toast.error(error.response?.data?.message || 'Failed to report damage');
    } finally {
      setSubmitting(false);
    }
  };

  const severityOptions = [
    { value: 'minor', label: 'Minor - Cosmetic damage, still functional' },
    { value: 'moderate', label: 'Moderate - Partial loss of functionality' },
    { value: 'severe', label: 'Severe - Not functional, needs repair/replacement' }
  ];

  if (loading) {
    return (
      <TechnicianLayout>
        <Loader text="Loading equipment..." />
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
          Report Damage
        </h1>
        <p style={{ color: '#6b7280' }}>
          Report damaged equipment to the admin.
        </p>
      </div>

      <div style={{ maxWidth: '600px' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit}>
            <Select
              label="Equipment"
              value={formData.equipmentId}
              onChange={(e) => handleChange('equipmentId', e.target.value)}
              options={equipment.map(e => ({ value: e.id, label: e.name }))}
              placeholder="Select equipment"
              required
            />

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Severity <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {severityOptions.map(opt => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      border: formData.severity === opt.value ? '2px solid #2563eb' : '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      backgroundColor: formData.severity === opt.value ? '#eff6ff' : 'white'
                    }}
                  >
                    <input
                      type="radio"
                      name="severity"
                      value={opt.value}
                      checked={formData.severity === opt.value}
                      onChange={(e) => handleChange('severity', e.target.value)}
                      style={{ accentColor: '#2563eb' }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Description <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the damage in detail..."
                rows={5}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </div>
      </div>
    </TechnicianLayout>
  );
};

export default ReportDamage;
