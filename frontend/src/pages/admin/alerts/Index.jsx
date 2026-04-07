import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import alertService from '../../../services/alertService';
import toast from 'react-hot-toast';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Starting to load alerts...');
      setLoading(true);
      setError(null);
      
      const response = await alertService.getAll();
      console.log('Got response:', response);
      
      // Handle response structure - service returns response.data which has {success, data: [...]}
      const alertsData = response.data ? response.data : response;
      console.log('Extracted alerts data:', alertsData);
      
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading alerts:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setError(errorMsg);
      toast.error('Failed to load alerts: ' + errorMsg);
      setAlerts([]);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading alerts...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '1rem'
        }}>Alerts Management</h1>
        
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#7f1d1d',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            marginBottom: '1rem',
            border: '1px solid #fecaca'
          }}>
            Error: {error}
          </div>
        )}

        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          padding: '1.5rem'
        }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: '600' }}>
            Alerts ({alerts.length} total)
          </h2>
          
          {alerts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead style={{ backgroundColor: 'var(--light)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Message</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr key={alert.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}>{alert.message}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: alert.type === 'low_stock' ? '#fffbeb' : '#eff6ff',
                          color: alert.type === 'low_stock' ? '#d97706' : '#2563eb'
                        }}>
                          {alert.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: alert.isRead ? '#f0fdf4' : '#fef2f2',
                          color: alert.isRead ? '#16a34a' : '#dc2626'
                        }}>
                          {alert.isRead ? 'Read' : 'Unread'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#6b7280' }}>
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No alerts found.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Alerts;
