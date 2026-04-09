import { useState, useEffect } from 'react';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import Badge from '../../../components/ui/Badge';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import maintenanceService from '../../../services/maintenanceService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const MaintenanceHistory = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await maintenanceService.getByTechnician(user.id);
      setTasks(response.data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load maintenance history');
    } finally {
      setLoading(false);
    }
  };

  const counts = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: { variant: 'warning', label: 'Pending' },
      completed: { variant: 'success', label: 'Completed' },
      overdue: { variant: 'danger', label: 'Overdue' },
    };
    const style = map[status] || { variant: 'default', label: status };
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  if (loading) {
    return (
      <TechnicianLayout>
        <Loader text="Loading history..." />
      </TechnicianLayout>
    );
  }

  return (
    <TechnicianLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
          Maintenance History
        </h1>
        <p style={{ color: '#6b7280' }}>
          View all your completed and pending maintenance tasks.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Tasks', count: counts.total, color: '#2563eb' },
          { label: 'Pending', count: counts.pending, color: '#f59e0b' },
          { label: 'Completed', count: counts.completed, color: '#16a34a' },
          { label: 'Overdue', count: counts.overdue, color: '#dc2626' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${item.color}`,
            }}
          >
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>{item.label}</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontWeight: '700', color: item.color }}>{item.count}</p>
          </div>
        ))}
      </div>

      {/* History Table */}
      {tasks.length === 0 ? (
        <EmptyState
          icon="🔧"
          title="No maintenance history"
          description="You haven't completed any maintenance tasks yet."
        />
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Scheduled Date</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Completed Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>
                    {task.Equipment?.name || `Equipment #${task.equipmentId}`}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>
                    {new Date(task.scheduledDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>
                    {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {getStatusBadge(task.status)}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {task.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </TechnicianLayout>
  );
};

export default MaintenanceHistory;
