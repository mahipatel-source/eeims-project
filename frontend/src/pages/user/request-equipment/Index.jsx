import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import equipmentService from '../../../services/equipmentService';
import issueService from '../../../services/issueService';
import UserLayout from '../../../components/layout/UserLayout';
import toast from 'react-hot-toast';

const RequestEquipment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    remarks: '',
    requestedReturnDate: '',
  });

  useEffect(() => {
    loadEquipment();
  }, [id]);

  const loadEquipment = async () => {
    try {
      const response = await equipmentService.getById(id);
      setEquipment(response.data);
    } catch (err) {
      toast.error('Equipment not found');
      navigate('/user/browse');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate quantity
    if (formData.quantity < 1) {
      return toast.error('Quantity must be at least 1');
    }

    if (formData.quantity > equipment.quantity) {
      return toast.error(`Only ${equipment.quantity} units available`);
    }

    setIsSubmitting(true);
    try {
      await issueService.requestEquipment({
        equipmentId: parseInt(id),
        quantity: parseInt(formData.quantity),
        remarks: formData.remarks,
        requestedReturnDate: formData.requestedReturnDate || null,
      });

      toast.success('Request submitted successfully! Waiting for approval.');
      navigate('/user/my-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <UserLayout><div style={styles.loading}>Loading...</div></UserLayout>;

  return (
    <UserLayout>
      <div style={styles.container}>
        <button style={styles.backBtn} onClick={() => navigate('/user/browse')}>
          ← Back to Browse
        </button>

        <h1 style={styles.title}>Request Equipment</h1>

        {/* equipment details */}
        <div style={styles.equipmentCard}>
          <h2 style={styles.equipmentName}>{equipment?.name}</h2>
          <p style={styles.equipmentDesc}>{equipment?.description}</p>
          <div style={styles.equipmentMeta}>
            <span>Category: <strong>{equipment?.Category?.name || 'N/A'}</strong></span>
            <span>Location: <strong>{equipment?.Location?.name || 'N/A'}</strong></span>
            <span>Available: <strong style={{ color: '#16a34a' }}>{equipment?.quantity} units</strong></span>
            <span>Condition: <strong>{equipment?.condition}</strong></span>
          </div>
        </div>

        {/* request form */}
        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Fill Request Details</h3>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity Required *</label>
              <input
                style={styles.input}
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                max={equipment?.quantity}
                required
              />
              <p style={styles.hint}>Maximum available: {equipment?.quantity}</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Expected Return Date</label>
              <input
                style={styles.input}
                type="date"
                name="requestedReturnDate"
                value={formData.requestedReturnDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Purpose / Remarks</label>
              <textarea
                style={styles.textarea}
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Describe why you need this equipment..."
                rows="4"
              />
            </div>

            <div style={styles.formActions}>
              <button
                type="button"
                style={styles.cancelBtn}
                onClick={() => navigate('/user/browse')}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '700px', margin: '0 auto' },
  loading: { padding: '40px', textAlign: 'center' },
  backBtn: { background: 'none', border: 'none', color: '#2563eb', fontSize: '14px', cursor: 'pointer', marginBottom: '16px', padding: '0' },
  title: { fontSize: '24px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' },
  equipmentCard: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '20px', marginBottom: '24px' },
  equipmentName: { fontSize: '20px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' },
  equipmentDesc: { color: '#64748b', fontSize: '14px', marginBottom: '12px' },
  equipmentMeta: { display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '14px', color: '#374151' },
  formCard: { background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formTitle: { fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '20px' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  hint: { fontSize: '12px', color: '#94a3b8', marginTop: '4px' },
  textarea: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
  formActions: { display: 'flex', gap: '12px', justifyContent: 'flex-end' },
  cancelBtn: { padding: '10px 24px', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  submitBtn: { padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
};

export default RequestEquipment;