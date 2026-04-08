import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import issueService from '../../../services/issueService';
import equipmentService from '../../../services/equipmentService';
import UserLayout from '../../../components/layout/UserLayout';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState([]);
  const [availableEquipment, setAvailableEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [requestsRes, equipmentRes] = await Promise.all([
        issueService.getMyRequests(),
        equipmentService.getAll(),
      ]);
      setMyRequests(requestsRes.data);
      setAvailableEquipment(equipmentRes.data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // count requests by status
  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  const issuedCount = myRequests.filter(r => r.status === 'issued').length;
  const returnedCount = myRequests.filter(r => r.status === 'returned').length;
  const rejectedCount = myRequests.filter(r => r.status === 'rejected').length;

  if (isLoading) return <UserLayout><div style={styles.loading}>Loading...</div></UserLayout>;

  return (
    <UserLayout>
      <div style={styles.container}>
        {/* welcome header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome, {user?.name}!</h1>
          <p style={styles.subtitle}>Manage your equipment requests and returns.</p>
        </div>

        {/* KPI cards */}
        <div style={styles.cardGrid}>
          <div style={{ ...styles.card, borderTop: '4px solid #f59e0b' }}>
            <p style={styles.cardLabel}>Pending Requests</p>
            <p style={styles.cardValue}>{pendingCount}</p>
            <p style={styles.cardNote}>Awaiting approval</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #2563eb' }}>
            <p style={styles.cardLabel}>Active Issues</p>
            <p style={styles.cardValue}>{issuedCount}</p>
            <p style={styles.cardNote}>Currently with you</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #16a34a' }}>
            <p style={styles.cardLabel}>Returned</p>
            <p style={styles.cardValue}>{returnedCount}</p>
            <p style={styles.cardNote}>Successfully returned</p>
          </div>
          <div style={{ ...styles.card, borderTop: '4px solid #dc2626' }}>
            <p style={styles.cardLabel}>Rejected</p>
            <p style={styles.cardValue}>{rejectedCount}</p>
            <p style={styles.cardNote}>Request rejected</p>
          </div>
        </div>

        {/* quick actions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Actions</h2>
          <div style={styles.actionGrid}>
            <button style={styles.actionBtn} onClick={() => navigate('/user/browse')}>
              🔍 Browse Equipment
            </button>
            <button style={styles.actionBtn} onClick={() => navigate('/user/my-requests')}>
              📋 My Requests
            </button>
            <button style={styles.actionBtn} onClick={() => navigate('/user/history')}>
              📜 View History
            </button>
          </div>
        </div>

        {/* active issues */}
        {issuedCount > 0 && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Equipment With You</h2>
            <div style={styles.table}>
              <table style={styles.tableEl}>
                <thead>
                  <tr style={styles.tableHead}>
                    <th style={styles.th}>Equipment</th>
                    <th style={styles.th}>Quantity</th>
                    <th style={styles.th}>Issue Date</th>
                    <th style={styles.th}>Return By</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.filter(r => r.status === 'issued').map(issue => (
                    <tr key={issue.id} style={styles.tableRow}>
                      <td style={styles.td}>{issue.Equipment?.name}</td>
                      <td style={styles.td}>{issue.quantity}</td>
                      <td style={styles.td}>{new Date(issue.issueDate).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        {issue.requestedReturnDate
                          ? new Date(issue.requestedReturnDate).toLocaleDateString()
                          : 'Not specified'}
                      </td>
                      <td style={styles.td}>
                        <button
                          style={styles.returnBtn}
                          onClick={() => handleReturn(issue.id)}
                        >
                          Return
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );

  async function handleReturn(id) {
    if (!window.confirm('Are you sure you want to return this equipment?')) return;
    try {
      await issueService.returnEquipment(id);
      toast.success('Equipment returned successfully');
      loadDashboardData();
    } catch (err) {
      toast.error('Failed to return equipment');
    }
  }
};

const styles = {
  container: { padding: '24px' },
  loading: { padding: '40px', textAlign: 'center', fontSize: '16px' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardLabel: { fontSize: '13px', color: '#64748b', marginBottom: '8px' },
  cardValue: { fontSize: '32px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
  cardNote: { fontSize: '12px', color: '#94a3b8' },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1e293b', marginBottom: '16px' },
  actionGrid: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  actionBtn: { padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  table: { overflowX: 'auto' },
  tableEl: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' },
  tableRow: { borderBottom: '1px solid #e2e8f0' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#1e293b' },
  returnBtn: { padding: '6px 14px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
};

export default UserDashboard;