import { useState, useEffect } from 'react';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Loader from '../../../components/ui/Loader';
import maintenanceService from '../../../services/maintenanceService';
import equipmentService from '../../../services/equipmentService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const LogMaintenance = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksRes, equipmentRes] = await Promise.all([
        maintenanceService.getByTechnician(user.id),
        equipmentService.getAll(),
      ]);
      setTasks((tasksRes.data || []).filter(t => t.status === 'pending'));
      setEquipment(equipmentRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const selectedTaskData = tasks.find(t => t.id === parseInt(selectedTask));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) {
      toast.error('Please select a task');
      return;
    }

    try {
      setSubmitting(true);
      await maintenanceService.complete(selectedTask, { notes });
      toast.success('Maintenance logged successfully');
      setSelectedTask('');
      setNotes('');
      loadData();
    } catch (error) {
      console.error('Error logging maintenance:', error);
      toast.error(error.response?.data?.message || 'Failed to log maintenance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <TechnicianLayout>
        <Loader text="Loading..." />
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
          Log Maintenance
        </h1>
        <p style={{ color: '#6b7280' }}>
          Complete maintenance tasks and add notes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Form */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Complete Maintenance Task</h2>
          
          <form onSubmit={handleSubmit}>
            <Select
              label="Select Pending Task"
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              options={tasks.map(t => ({
                value: t.id,
                label: `${t.Equipment?.name || 'Equipment #' + t.equipmentId} - ${new Date(t.scheduledDate).toLocaleDateString()}`
              }))}
              placeholder="Select a task"
              required
            />

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                Completion Notes <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what was done..."
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
              {submitting ? 'Submitting...' : 'Complete Maintenance'}
            </Button>
          </form>
        </div>

        {/* Task Preview */}
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Task Details</h2>
          
          {selectedTaskData ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Equipment</p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {selectedTaskData.Equipment?.name || `Equipment #${selectedTaskData.equipmentId}`}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Scheduled Date</p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {new Date(selectedTaskData.scheduledDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</p>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                }}>
                  Pending
                </span>
              </div>
              {selectedTaskData.notes && (
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Original Notes</p>
                  <p style={{ fontSize: '0.875rem', color: '#374151', backgroundColor: '#f9fafb', padding: '0.75rem', borderRadius: '0.375rem' }}>
                    {selectedTaskData.notes}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              Select a task to view details
            </p>
          )}
        </div>
      </div>
    </TechnicianLayout>
  );
};

export default LogMaintenance;
