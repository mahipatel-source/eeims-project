import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const IssuePart = () => {
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await issueService.getAll();
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      request.Equipment?.name?.toLowerCase().includes(query) ||
      request.User?.name?.toLowerCase().includes(query) ||
      request.remarks?.toLowerCase().includes(query) ||
      request.status?.toLowerCase().includes(query);
    const matchesStatus = !filterStatus || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusLabel = (status) => {
    const map = {
      pending: { label: 'Pending', bg: '#fef3c7', color: '#92400e' },
      approved: { label: 'Approved', bg: '#dcfce7', color: '#166534' },
      issued: { label: 'Issued', bg: '#dbeafe', color: '#0c4a6e' },
      returned: { label: 'Returned', bg: '#dbeafe', color: '#0c4a6e' },
      rejected: { label: 'Rejected', bg: '#fee2e2', color: '#991b1b' },
    };
    return map[status] || { label: status || 'Unknown', bg: '#e5e7eb', color: '#374151' };
  };

  const handleApprove = async (id) => {
    try {
      setActionLoading(true);
      await issueService.approve(id);
      toast.success('Request approved and issued');
      await loadRequests();
    } catch (error) {
      console.error('Approve failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to approve request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading(true);
      await issueService.reject(id);
      toast.success('Request rejected');
      await loadRequests();
    } catch (error) {
      console.error('Reject failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>Handle Equipment Requests</h1>
        <p style={{ color: '#6b7280' }}>Review pending user requests, then approve or reject based on stock availability and policy.</p>
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', padding: '1.5rem', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Search requests</label>
            <input
              type="text"
              placeholder="User, equipment, or status"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600' }}>Status filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.95rem' }}
            >
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="issued">Issued</option>
              <option value="returned">Returned</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', overflowX: 'auto' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--light)' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Pending Requests</h2>
        </div>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No equipment requests found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--light)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Requester</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Qty</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Requested</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Return</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => {
                const status = getStatusLabel(request.status);
                return (
                  <tr key={request.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '1rem', color: '#111827' }}>{request.User?.name || `User #${request.userId}`}</td>
                    <td style={{ padding: '1rem', color: '#6b7280' }}>{request.Equipment?.name || `Equipment #${request.equipmentId}`}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#111827' }}>{request.quantity}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: status.bg, color: status.color, borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600' }}>
                        {status.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{new Date(request.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{request.returnDate ? new Date(request.returnDate).toLocaleDateString() : '—'}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={actionLoading}
                              style={{ padding: '0.375rem 0.75rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              disabled={actionLoading}
                              style={{ padding: '0.375rem 0.75rem', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '0.25rem', fontSize: '0.875rem', fontWeight: '500', cursor: actionLoading ? 'not-allowed' : 'pointer' }}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.status !== 'pending' && <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>No actions</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </ManagerLayout>
  );
};

export default IssuePart;
