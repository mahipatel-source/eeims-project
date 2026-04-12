import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import maintenanceService from '../../../services/maintenanceService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const LogMaintenance = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [notes, setNotes] = useState('');

  const taskIdFromUrl = searchParams.get('id');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getByTechnician(user.id);
      const pendingTasks = (response.data || []).filter(t => t.status === 'pending' || t.status === 'overdue');
      setTasks(pendingTasks);
      
      if (taskIdFromUrl && pendingTasks.find(t => t.id === parseInt(taskIdFromUrl))) {
        setSelectedTaskId(taskIdFromUrl);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const selectedTask = tasks.find(t => t.id === parseInt(selectedTaskId));
  const isAlreadyCompleted = selectedTask && selectedTask.status === 'completed';
  const isValid = notes.trim().length >= 20;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTaskId) {
      toast.error('Please select a task');
      return;
    }
    
    if (!isValid) {
      toast.error('Please enter at least 20 characters in completion notes');
      return;
    }

    try {
      setSubmitting(true);
      await maintenanceService.complete(selectedTaskId, { notes: notes.trim() });
      toast.success('Maintenance logged successfully!');
      navigate('/technician/maintenance-history');
    } catch (error) {
      console.error('Error logging maintenance:', error);
      toast.error(error.response?.data?.message || 'Failed to log maintenance');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (loading) {
    return (
      <TechnicianLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading...</div>
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
        }}>Log Maintenance Completion</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Record your completed maintenance work</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
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
            <span>📋</span> Step 1: Select Task
          </h3>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>
              Select Maintenance Task *
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
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
              <option value="">-- Select a pending task --</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.Equipment?.name || `Equipment #${task.equipmentId}`} — Scheduled: {task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString('en-GB') : 'N/A'}
                </option>
              ))}
            </select>
          </div>

          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>📝</span> Step 2: Write Completion Notes
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.875rem' }}>
              Completion Notes <span style={{ color: '#dc2626' }}>*</span>
              <span style={{ fontWeight: '400', color: '#64748b', marginLeft: '0.5rem' }}>(Minimum 20 characters)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Describe what you did during maintenance...
Example:
- Inspected motor bearings — normal condition
- Replaced drive belt (old belt was worn)
- Lubricated all moving parts
- Cleaned electrical contacts
- Ran machine for 10 minutes — working normally
- Next service recommended in 30 days`}
              rows={10}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'var(--font-sans)'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ 
                fontSize: '0.8125rem', 
                color: notes.length < 20 ? '#dc2626' : '#10b981',
                fontWeight: '600'
              }}>
                {notes.length} characters
              </span>
              {notes.length < 20 && (
                <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>Minimum 20 characters required</span>
              )}
            </div>
          </div>

          <div style={{
            background: selectedTask ? '#f0fdf4' : '#f8fafc',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginTop: '1.5rem'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.75rem' }}>
              ✓ Step 3: Confirm and Submit
            </h4>
            {selectedTask ? (
              <p style={{ fontSize: '0.9375rem', color: '#475569', margin: 0 }}>
                You are marking <strong style={{ color: '#0f172a' }}>{selectedTask.Equipment?.name || `Equipment #${selectedTask.equipmentId}`}</strong> as <strong>COMPLETED</strong><br />
                Completion date will be set to today: <strong style={{ color: '#0f766e' }}>{today}</strong>
              </p>
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Select a task to see submission summary
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
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
              form="maintenance-form"
              disabled={submitting || !selectedTaskId || !isValid || isAlreadyCompleted}
              style={{
                flex: 2,
                padding: '0.875rem',
                background: !selectedTaskId || !isValid || isAlreadyCompleted
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                  : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: '700',
                cursor: (!selectedTaskId || !isValid || isAlreadyCompleted || submitting) ? 'not-allowed' : 'pointer',
                boxShadow: selectedTaskId && isValid && !isAlreadyCompleted ? '0 4px 14px rgba(13, 148, 136, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {submitting ? (
                <>Processing...</>
              ) : isAlreadyCompleted ? (
                <>Already Completed</>
              ) : (
                <>
                  <span>✓</span> Mark as Completed
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <div style={{
            background: selectedTask ? (isAlreadyCompleted ? '#fef3c7' : '#f0fdf4') : 'var(--white)',
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
            }}>Task Details</h3>

            {selectedTask ? (
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Equipment Name</p>
                  <p style={{ fontSize: '1rem', fontWeight: '700', color: '#0f172a' }}>
                    {selectedTask.Equipment?.name || `Equipment #${selectedTask.equipmentId}`}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Scheduled Date</p>
                    <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0f172a' }}>
                      {selectedTask.scheduledDate ? new Date(selectedTask.scheduledDate).toLocaleDateString('en-GB') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Status</p>
                    <span style={{
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: '600',
                      background: selectedTask.status === 'overdue' ? '#fee2e2' : '#fef3c7',
                      color: selectedTask.status === 'overdue' ? '#991b1b' : '#92400e'
                    }}>
                      {selectedTask.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {selectedTask.notes && (
                  <div>
                    <p style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Admin Notes</p>
                    <div style={{
                      background: '#f8fafc',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <p style={{ fontSize: '0.875rem', color: '#475569', fontStyle: 'italic', margin: 0 }}>{selectedTask.notes}</p>
                    </div>
                  </div>
                )}

                {isAlreadyCompleted && (
                  <div style={{
                    background: '#fef3c7',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '600', margin: 0 }}>
                      ⚠️ This task is already marked as completed
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>
                Select a task to view details
              </p>
            )}
          </div>
        </div>
      </div>

      <form id="maintenance-form" onSubmit={handleSubmit} style={{ display: 'none' }}></form>
    </TechnicianLayout>
  );
};

export default LogMaintenance;