import { useState, useEffect } from 'react';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import reportService from '../../../services/reportService';
import toast from 'react-hot-toast';

const ManagerReports = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [issuesData, setIssuesData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadReports();
  }, [activeTab]);

  const loadReports = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'inventory') {
        const response = await reportService.getInventory();
        setInventoryData(response.data || []);
      } else if (activeTab === 'issues') {
        const params = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const response = await reportService.getIssues(params);
        setIssuesData(response.data || []);
      } else if (activeTab === 'low-stock') {
        const response = await reportService.getLowStock();
        setLowStockData(response.data || []);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value ?? '';
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `eeims-${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { key: 'inventory', label: 'Inventory' },
    { key: 'issues', label: 'Issues' },
    { key: 'low-stock', label: 'Low Stock' },
  ];

  const getConditionBadge = (condition) => {
    const styles = {
      good: { bg: '#dcfce7', color: '#166534', label: 'Good' },
      fair: { bg: '#fef3c7', color: '#92400e', label: 'Fair' },
      poor: { bg: '#fee2e2', color: '#991b1b', label: 'Poor' },
    };
    const s = styles[condition] || styles.good;
    return <span style={{ padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '600', background: s.bg, color: s.color }}>{s.label}</span>;
  };

  const getStockStatus = (current, minimum) => {
    if (current <= minimum) {
      return { text: 'Low Stock', bg: '#fee2e2', color: '#991b1b' };
    }
    return { text: 'In Stock', bg: '#dcfce7', color: '#166534' };
  };

  return (
    <ManagerLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>Reports & Analytics</h1>
        <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>View reports for equipment and issues</p>
      </div>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.75rem 1.5rem',
              background: activeTab === tab.key ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'var(--white)',
              color: activeTab === tab.key ? 'white' : '#475569',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'issues' && (
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-light)',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#0f172a',
            marginBottom: '1rem'
          }}>Filter by Date Range</h3>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'flex-end'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: '600', color: '#475569' }}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  padding: '0.625rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8125rem', fontWeight: '600', color: '#475569' }}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  padding: '0.625rem',
                  border: '2px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem'
                }}
              />
            </div>
            <button
              onClick={loadReports}
              style={{
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}

      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-light)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: '700',
            color: '#0f172a',
            textTransform: 'capitalize'
          }}>
            {activeTab === 'low-stock' ? 'Low Stock Report' : `${activeTab} Report`}
          </h3>
          <button
            onClick={() => {
              if (activeTab === 'inventory') exportToCSV(inventoryData, 'inventory');
              else if (activeTab === 'issues') exportToCSV(issuesData, 'issues');
              else if (activeTab === 'low-stock') exportToCSV(lowStockData, 'low-stock');
            }}
            style={{
              padding: '0.5rem 1rem',
              background: 'var(--white)',
              color: '#6366f1',
              border: '2px solid #6366f1',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Export CSV
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading report data...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            {activeTab === 'inventory' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Equipment</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Current Stock</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Min Stock</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Condition</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryData.length > 0 ? (
                    inventoryData.map((item, index) => {
                      const status = getStockStatus(item.quantity, item.minimumStock);
                      return (
                        <tr key={index} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>{item.name}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{item.Category?.name || 'N/A'}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{item.Location?.name || 'N/A'}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '700' }}>{item.quantity}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{item.minimumStock}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{getConditionBadge(item.condition)}</td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <span style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.6875rem', fontWeight: '600', background: status.bg, color: status.color }}>
                              {status.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'issues' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Equipment</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Employee</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Quantity</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Issue Date</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Return Date</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {issuesData.length > 0 ? (
                    issuesData.map((issue, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--border-light)' }}>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>{issue.Equipment?.name || '-'}</td>
                        <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{issue.User?.name || '-'}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600' }}>{issue.quantity}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                          <span style={{
                            padding: '0.25rem 0.625rem',
                            borderRadius: '9999px',
                            fontSize: '0.6875rem',
                            fontWeight: '600',
                            background: issue.status === 'issued' ? '#dbeafe' : issue.status === 'returned' ? '#dcfce7' : '#fef3c7',
                            color: issue.status === 'issued' ? '#1e40af' : issue.status === 'returned' ? '#166534' : '#92400e'
                          }}>
                            {issue.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            )}

            {activeTab === 'low-stock' && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Equipment</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Current Stock</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.6875rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Minimum Required</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockData.length > 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '1rem', textAlign: 'center', background: '#fef2f2' }}>
                        <span style={{ fontWeight: '700', color: '#991b1b', fontSize: '1rem' }}>{lowStockData.length} items need restocking</span>
                      </td>
                    </tr>
                  ) : null}
                  {lowStockData.map((item, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid var(--border-light)', background: '#fef2f2' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>{item.Category?.name || 'N/A'}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '700', color: '#dc2626' }}>{item.quantity}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: '#64748b' }}>{item.minimumStock}</td>
                    </tr>
                  ))}
                  {lowStockData.length === 0 && (
                    <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No low stock items</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerReports;