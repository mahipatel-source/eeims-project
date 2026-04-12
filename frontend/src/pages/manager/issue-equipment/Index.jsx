import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import equipmentService from '../../../services/equipmentService';
import userService from '../../../services/userService';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const IssueEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [form, setForm] = useState({
    equipmentId: '',
    userId: '',
    quantity: 1,
    requestedReturnDate: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, usersRes, issuesRes] = await Promise.all([
        equipmentService.getAll(),
        userService.getAll(),
        issueService.getAll()
      ]);

      const equipmentData = equipmentRes.data || [];
      const usersData = (usersRes.data || []).filter((item) => item.role === 'employee');
      const issuesData = issuesRes.data || [];

      setEquipment(equipmentData);
      setUsers(usersData);
      setRecentIssues(issuesData.slice(0, 10));

      if (equipmentData.length > 0) {
        const available = equipmentData.find(e => e.quantity > 0);
        if (available) {
          setForm(prev => ({ ...prev, equipmentId: available.id }));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load equipment or user list');
    } finally {
      setLoading(false);
    }
  };

  const selectedEquipment = equipment.find((item) => item.id === Number(form.equipmentId));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.equipmentId) {
      toast.error('Please select equipment');
      return;
    }
    if (!form.userId) {
      toast.error('Please select an employee');
      return;
    }
    if (!form.quantity || form.quantity < 1) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (selectedEquipment && selectedEquipment.quantity < parseInt(form.quantity)) {
      toast.error(`Not enough stock. Only ${selectedEquipment.quantity} units available`);
      return;
    }

    setSubmitting(true);

    try {
      await issueService.directIssue({
        equipmentId: parseInt(form.equipmentId),
        userId: parseInt(form.userId),
        quantity: parseInt(form.quantity),
        requestedReturnDate: form.requestedReturnDate || null,
        remarks: form.remarks,
      });

      toast.success(` ${form.quantity} units of ${selectedEquipment?.name} issued successfully!`);
      
      setForm(prev => ({
        ...prev,
        quantity: 1,
        requestedReturnDate: '',
        remarks: '',
      }));

      loadData();
    } catch (error) {
      console.error('Issue failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to issue equipment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      equipmentId: equipment[0]?.id || '',
      userId: '',
      quantity: 1,
      requestedReturnDate: '',
      remarks: '',
    });
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading...</div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>Issue Equipment</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Directly issue equipment to workers (for urgent situations)</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.75rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📋</span> Issue Form
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>Issue To (Employee) *</label>
                <select
                  value={form.userId}
                  onChange={(e) => handleChange('userId', e.target.value)}
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
                  <option value="">Select Employee</option>
                  {users.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>Equipment *</label>
                <select
                  value={form.equipmentId}
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
                  <option value="">Select Equipment</option>
                  {equipment.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      disabled={item.quantity === 0}
                    >
                      {item.name} ({item.quantity > 0 ? `${item.quantity} units available` : 'Out of Stock'})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedEquipment?.quantity || 1}
                    value={form.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9375rem',
                      outline: 'none'
                    }}
                  />
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Available: {selectedEquipment?.quantity || 0} units
                  </p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>Expected Return</label>
                  <input
                    type="date"
                    min={minDate}
                    value={form.requestedReturnDate}
                    onChange={(e) => handleChange('requestedReturnDate', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid var(--border-light)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9375rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>Remarks (Optional)</label>
                <textarea
                  value={form.remarks}
                  onChange={(e) => handleChange('remarks', e.target.value)}
                  rows={3}
                  placeholder="Reason for issue (e.g. Machine 3 breakdown, Floor 2)"
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
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    background: '#f1f5f9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    flex: 2,
                    padding: '0.875rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9375rem',
                    fontWeight: '700',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  {submitting ? 'Issuing...' : 'Issue Equipment'}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div>
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-light)',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '1rem'
            }}>Selected Equipment Details</h3>
            
            {selectedEquipment ? (
              <div style={{ display: 'grid', gap: '0.875rem' }}>
                <div style={{
                  background: selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#fef2f2' : '#f0fdf4',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Equipment Name</p>
                  <p style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>{selectedEquipment.name}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Available Qty</p>
                    <p style={{
                      fontSize: '1.5rem',
                      fontWeight: '800',
                      color: selectedEquipment.quantity === 0 ? '#dc2626' : selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#d97706' : '#10b981'
                    }}>
                      {selectedEquipment.quantity}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Min Stock</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a' }}>{selectedEquipment.minimumStock}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Category</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>{selectedEquipment.Category?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Location</p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>{selectedEquipment.Location?.name || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Condition</p>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: selectedEquipment.condition === 'good' ? '#dcfce7' : selectedEquipment.condition === 'fair' ? '#fef3c7' : '#fee2e2',
                    color: selectedEquipment.condition === 'good' ? '#166534' : selectedEquipment.condition === 'fair' ? '#92400e' : '#991b1b'
                  }}>
                    {selectedEquipment.condition?.toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '1rem' }}>Select equipment to view details</p>
            )}
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: '700',
            color: '#0f172a'
          }}>
            Recent Direct Issues
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Equipment</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Issued To</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentIssues.length > 0 ? (
                recentIssues.map((issue) => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>
                      {issue.Equipment?.name || `Equipment #${issue.equipmentId}`}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                      {issue.User?.name || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600' }}>
                      {issue.quantity}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <span style={{
                        padding: '0.25rem 0.625rem',
                        borderRadius: '9999px',
                        fontSize: '0.6875rem',
                        fontWeight: '600',
                        background: issue.status === 'issued' ? '#dbeafe' : issue.status === 'returned' ? '#dcfce7' : '#fef3c7',
                        color: issue.status === 'issued' ? '#1e40af' : issue.status === 'returned' ? '#166534' : '#92400e'
                      }}>
                        {issue.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No recent issues
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default IssueEquipment;