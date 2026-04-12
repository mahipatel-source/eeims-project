import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import maintenanceService from '../../../services/maintenanceService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const MySchedule = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getByTechnician(user.id);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
      completed: { bg: '#dcfce7', color: '#166534', label: 'Completed' },
      overdue: { bg: '#fee2e2', color: '#991b1b', label: 'Overdue' },
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '600', background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const getBorderColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      completed: '#10b981',
      overdue: '#dc2626',
    };
    return colors[status] || '#6b7280';
  };

  const StatCard = ({ label, count, color, gradient }) => (
    <div style={{
      background: 'var(--white)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.25rem',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-light)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: gradient }}></div>
      <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ fontSize: '1.75rem', fontWeight: '800', color: color }}>{count}</p>
    </div>
  );

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ];

  const getEmptyMessage = (filter) => {
    const messages = {
      all: 'No maintenance tasks assigned yet',
      pending: 'No pending tasks. Great work!',
      completed: 'No completed tasks yet',
      overdue: 'No overdue tasks. Keep it up!',
    };
    return messages[filter] || 'No tasks found';
  };

  if (loading) {
    return (
      <TechnicianLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading your schedule...</div>
        </div>
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>My Schedule</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Your assigned maintenance tasks</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatCard label="Total Assigned" count={counts.all} color="#2563eb" gradient="linear-gradient(90deg, #3b82f6, #1d4ed8)" />
        <StatCard label="Pending Tasks" count={counts.pending} color="#f59e0b" gradient="linear-gradient(90deg, #f59e0b, #d97706)" />
        <StatCard label="Completed" count={counts.completed} color="#10b981" gradient="linear-gradient(90deg, #10b981, #059669)" />
        <StatCard label="Overdue" count={counts.overdue} color="#dc2626" gradient="linear-gradient(90deg, #ef4444, #dc2626)" />
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: '0.625rem 1.25rem',
              background: filter === tab.key ? 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' : 'var(--white)',
              color: filter === tab.key ? 'white' : '#475569',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: filter === tab.key ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
            }}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            {getEmptyMessage(filter)}
          </h3>
          <p style={{ color: '#64748b' }}>Tasks assigned to you will appear here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredTasks.map((task) => {
            const isOverdue = task.status === 'overdue';
            return (
              <div key={task.id} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)',
                borderLeft: `4px solid ${getBorderColor(task.status)}`,
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-lg)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
              >
                <div style={{
                  padding: '1.5rem',
                  background: isOverdue ? '#fef2f2' : 'transparent'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: '700',
                        color: '#0f172a',
                        margin: 0,
                        marginBottom: '0.5rem'
                      }}>
                        {task.Equipment?.name || `Equipment #${task.equipmentId}`}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                        <span>📅</span>
                        <span>Scheduled: {task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString() : 'Not set'}</span>
                        {isOverdue && (
                          <span style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: '700',
                            marginLeft: '0.5rem'
                          }}>
                            OVERDUE
                          </span>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>

                  {task.notes && (
                    <div style={{
                      background: '#f8fafc',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Notes</p>
                      <p style={{ fontSize: '0.875rem', color: '#475569', fontStyle: 'italic', margin: 0 }}>{task.notes}</p>
                    </div>
                  )}

                  {task.status === 'completed' && task.completedDate && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.875rem', color: '#059669', fontWeight: '600' }}>
                        ✓ Completed on {new Date(task.completedDate).toLocaleDateString()}
                      </p>
                      {task.completionNotes && (
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{task.completionNotes}</p>
                      )}
                    </div>
                  )}

                  {(task.status === 'pending' || task.status === 'overdue') && (
                    <Link
                      to={`/technician/log-maintenance?id=${task.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.625rem 1.25rem',
                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
                      }}
                    >
                      <span>🔧</span>
                      Log Completion
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </TechnicianLayout>
  );
};

export default MySchedule;