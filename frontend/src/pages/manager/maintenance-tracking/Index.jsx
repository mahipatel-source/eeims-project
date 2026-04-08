import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import equipmentService from '../../../services/equipmentService';
import maintenanceService from '../../../services/maintenanceService';
import userService from '../../../services/userService';
import toast from 'react-hot-toast';

const MaintenanceTracking = () => {
  const [equipment, setEquipment] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [form, setForm] = useState({
    equipmentId: '',
    technicianId: '',
    scheduledDate: '',
    notes: '',
    type: 'repair',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [equipmentRes, techniciansRes, maintenanceRes] = await Promise.all([
        equipmentService.getAll(),
        userService.getAll(),
        maintenanceService.getAll(),
      ]);

      const equipmentData = equipmentRes.data || [];
      const techniciansData = (techniciansRes.data || []).filter((item) => item.role === 'technician');
      const maintenanceData = maintenanceRes.data || [];

      setEquipment(equipmentData);
      setTechnicians(techniciansData);
      setMaintenance(maintenanceData);
      setForm((prev) => ({
        ...prev,
        equipmentId: equipmentData[0]?.id || prev.equipmentId,
        technicianId: techniciansData[0]?.id || prev.technicianId,
      }));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.Equipment?.name?.toLowerCase().includes(query) ||
      item.User?.name?.toLowerCase().includes(query) ||
      item.notes?.toLowerCase().includes(query);
    return matchesSearch;
  });

  const selectedEquipment = equipment.find((item) => item.id === Number(form.equipmentId));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.equipmentId || !form.technicianId || !form.scheduledDate) {
      toast.error('Please select equipment, technician, and schedule date');
      return;
    }

    setSubmitting(true);

    try {
      await maintenanceService.create({
        equipmentId: form.equipmentId,
        technicianId: form.technicianId,
        scheduledDate: form.scheduledDate,
        notes: form.notes,
        type: form.type,
      });

      toast.success('Maintenance scheduled successfully');
      setForm((prev) => ({
        ...prev,
        scheduledDate: '',
        notes: '',
        type: 'repair',
      }));
      await loadData();
    } catch (error) {
      console.error('Maintenance creation failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to schedule maintenance');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: '#fef3c7', text: '#92400e', label: '⏳ Pending' },
      in_progress: { bg: '#dbeafe', text: '#0c4a6e', label: '🔄 In Progress' },
      completed: { bg: '#dcfce7', text: '#166534', label: '✅ Completed' },
    };
    return colors[status] || { bg: '#e5e7eb', text: '#374151', label: status || 'Unknown' };
  };

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Maintenance Tracking</h1>
        <p style={{ color: '#6b7280' }}>Mark damaged items or send equipment for repair and maintenance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        <div>
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow)',
              border: '1px solid var(--border)',
              marginBottom: '2rem'
            }}
          >
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Schedule Maintenance</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
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

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Technician</label>
                <select
                  value={form.technicianId}
                  onChange={(e) => handleChange('technicianId', e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
                >
                  {technicians.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
                  >
                    <option value="repair">Repair</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inspection">Inspection</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Scheduled Date</label>
                  <input
                    type="date"
                    value={form.scheduledDate}
                    onChange={(e) => handleChange('scheduledDate', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Describe the issue or maintenance needed"
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
                {submitting ? 'Scheduling...' : 'Schedule Maintenance'}
              </button>
            </div>
          </form>

          <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Search maintenance</label>
                <input
                  type="text"
                  placeholder="Equipment, technician, or notes"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
                />
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', overflowX: 'auto' }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--light)' }}>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Maintenance Records ({filteredMaintenance.length})</h3>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading maintenance records...</div>
            ) : filteredMaintenance.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No maintenance records found.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: 'var(--light)' }}>
                  <tr>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Technician</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Type</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Scheduled</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaintenance.map((item) => {
                    const status = getStatusColor(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem', color: '#111827' }}>{item.Equipment?.name || `Equipment #${item.equipmentId}`}</td>
                        <td style={{ padding: '1rem', color: '#6b7280' }}>{item.User?.name || `Technician #${item.technicianId}`}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#111827' }}>{item.type}</td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: status.bg, color: status.text, borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{new Date(item.scheduledDate).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          height: 'fit-content'
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
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Serial Number</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{selectedEquipment.serialNumber || 'Not assigned'}</p>
              </div>
              <div>
                <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>Current Stock</p>
                <p style={{ fontWeight: '600', color: selectedEquipment.quantity <= selectedEquipment.minimumStock ? '#b91c1c' : '#15803d' }}>{selectedEquipment.quantity}</p>
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

export default MaintenanceTracking;