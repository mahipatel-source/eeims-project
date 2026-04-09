import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import equipmentService from '../../../services/equipmentService';
import userService from '../../../services/userService';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const IssueEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    equipmentId: '',
    userId: '',
    quantity: 1,
    returnDate: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [equipmentRes, usersRes] = await Promise.all([
          equipmentService.getAll(),
          userService.getAll(),
        ]);

        const equipmentData = equipmentRes.data || [];
        const usersData = (usersRes.data || []).filter((item) => item.role !== 'admin');

        setEquipment(equipmentData);
        setUsers(usersData);
        setForm((prev) => ({
          ...prev,
          equipmentId: equipmentData[0]?.id || prev.equipmentId,
          userId: usersData[0]?.id || prev.userId,
        }));
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load equipment or user list');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedEquipment = equipment.find((item) => item.id === Number(form.equipmentId));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.equipmentId || !form.userId || form.quantity < 1) {
      toast.error('Please select equipment, user, and quantity');
      return;
    }

    if (selectedEquipment && selectedEquipment.quantity < form.quantity) {
      toast.error(`Not enough stock. Only ${selectedEquipment.quantity} units available`);
      return;
    }

    setSubmitting(true);

    try {
      await issueService.directIssue({
        equipmentId: form.equipmentId,
        userId: form.userId,
        quantity: Number(form.quantity),
        remarks: form.remarks,
      });

      toast.success('Equipment issued successfully');
      setForm((prev) => ({
        ...prev,
        quantity: 1,
        returnDate: '',
        remarks: '',
      }));
    } catch (error) {
      console.error('Issue failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to issue equipment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Issue Equipment</h1>
        <p style={{ color: '#6b7280' }}>Directly assign equipment to users and update inventory stock.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>User</label>
              <select
                value={form.userId}
                onChange={(e) => handleChange('userId', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
              >
                {users.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} ({item.role})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Equipment</label>
              <select
                value={form.equipmentId}
                onChange={(e) => handleChange('equipmentId', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
              >
                {equipment.map((item) => (
                  <option key={item.id} value={item.id}>{item.name} — {item.serialNumber || 'No serial'}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Return date</label>
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Remarks</label>
              <textarea
                value={form.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                rows={4}
                placeholder="Add optional notes for this issue"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.95rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Issuing...' : 'Issue Equipment'}
            </button>
          </div>
        </form>

        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>Equipment Details</h2>
          {loading ? (
            <p style={{ color: '#6b7280' }}>Loading equipment details...</p>
          ) : selectedEquipment ? (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Name</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{selectedEquipment.name}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Available quantity</p>
                <p style={{ fontWeight: '600', color: selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#b91c1c' : '#15803d' }}>{selectedEquipment.quantity}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Minimum stock</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{selectedEquipment.minimumStock}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Condition</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{selectedEquipment.condition}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Location</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{selectedEquipment.locationId || 'Not assigned'}</p>
              </div>
            </div>
          ) : (
            <p style={{ color: '#6b7280' }}>Select equipment to view details.</p>
          )}
        </div>
      </div>
    </ManagerLayout>
  );
};

export default IssueEquipment;