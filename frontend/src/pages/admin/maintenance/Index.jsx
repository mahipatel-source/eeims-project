import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import maintenanceService from '../../../services/maintenanceService';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Starting to load maintenance...');
      setLoading(true);
      setError(null);
      
      const response = await maintenanceService.getAll();
      console.log('Got response:', response);
      
      // Handle response structure - service returns response.data which has {success, data: [...]}
      const maintenanceData = response.data ? response.data : response;
      console.log('Extracted maintenance data:', maintenanceData);
      
      setMaintenances(Array.isArray(maintenanceData) ? maintenanceData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error loading maintenance:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      setError(errorMsg);
      toast.error('Failed to load maintenance: ' + errorMsg);
      setMaintenances([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await maintenanceService.delete(id);
        toast.success('Maintenance record deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Loading maintenance records...</p>
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
        }}>Maintenance Management</h1>
        
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
            Maintenance Records ({maintenances.length} total)
          </h2>
          
          {maintenances.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.875rem'
              }}>
                <thead style={{ backgroundColor: 'var(--light)' }}>
                  <tr>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Equipment</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Technician</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Scheduled</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenances.map((record) => (
                    <tr key={record.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem' }}>
                        {record.Equipment?.name || 'Unknown'}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        {record.technician?.name || 'Unassigned'}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#6b7280' }}>
                        {new Date(record.scheduledDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          backgroundColor: record.status === 'completed' ? '#dcfce7' : record.status === 'pending' ? '#dbeafe' : '#fee2e2',
                          color: record.status === 'completed' ? '#15803d' : record.status === 'pending' ? '#0c4a6e' : '#7f1d1d'
                        }}>
                          {record.status?.charAt(0).toUpperCase() + record.status?.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDelete(record.id)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No maintenance records found.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Maintenance;
