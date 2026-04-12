import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await issueService.getPending();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await issueService.approve(id);
      toast.success('Request approved. Equipment issued.');
      loadRequests();
    } catch (error) {
      console.error('Approve failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve request');
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
      loadRequests();
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
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

  const isOutOfStock = (item) => {
    return item?.quantity === 0;
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading requests...</div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '0.5rem',
              letterSpacing: '-0.025em'
            }}>Pending Equipment Requests</h1>
            <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Review and approve employee requests</p>
          </div>
          {requests.length > 0 && (
            <span style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              color: '#92400e',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}>
              {requests.length} Pending
            </span>
          )}
        </div>
      </div>

      {requests.length === 0 ? (
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '4rem 2rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            No pending requests
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>All caught up! No employee requests waiting for approval.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((request) => {
            const equipment = request.Equipment;
            const outOfStock = isOutOfStock(equipment);

            return (
              <div key={request.id} style={{
                background: 'var(--white)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--border-light)',
                overflow: 'hidden',
                transition: 'all 0.2s'
              }}>
                <div style={{
                  padding: '1.5rem',
                  borderBottom: '1px solid var(--border-light)',
                  background: outOfStock ? '#fef2f2' : 'transparent'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: '#0f172a',
                          margin: 0
                        }}>
                          {equipment?.name || `Equipment #${request.equipmentId}`}
                        </h3>
                        {outOfStock && (
                          <span style={{
                            background: '#fee2e2',
                            color: '#991b1b',
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: '700'
                          }}>
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                        Requested by: <strong style={{ color: '#0f172a' }}>{request.User?.name || `User #${request.userId}`}</strong>
                        {request.User?.email && <span style={{ color: '#94a3b8' }}> ({request.User.email})</span>}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        background: '#e0e7ff',
                        color: '#4338ca',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}>
                        Qty: {request.quantity}
                      </span>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1.5rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Expected Return</p>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0f172a' }}>
                        {request.requestedReturnDate ? new Date(request.requestedReturnDate).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Submitted</p>
                      <p style={{ fontSize: '0.9375rem', fontWeight: '600', color: '#0f172a' }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {equipment && (
                      <div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Available Stock</p>
                        <p style={{
                          fontSize: '0.9375rem',
                          fontWeight: '700',
                          color: outOfStock ? '#dc2626' : '#0f172a'
                        }}>
                          {equipment.quantity} units
                        </p>
                      </div>
                    )}
                  </div>

                  {request.remarks && (
                    <div style={{
                      background: '#f8fafc',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem'
                    }}>
                      <p style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Purpose / Remarks</p>
                      <p style={{ fontSize: '0.9375rem', color: '#475569', fontStyle: 'italic', margin: 0 }}>
                        "{request.remarks}"
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      onClick={() => setShowRejectModal(request.id)}
                      disabled={actionLoading === request.id}
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: 'transparent',
                        color: '#dc2626',
                        border: '2px solid #dc2626',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: actionLoading === request.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={actionLoading === request.id || outOfStock}
                      title={outOfStock ? 'Cannot approve - no stock available' : ''}
                      style={{
                        padding: '0.625rem 1.25rem',
                        background: outOfStock
                          ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: (actionLoading === request.id || outOfStock) ? 'not-allowed' : 'pointer',
                        boxShadow: outOfStock ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                        opacity: outOfStock ? 0.6 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      {actionLoading === request.id ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            maxWidth: '500px',
            width: '90%'
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
              Reject Request
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Please provide a reason for rejection. The employee will see this message.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason for rejection (employee will see this)..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.875rem',
                border: '2px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
                resize: 'vertical',
                outline: 'none'
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
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
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
                  background: !rejectReason.trim()
                    ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
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
    </ManagerLayout>
  );
};

export default PendingRequests;