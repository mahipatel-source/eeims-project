import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import equipmentService from '../../../services/equipmentService';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    pendingRequests: 0,
    activeIssues: 0,
    lowStockItems: 0
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [equipmentData, issuesData] = await Promise.all([
        equipmentService.getAll(),
        issueService.getAll()
      ]);

      const equipmentList = equipmentData.data || [];
      const issuesList = issuesData.data || [];

      const lowStock = equipmentList.filter(item => item.quantity <= item.minimumStock).length;
      const pending = issuesList.filter(i => i.status === 'pending');
      const issued = issuesList.filter(i => i.status === 'issued');

      setStats({
        totalEquipment: equipmentList.length,
        pendingRequests: pending.length,
        activeIssues: issued.length,
        lowStockItems: lowStock
      });

      setPendingRequests(pending.slice(0, 10));
      setRecentIssues(issuesList.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(id);
      await issueService.approve(id);
      toast.success('Request approved and equipment issued');
      loadDashboardData();
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
      loadDashboardData();
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(null);
    }
  };

  const StatCard = ({ title, value, icon, color, link, gradient }) => (
    <Link to={link} style={{
      display: 'block',
      background: 'var(--white)',
      borderRadius: 'var(--radius-xl)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow-md)',
      border: '1px solid var(--border-light)',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: gradient }}></div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.8125rem',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>{title}</p>
          <p style={{
            fontSize: '2.25rem',
            fontWeight: '800',
            color: '#0f172a',
            letterSpacing: '-0.025em'
          }}>{loading ? '...' : value}</p>
        </div>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-lg)',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {icon}
        </div>
      </div>
    </Link>
  );

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

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#64748b' }}>Loading dashboard...</div>
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
        }}>Manager Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>Overview of equipment, requests, and inventory status</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Equipment"
          value={stats.totalEquipment}
          icon="📦"
          gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
          link="/manager/equipment-view"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon="⏳"
          gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          link="/manager/pending-requests"
        />
        <StatCard
          title="Active Issues"
          value={stats.activeIssues}
          icon="📋"
          gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
          link="/manager/issue-history"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon="⚠️"
          gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          link="/manager/equipment-view"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem' }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: 0
            }}>Pending Approval Requests</h3>
            <Link to="/manager/pending-requests" style={{
              fontSize: '0.8125rem',
              color: '#6366f1',
              fontWeight: '600',
              textDecoration: 'none'
            }}>View All →</Link>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {pendingRequests.length > 0 ? (
              pendingRequests.map((request) => (
                <div key={request.id} style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--border-light)',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <p style={{ fontWeight: '600', color: '#0f172a', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
                        {request.Equipment?.name || `Equipment #${request.equipmentId}`}
                      </p>
                      <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                        Requested by: {request.User?.name || `User #${request.userId}`}
                      </p>
                    </div>
                    <span style={{
                      background: '#e0e7ff',
                      color: '#4338ca',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '9999px',
                      fontSize: '0.6875rem',
                      fontWeight: '600'
                    }}>
                      Qty: {request.quantity}
                    </span>
                  </div>

                  {request.remarks && (
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                      "{request.remarks}"
                    </p>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading === request.id}
                        style={{
                          padding: '0.375rem 0.875rem',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: actionLoading === request.id ? 'not-allowed' : 'pointer',
                          boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        {actionLoading === request.id ? '...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => setShowRejectModal(request.id)}
                        disabled={actionLoading === request.id}
                        style={{
                          padding: '0.375rem 0.875rem',
                          background: 'transparent',
                          color: '#dc2626',
                          border: '1px solid #dc2626',
                          borderRadius: 'var(--radius)',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: actionLoading === request.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✅</div>
                <p style={{ color: '#64748b' }}>No pending requests</p>
              </div>
            )}
          </div>
        </div>

        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: 0
            }}>Recent Issues</h3>
            <Link to="/manager/issue-history" style={{
              fontSize: '0.8125rem',
              color: '#6366f1',
              fontWeight: '600',
              textDecoration: 'none'
            }}>View All →</Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Equipment</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Employee</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Qty</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentIssues.length > 0 ? (
                  recentIssues.map((issue) => (
                    <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: '#0f172a' }}>
                        {issue.Equipment?.name || `Equipment #${issue.equipmentId}`}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', color: '#64748b' }}>
                        {issue.User?.name || '-'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                        {issue.quantity}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                        {getStatusBadge(issue.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                      No recent issues
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
              Please provide a reason for rejecting this request (employee will see this):
            </p>
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
                disabled={actionLoading}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  fontWeight: '600',
                  cursor: actionLoading ? 'not-allowed' : 'pointer'
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

export default ManagerDashboard;