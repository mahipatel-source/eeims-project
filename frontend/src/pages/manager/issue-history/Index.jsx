import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const IssueHistory = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(null);

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
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await issueService.approve(id);
      toast.success('Request approved');
      loadIssues();
    } catch (error) {
      console.error('Approve failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }

    try {
      setActionLoading(id);
      await issueService.reject(id, rejectReason);
      toast.success('Request rejected');
      setShowRejectModal(null);
      setRejectReason('');
      loadIssues();
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReturn = async (id) => {
    try {
      setActionLoading(id);
      await issueService.returnIssue(id);
      toast.success('Equipment marked as returned');
      setShowReturnModal(null);
      loadIssues();
    } catch (error) {
      console.error('Return failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to mark as returned');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesTab = activeTab === 'all' || issue.status === activeTab;
    const matchesSearch = 
      issue.Equipment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.User?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'pending').length,
    issued: issues.filter(i => i.status === 'issued').length,
    returned: issues.filter(i => i.status === 'returned').length,
    rejected: issues.filter(i => i.status === 'rejected').length,
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
      approved: { bg: '#dcfce7', color: '#166534', label: 'Approved' },
      issued: { bg: '#dbeafe', color: '#1e40af', label: 'Issued' },
      returned: { bg: '#d1fae5', color: '#065f46', label: 'Returned' },
      rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
    };
    const s = styles[status] || styles.pending;
    return <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '600', background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const tabs = [
    { key: 'all', label: 'All', count: stats.total },
    { key: 'pending', label: 'Pending', count: stats.pending },
    { key: 'issued', label: 'Issued', count: stats.issued },
    { key: 'returned', label: 'Returned', count: stats.returned },
    { key: 'rejected', label: 'Rejected', count: stats.rejected },
  ];

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading issues...</div>
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
        }}>Issue History</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Complete record of all equipment issues</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '1rem',
              background: activeTab === tab.key ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'var(--white)',
              color: activeTab === tab.key ? 'white' : '#475569',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            <p style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>{tab.count}</p>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' }}>{tab.label}</p>
          </button>
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
          placeholder="Search by equipment or employee name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                <th style={{ padding: '0.875rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Issued To</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Qty</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Issue Date</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Expected Return</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Actual Return</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.length > 0 ? (
                filteredIssues.map((issue, index) => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '600' }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <p style={{ fontWeight: '600', color: '#0f172a', margin: 0 }}>{issue.Equipment?.name || `Equipment #${issue.equipmentId}`}</p>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#475569' }}>
                      {issue.User?.name || '-'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', fontWeight: '700' }}>
                      {issue.quantity}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                      {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                      {issue.requestedReturnDate ? new Date(issue.requestedReturnDate).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                      {issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                      {getStatusBadge(issue.status)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'center' }}>
                      {issue.status === 'issued' && (
                        <button
                          onClick={() => setShowReturnModal(issue.id)}
                          style={{
                            padding: '0.375rem 0.875rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            cursor: actionLoading === issue.id ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Mark Returned
                        </button>
                      )}
                      {issue.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleApprove(issue.id)}
                            disabled={actionLoading === issue.id}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.6875rem',
                              fontWeight: '600',
                              cursor: actionLoading === issue.id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => setShowRejectModal(issue.id)}
                            disabled={actionLoading === issue.id}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: '#dc2626',
                              color: 'white',
                              border: 'none',
                              borderRadius: 'var(--radius)',
                              fontSize: '0.6875rem',
                              fontWeight: '600',
                              cursor: actionLoading === issue.id ? 'not-allowed' : 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {(issue.status === 'returned' || issue.status === 'rejected') && (
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📋</div>
                    <p style={{ fontSize: '1rem', fontWeight: '500' }}>No issue records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showRejectModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => { setShowRejectModal(null); setRejectReason(''); }}>
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            maxWidth: '450px',
            width: '90%'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>
              Reject Request
            </h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowRejectModal(null); setRejectReason(''); }}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(showRejectModal)}
                disabled={actionLoading || !rejectReason.trim()}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  cursor: (!rejectReason.trim() || actionLoading) ? 'not-allowed' : 'pointer'
                }}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReturnModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowReturnModal(null)}>
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.75rem',
            maxWidth: '400px',
            width: '90%'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Confirm Equipment Return
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.5rem' }}>
              Are you sure you want to mark this equipment as returned? This will increase the available stock.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowReturnModal(null)}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleReturn(showReturnModal)}
                disabled={actionLoading}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  cursor: actionLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {actionLoading ? 'Processing...' : 'Confirm Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default IssueHistory;