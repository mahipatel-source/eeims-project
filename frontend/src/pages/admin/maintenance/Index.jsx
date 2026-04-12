import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import maintenanceService from '../../../services/maintenanceService';
import equipmentService from '../../../services/equipmentService';
import userService from '../../../services/userService';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Loader from '../../../components/ui/Loader';
import toast from 'react-hot-toast';

const todayString = new Date().toISOString().split('T')[0];

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({
    equipmentId: '',
    technicianId: '',
    scheduledDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [maintenanceRes, equipmentRes, usersRes] = await Promise.all([
        maintenanceService.getAll(),
        equipmentService.getAll(),
        userService.getAll(),
      ]);

      setMaintenances(maintenanceRes.data || []);
      setEquipment(equipmentRes.data || []);
      setTechnicians((usersRes.data || []).filter((item) => item.role === 'technician'));
    } catch (error) {
      console.error('Error loading maintenance data:', error);
      toast.error('Failed to load maintenance records');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaintenances = useMemo(() => (
    maintenances.filter((item) => !statusFilter || item.status === statusFilter)
  ), [maintenances, statusFilter]);

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.equipmentId) nextErrors.equipmentId = 'Equipment is required';
    if (!formData.technicianId) nextErrors.technicianId = 'Technician is required';
    if (!formData.scheduledDate) nextErrors.scheduledDate = 'Scheduled date is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({ equipmentId: '', technicianId: '', scheduledDate: '', notes: '' });
    setErrors({});
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await maintenanceService.create(formData);
      toast.success('Maintenance scheduled successfully');
      setShowScheduleModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error scheduling maintenance:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule maintenance');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRecord) return;

    try {
      setSubmitting(true);
      await maintenanceService.delete(selectedRecord.id);
      toast.success('Maintenance record deleted successfully');
      setShowDeleteModal(false);
      setSelectedRecord(null);
      loadData();
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      toast.error(error.response?.data?.message || 'Failed to delete maintenance record');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusVariant = (status) => {
    if (status === 'completed') return 'success';
    if (status === 'overdue') return 'danger';
    return 'warning';
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.45rem' }}>Maintenance Management</h1>
          <p style={{ color: '#64748b' }}>Schedule maintenance tasks and monitor completion status.</p>
        </div>
        <button
          onClick={() => setShowScheduleModal(true)}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            borderRadius: '12px',
            padding: '0.8rem 1.2rem',
            fontWeight: '600',
          }}
        >
          Schedule Maintenance
        </button>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {['', 'pending', 'completed', 'overdue'].map((status) => (
          <button
            key={status || 'all'}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '9999px',
              border: statusFilter === status ? 'none' : '1px solid #cbd5e1',
              backgroundColor: statusFilter === status ? '#2563eb' : 'white',
              color: statusFilter === status ? 'white' : '#475569',
              fontWeight: '600',
            }}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
          </button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '18px', border: '1px solid #e2e8f0', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontWeight: '700', color: '#0f172a' }}>
          Maintenance Records ({filteredMaintenances.length})
        </div>

        {loading ? (
          <Loader text="Loading maintenance records..." />
        ) : filteredMaintenances.length === 0 ? (
          <div style={{ padding: '1.25rem' }}>
            <EmptyState title="No maintenance records found" description="Scheduled maintenance tasks will appear here." />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  {['#', 'Equipment', 'Technician', 'Scheduled Date', 'Completed Date', 'Status', 'Notes', 'Actions'].map((label) => (
                    <th key={label} style={{ textAlign: label === '#' ? 'center' : 'left', padding: '0.9rem 1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: '700' }}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMaintenances.map((record, index) => (
                  <tr key={record.id} style={{ borderTop: '1px solid #e2e8f0', backgroundColor: record.status === 'overdue' ? '#fff5f5' : index % 2 ? '#fcfdff' : 'white' }}>
                    <td style={{ padding: '0.95rem 1rem', textAlign: 'center', color: '#64748b' }}>{index + 1}</td>
                    <td style={{ padding: '0.95rem 1rem', fontWeight: '600', color: '#0f172a' }}>{record.Equipment?.name || 'Unknown'}</td>
                    <td style={{ padding: '0.95rem 1rem', color: '#475569' }}>{record.technician?.name || 'Unassigned'}</td>
                    <td style={{ padding: '0.95rem 1rem', color: '#475569' }}>{new Date(record.scheduledDate).toLocaleDateString()}</td>
                    <td style={{ padding: '0.95rem 1rem', color: '#475569' }}>{record.completedDate ? new Date(record.completedDate).toLocaleDateString() : '-'}</td>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <Badge variant={getStatusVariant(record.status)} size="sm">{record.status}</Badge>
                    </td>
                    <td style={{ padding: '0.95rem 1rem', color: '#64748b', maxWidth: '280px' }} title={record.notes || ''}>
                      {record.notes ? `${record.notes.slice(0, 70)}${record.notes.length > 70 ? '...' : ''}` : '-'}
                    </td>
                    <td style={{ padding: '0.95rem 1rem' }}>
                      <button
                        onClick={() => {
                          setSelectedRecord(record);
                          setShowDeleteModal(true);
                        }}
                        style={{ padding: '0.45rem 0.85rem', borderRadius: '10px', backgroundColor: '#dc2626', color: 'white', fontWeight: '600' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={showScheduleModal} onClose={() => { setShowScheduleModal(false); resetForm(); }} title="Schedule Maintenance">
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '600', color: '#374151' }}>Equipment <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={formData.equipmentId}
              onChange={(e) => setFormData((prev) => ({ ...prev, equipmentId: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: errors.equipmentId ? '1px solid #dc2626' : '1px solid #cbd5e1', borderRadius: '12px' }}
            >
              <option value="">Select equipment</option>
              {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {errors.equipmentId && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.equipmentId}</p>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '600', color: '#374151' }}>Technician <span style={{ color: '#dc2626' }}>*</span></label>
            <select
              value={formData.technicianId}
              onChange={(e) => setFormData((prev) => ({ ...prev, technicianId: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: errors.technicianId ? '1px solid #dc2626' : '1px solid #cbd5e1', borderRadius: '12px' }}
            >
              <option value="">Select technician</option>
              {technicians.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {errors.technicianId && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.technicianId}</p>}
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '600', color: '#374151' }}>Scheduled Date <span style={{ color: '#dc2626' }}>*</span></label>
            <input
              type="date"
              min={todayString}
              value={formData.scheduledDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, scheduledDate: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem', border: errors.scheduledDate ? '1px solid #dc2626' : '1px solid #cbd5e1', borderRadius: '12px' }}
            />
            {errors.scheduledDate && <p style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '0.25rem' }}>{errors.scheduledDate}</p>}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.45rem', fontWeight: '600', color: '#374151' }}>Notes</label>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any special instructions for technician"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #cbd5e1', borderRadius: '12px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => { setShowScheduleModal(false); resetForm(); }} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#334155' }}>Cancel</button>
            <button type="submit" disabled={submitting} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', fontWeight: '600', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedRecord(null); }} title="Delete Maintenance Record" size="sm">
        <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>Are you sure you want to delete this maintenance record?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => { setShowDeleteModal(false); setSelectedRecord(null); }} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#334155' }}>Cancel</button>
          <button onClick={handleDelete} disabled={submitting} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#dc2626', color: 'white', fontWeight: '600', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Maintenance;
