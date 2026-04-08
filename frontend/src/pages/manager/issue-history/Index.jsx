import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const ManagerIssueHistory = () => {
  const [issues, setIssues] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const issuesRes = await issueService.getAll();
      setIssues(issuesRes.data || []);
    } catch (error) {
      console.error('Error loading issues:', error);
      toast.error('Failed to load issue data');
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      issue.Equipment?.name?.toLowerCase().includes(query) ||
      issue.User?.name?.toLowerCase().includes(query) ||
      issue.remarks?.toLowerCase().includes(query) ||
      issue.status?.toLowerCase().includes(query);
    const matchesStatus = !filterStatus || issue.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getEquipmentName = (issue) => issue.Equipment?.name || `Equipment #${issue.equipmentId}`;

  const getStatusColor = (status) => {
    const colors = {
      requested: { bg: '#fef3c7', text: '#92400e', label: '🟡 Requested' },
      issued: { bg: '#dcfce7', text: '#166534', label: '✅ Issued' },
      returned: { bg: '#dbeafe', text: '#0c4a6e', label: '🔵 Returned' },
      rejected: { bg: '#fee2e2', text: '#991b1b', label: '⛔ Rejected' },
    };
    return colors[status] || { bg: '#e5e7eb', text: '#374151', label: status || 'Unknown' };
  };

  const openDetailModal = (issue) => {
    setSelectedIssue(issue);
    setShowDetail(true);
  };

  const closeDetailModal = () => {
    setShowDetail(false);
    setSelectedIssue(null);
  };

  const handleApprove = async (issueId) => {
    try {
      setLoading(true);
      await issueService.approve(issueId);
      toast.success('Request approved and issued.');
      await loadData();
    } catch (error) {
      console.error('Approve request failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve request');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (issueId) => {
    try {
      setLoading(true);
      await issueService.reject(issueId);
      toast.success('Request rejected.');
      await loadData();
    } catch (error) {
      console.error('Reject request failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject request');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (issueId) => {
    try {
      setLoading(true);
      await issueService.return(issueId);
      toast.success('Equipment returned successfully.');
      await loadData();
    } catch (error) {
      console.error('Return failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to return equipment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading issues...</div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>Request History</h1>
        <p style={{ color: '#6b7280' }}>Review all equipment requests and issued items.</p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Search</label>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.5rem'
            }}>Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '0.875rem'
              }}
            >
              <option value="">All Statuses</option>
              <option value="requested">Requested</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--light)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827'
          }}>Requests ({filteredIssues.length})</h3>
        </div>

        {filteredIssues.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--light)' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Requester</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Quantity</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Requested On</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Return Date</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => {
                  const statusColor = getStatusColor(issue.status);
                  return (
                    <tr key={issue.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1rem', color: '#111827' }}>{issue.User?.name || `User #${issue.userId}`}</td>
                      <td style={{ padding: '1rem', color: '#6b7280' }}>{getEquipmentName(issue)}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#111827' }}>{issue.quantity}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          {statusColor.label}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{new Date(issue.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '—'}</td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => openDetailModal(issue)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              backgroundColor: '#2563eb',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                          {issue.status === 'requested' && (
                            <>
                              <button
                                onClick={() => handleApprove(issue.id)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#16a34a',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(issue.id)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  backgroundColor: '#dc2626',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.25rem',
                                  fontSize: '0.875rem',
                                  fontWeight: '500',
                                  cursor: 'pointer'
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {issue.status === 'issued' && (
                            <button
                              onClick={() => handleReturn(issue.id)}
                              style={{
                                padding: '0.375rem 0.75rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.25rem',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                cursor: 'pointer'
                              }}
                            >
                              Return
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <p>{searchTerm || filterStatus ? 'No requests found matching your filters.' : 'No requests found.'}</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedIssue && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={closeDetailModal}>
          <div style={{
            backgroundColor: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '1.5rem'
            }}>{selectedIssue.Equipment?.name || `Equipment #${selectedIssue.equipmentId}`}</h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Requester</p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {selectedIssue.User?.name || `User #${selectedIssue.userId}`}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Status</p>
                <p style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: getStatusColor(selectedIssue.status).bg,
                  color: getStatusColor(selectedIssue.status).text,
                  borderRadius: '0.25rem',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}>
                  {getStatusColor(selectedIssue.status).label}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Requested on</p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {new Date(selectedIssue.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Return date</p>
                <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>
                  {selectedIssue.returnDate ? new Date(selectedIssue.returnDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Quantity</p>
              <p style={{ fontSize: '1rem', fontWeight: '600', color: '#111827' }}>{selectedIssue.quantity}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>Notes</p>
              <p style={{
                fontSize: '0.95rem',
                color: '#111827',
                backgroundColor: '#f9fafb',
                padding: '1rem',
                borderRadius: '0.5rem',
                lineHeight: '1.5'
              }}>
                {selectedIssue.remarks || 'No notes provided.'}
              </p>
            </div>

            <button
              onClick={closeDetailModal}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#e5e7eb',
                color: '#111827',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerIssueHistory;
