import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import issueService from '../../../services/issueService';
import UserLayout from '../../../components/layout/UserLayout';
import toast from 'react-hot-toast';

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const response = await issueService.getMyRequests();
      setRequests(response.data);
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (id) => {
    if (!window.confirm('Confirm return of this equipment?')) return;
    try {
      await issueService.returnEquipment(id);
      toast.success('Equipment returned successfully');
      loadRequests();
    } catch (err) {
      toast.error('Failed to return equipment');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
      approved: { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
      issued: { bg: '#dbeafe', color: '#2563eb', label: 'Issued' },
      returned: { bg: '#f1f5f9', color: '#64748b', label: 'Returned' },
      rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
    };
    const c = config[status] || config.pending;
    return (
      <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
        {c.label}
      </span>
    );
  };

  const tabs = ['all', 'pending', 'issued', 'returned', 'rejected'];

  const filteredRequests = activeTab === 'all'
    ? requests
    : requests.filter(r => r.status === activeTab);

  if (isLoading) return <UserLayout><div style={styles.loading}>Loading...</div></UserLayout>;

  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Requests</h1>
          <button style={styles.browseBtn} onClick={() => navigate('/user/browse')}>
            + New Request
          </button>
        </div>

        {/* tabs */}
        <div style={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              style={{ ...styles.tab, ...(activeTab === tab ? styles.activeTab : {}) }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span style={styles.tabCount}>
                {tab === 'all' ? requests.length : requests.filter(r => r.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* requests list */}
        {filteredRequests.length === 0 ? (
          <div style={styles.empty}>
            <p>No requests found</p>
            <button style={styles.browseBtn} onClick={() => navigate('/user/browse')}>
              Browse Equipment
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {filteredRequests.map(request => (
              <div key={request.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <h3 style={styles.equipName}>{request.Equipment?.name}</h3>
                    <p style={styles.requestDate}>
                      Requested on {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div style={styles.cardDetails}>
                  <span>Quantity: <strong>{request.quantity}</strong></span>
                  {request.issueDate && (
                    <span>Issued: <strong>{new Date(request.issueDate).toLocaleDateString()}</strong></span>
                  )}
                  {request.requestedReturnDate && (
                    <span>Return by: <strong>{new Date(request.requestedReturnDate).toLocaleDateString()}</strong></span>
                  )}
                  {request.returnDate && (
                    <span>Returned: <strong>{new Date(request.returnDate).toLocaleDateString()}</strong></span>
                  )}
                </div>

                {request.remarks && (
                  <p style={styles.remarks}>Remarks: {request.remarks}</p>
                )}

                {request.rejectionReason && (
                  <p style={styles.rejection}>Rejection reason: {request.rejectionReason}</p>
                )}

                {request.status === 'issued' && (
                  <button style={styles.returnBtn} onClick={() => handleReturn(request.id)}>
                    Return Equipment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

const styles = {
  container: { padding: '24px' },
  loading: { padding: '40px', textAlign: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b' },
  browseBtn: { padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' },
  tab: { padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' },
  activeTab: { background: '#2563eb', color: '#fff' },
  tabCount: { background: 'rgba(255,255,255,0.3)', padding: '1px 7px', borderRadius: '10px', fontSize: '11px' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  equipName: { fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' },
  requestDate: { fontSize: '13px', color: '#94a3b8' },
  cardDetails: { display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  remarks: { fontSize: '13px', color: '#64748b', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', marginTop: '8px' },
  rejection: { fontSize: '13px', color: '#dc2626', padding: '8px 12px', background: '#fee2e2', borderRadius: '6px', marginTop: '8px' },
  returnBtn: { marginTop: '12px', padding: '8px 20px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
};

export default MyRequests;