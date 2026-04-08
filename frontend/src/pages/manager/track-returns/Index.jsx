import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const TrackReturns = () => {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getAll();
      setIssues(response.data || []);
    } catch (error) {
      console.error('Error loading issues:', error);
      toast.error('Failed to load issued equipment');
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      issue.Equipment?.name?.toLowerCase().includes(query) ||
      issue.User?.name?.toLowerCase().includes(query) ||
      issue.remarks?.toLowerCase().includes(query);
    return matchesSearch && issue.status === 'issued';
  });

  const handleReturn = async (issueId) => {
    try {
      setActionLoading(true);
      await issueService.return(issueId);
      toast.success('Equipment returned successfully');
      await loadIssues();
    } catch (error) {
      console.error('Return failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to process return');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Track Returns</h1>
        <p style={{ color: '#6b7280' }}>Accept returned equipment and update inventory stock.</p>
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Search issued equipment</label>
            <input
              type="text"
              placeholder="User, equipment, or notes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
            />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--light)' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Issued Equipment ({filteredIssues.length})</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading issued equipment...</div>
        ) : filteredIssues.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No issued equipment found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--light)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>User</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Qty</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Issued Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Return Date</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', color: '#111827' }}>{issue.User?.name || `User #${issue.userId}`}</td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{issue.Equipment?.name || `Equipment #${issue.equipmentId}`}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#111827' }}>{issue.quantity}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                    {issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '—'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <button
                      onClick={() => handleReturn(issue.id)}
                      disabled={actionLoading}
                      style={{
                        padding: '0.375rem 0.75rem',
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.25rem',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: actionLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Mark Returned
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ManagerLayout>
  );
};

export default TrackReturns;