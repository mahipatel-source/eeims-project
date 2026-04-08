import { useState, useEffect } from 'react';
import issueService from '../../../services/issueService';
import UserLayout from '../../../components/layout/UserLayout';
import toast from 'react-hot-toast';

const MyHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await issueService.getMyRequests();
      // show all history sorted by date
      setHistory(response.data);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: '#fef3c7', color: '#d97706' },
      issued: { bg: '#dbeafe', color: '#2563eb' },
      returned: { bg: '#dcfce7', color: '#16a34a' },
      rejected: { bg: '#fee2e2', color: '#dc2626' },
    };
    const c = config[status] || config.pending;
    return (
      <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
        {status}
      </span>
    );
  };

  if (isLoading) return <UserLayout><div style={styles.loading}>Loading...</div></UserLayout>;

  return (
    <UserLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My History</h1>
          <p style={styles.subtitle}>Complete record of all your equipment requests and returns.</p>
        </div>

        {history.length === 0 ? (
          <div style={styles.empty}>No history found</div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Equipment</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Requested On</th>
                  <th style={styles.th}>Issue Date</th>
                  <th style={styles.th}>Return Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={item.id} style={styles.tableRow}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={{ ...styles.td, fontWeight: '500' }}>{item.Equipment?.name}</td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      {item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '—'}
                    </td>
                    <td style={styles.td}>
                      {item.returnDate ? new Date(item.returnDate).toLocaleDateString() : '—'}
                    </td>
                    <td style={styles.td}>{getStatusBadge(item.status)}</td>
                    <td style={{ ...styles.td, color: '#64748b', maxWidth: '200px' }}>
                      {item.remarks || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

const styles = {
  container: { padding: '24px' },
  loading: { padding: '40px', textAlign: 'center' },
  header: { marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
  subtitle: { color: '#64748b', fontSize: '14px' },
  empty: { textAlign: 'center', padding: '60px', color: '#64748b' },
  tableWrapper: { overflowX: 'auto', background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHead: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#64748b', borderBottom: '1px solid #e2e8f0' },
  tableRow: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 16px', fontSize: '14px', color: '#1e293b' },
};

export default MyHistory;