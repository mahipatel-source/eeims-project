import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TechnicianLayout from '../../../components/layout/TechnicianLayout';
import maintenanceService from '../../../services/maintenanceService';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';

const MaintenanceHistory = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredTasks = tasks.filter(task => 
    !searchTerm || 
    task.Equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
      completed: { bg: '#dcfce7', color: '#166534', label: 'Completed' },
      overdue: { bg: '#fee2e2', color: '#991b1b', label: 'Overdue' },
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '600', background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const getRowStyle = (status) => {
    if (status === 'overdue') return { background: '#fef2f2' };
    if (status === 'pending') return { background: '#fffbeb' };
    return {};
  };

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const truncateNotes = (notes, maxLength = 50) => {
    if (!notes) return '—';
    return notes.length > maxLength ? notes.substring(0, maxLength) + '...' : notes;
  };

  if (loading) {
    return (
      <TechnicianLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading history...</div>
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
        }}>Maintenance History</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Complete record of all your maintenance work</p>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        padding: '1rem 1.5rem',
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)'
      }}>
        {[
          { label: 'Total', value: counts.total },
          { label: 'Completed', value: counts.completed },
          { label: 'Pending', value: counts.pending },
          { label: 'Overdue', value: counts.overdue },
        ].map((item, index) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>{item.value}</span>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>{item.label}</span>
            {index < 3 && <span style={{ color: '#cbd5e1', marginLeft: '0.75rem' }}>|</span>}
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)',
        marginBottom: '1.5rem'
      }}>
        <input
          type="text"
          placeholder="Search by equipment name..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
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

      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
              <tr>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>#</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Equipment</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Scheduled</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Completed</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task, index) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid var(--border-light)', ...getRowStyle(task.status) }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <p style={{ fontWeight: '600', color: '#0f172a', margin: 0 }}>{task.Equipment?.name || `Equipment #${task.equipmentId}`}</p>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.875rem', color: '#475569' }}>
                      {formatDate(task.scheduledDate)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.875rem', color: task.completedDate ? '#059669' : '#64748b', fontWeight: task.completedDate ? '600' : '400' }}>
                      {formatDate(task.completedDate)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                      {getStatusBadge(task.status)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span 
                        title={task.completionNotes || task.notes || 'No notes'}
                        style={{ 
                          fontSize: '0.8125rem', 
                          color: '#64748b',
                          cursor: 'help'
                        }}
                      >
                        {truncateNotes(task.completionNotes || task.notes)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🔧</div>
                    <p style={{ fontSize: '1rem', fontWeight: '500' }}>No maintenance history found</p>
                    {searchTerm && <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Try adjusting your search</p>}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc'
          }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTasks.length)} of {filteredTasks.length} records
            </span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === 1 ? '#f1f5f9' : 'var(--white)',
                  color: currentPage === 1 ? '#94a3b8' : '#475569',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background: currentPage === totalPages ? '#f1f5f9' : 'var(--white)',
                  color: currentPage === totalPages ? '#94a3b8' : '#475569',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.8125rem',
                  fontWeight: '500',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </TechnicianLayout>
  );
};

export default MaintenanceHistory;