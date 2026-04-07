import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import equipmentService from '../../../services/equipmentService';
import reportService from '../../../services/reportService';
import maintenanceService from '../../../services/maintenanceService';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    inventory: [],
    lowStock: [],
    maintenance: [],
    issues: []
  });
  const [filters, setFilters] = useState({
    maintenanceStatus: '',
    issueStartDate: '',
    issueEndDate: ''
  });

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, maintenanceRes, issuesRes] = await Promise.all([
        equipmentService.getAll(),
        maintenanceService.getAll(),
        issueService.getAll()
      ]);

      console.log('Inventory Response:', inventoryRes);
      console.log('Maintenance Response:', maintenanceRes);
      console.log('Issues Response:', issuesRes);

      const inventory = inventoryRes.data || inventoryRes || [];
      const lowStockItems = inventory.filter(item => item.quantity < item.minimumStock);
      const maintenance = maintenanceRes.data || maintenanceRes || [];
      const issues = issuesRes.data || issuesRes || [];

      setReportData({
        inventory,
        lowStock: lowStockItems,
        maintenance,
        issues
      });
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports: ' + error.message);
      setReportData({
        inventory: [],
        lowStock: [],
        maintenance: [],
        issues: []
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMaintenance = reportData.maintenance.filter(item => {
    const matchesStatus = !filters.maintenanceStatus || item.status === filters.maintenanceStatus;
    return matchesStatus;
  });

  const filteredIssues = reportData.issues.filter(item => {
    let matchesDate = true;
    if (filters.issueStartDate) {
      matchesDate = new Date(item.createdAt) >= new Date(filters.issueStartDate);
    }
    if (filters.issueEndDate && matchesDate) {
      matchesDate = new Date(item.createdAt) <= new Date(filters.issueEndDate);
    }
    return matchesDate;
  });

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0] || {});
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const InventoryReport = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          Equipment Inventory Report ({reportData.inventory.length} items)
        </h3>
        <button
          onClick={() => exportToCSV(reportData.inventory, 'inventory-report')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Export CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment Name</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Category</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Current Stock</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Minimum Stock</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Condition</th>
            </tr>
          </thead>
          <tbody>
            {reportData.inventory.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>{item.name}</td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.Category?.name}</td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#111827' }}>
                  {item.quantity}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.minimumStock}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: item.quantity >= item.minimumStock ? '#dbeafe' : '#fee2e2',
                    color: item.quantity >= item.minimumStock ? '#0c4a6e' : '#7f1d1d'
                  }}>
                    {item.quantity >= item.minimumStock ? 'In Stock' : 'Low Stock'}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    backgroundColor: item.condition === 'good' ? '#dcfce7' : item.condition === 'fair' ? '#fef3c7' : '#fee2e2',
                    color: item.condition === 'good' ? '#15803d' : item.condition === 'fair' ? '#92400e' : '#7f1d1d'
                  }}>
                    {item.condition?.charAt(0).toUpperCase() + item.condition?.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const LowStockReport = () => (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
          Low Stock Report ({reportData.lowStock.length} items)
        </h3>
        {reportData.lowStock.length > 0 && (
          <button
            onClick={() => exportToCSV(reportData.lowStock, 'low-stock-report')}
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        )}
      </div>

      {reportData.lowStock.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: 'var(--light)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment Name</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Current Stock</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Minimum Stock</th>
                <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Shortage</th>
              </tr>
            </thead>
            <tbody>
              {reportData.lowStock.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>{item.name}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#dc2626' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>{item.minimumStock}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#dc2626' }}>
                    {item.minimumStock - item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: 'var(--radius)',
          border: '1px dashed var(--border)'
        }}>
          All equipment stocks are at healthy levels.
        </div>
      )}
    </div>
  );

  const MaintenanceReport = () => (
    <div>
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <select
          value={filters.maintenanceStatus}
          onChange={(e) => setFilters({ ...filters, maintenanceStatus: e.target.value })}
          style={{
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem',
            minWidth: '150px'
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <button
          onClick={() => exportToCSV(filteredMaintenance, 'maintenance-report')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          disabled={filteredMaintenance.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Technician</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Scheduled Date</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Completed Date</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaintenance.length > 0 ? (
              filteredMaintenance.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>
                    {reportData.inventory.find(eq => eq.id === item.equipmentId)?.name}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280' }}>{item.technicianName || 'N/A'}</td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(item.scheduledDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                    {item.completedDate ? new Date(item.completedDate).toLocaleDateString() : 'Pending'}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: item.status === 'completed' ? '#dcfce7' : item.status === 'pending' ? '#dbeafe' : '#fee2e2',
                      color: item.status === 'completed' ? '#15803d' : item.status === 'pending' ? '#0c4a6e' : '#7f1d1d'
                    }}>
                      {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  No maintenance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const IssuesReport = () => (
    <div>
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="date"
          value={filters.issueStartDate}
          onChange={(e) => setFilters({ ...filters, issueStartDate: e.target.value })}
          style={{
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem'
          }}
        />
        <input
          type="date"
          value={filters.issueEndDate}
          onChange={(e) => setFilters({ ...filters, issueEndDate: e.target.value })}
          style={{
            padding: '0.75rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            fontSize: '0.875rem'
          }}
        />
        <button
          onClick={() => exportToCSV(filteredIssues, 'issues-report')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
          disabled={filteredIssues.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: 'var(--light)' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Equipment</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Severity</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Date Reported</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.length > 0 ? (
              filteredIssues.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>
                    {reportData.inventory.find(eq => eq.id === item.equipmentId)?.name}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: item.severity === 'high' ? '#fee2e2' : item.severity === 'medium' ? '#fef3c7' : '#dbeafe',
                      color: item.severity === 'high' ? '#7f1d1d' : item.severity === 'medium' ? '#92400e' : '#0c4a6e'
                    }}>
                      {item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      backgroundColor: item.status === 'resolved' ? '#dcfce7' : '#dbeafe',
                      color: item.status === 'resolved' ? '#15803d' : '#0c4a6e'
                    }}>
                      {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  fontStyle: 'italic'
                }}>
                  No issues found for the selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <div>Loading reports...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>Reports & Analytics</h1>
          <p style={{ color: '#6b7280' }}>View detailed reports on equipment inventory, maintenance, and issues.</p>
        </div>

        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'var(--light)'
          }}>
            {[
              { id: 'inventory', label: 'Inventory', icon: '📦' },
              { id: 'lowStock', label: 'Low Stock', icon: '⚠️' },
              { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
              { id: 'issues', label: 'Issues', icon: '🐛' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? 'var(--white)' : 'transparent',
                  borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : 'none',
                  color: activeTab === tab.id ? 'var(--primary)' : '#6b7280',
                  fontWeight: activeTab === tab.id ? '600' : '500',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div style={{ padding: '1.5rem' }}>
            {activeTab === 'inventory' && <InventoryReport />}
            {activeTab === 'lowStock' && <LowStockReport />}
            {activeTab === 'maintenance' && <MaintenanceReport />}
            {activeTab === 'issues' && <IssuesReport />}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
