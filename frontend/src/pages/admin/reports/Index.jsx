import { useEffect, useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import reportService from '../../../services/reportService';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Loader from '../../../components/ui/Loader';
import toast from 'react-hot-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState([]);
  const [issues, setIssues] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [issueFilters, setIssueFilters] = useState({ startDate: '', endDate: '' });
  const [maintenanceStatus, setMaintenanceStatus] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [inventoryRes, issuesRes, maintenanceRes, lowStockRes] = await Promise.all([
        reportService.getInventory(),
        reportService.getIssues(),
        reportService.getMaintenance(),
        reportService.getLowStock(),
      ]);

      setInventory(inventoryRes.data || []);
      setIssues(issuesRes.data || []);
      setMaintenance(maintenanceRes.data || []);
      setLowStock(lowStockRes.data || []);
    } catch (error) {
      console.error('Error loading reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const loadIssueReport = async () => {
    try {
      const response = await reportService.getIssues(issueFilters.startDate, issueFilters.endDate);
      setIssues(response.data || []);
    } catch (error) {
      toast.error('Failed to filter issue report');
    }
  };

  const loadMaintenanceReport = async (status) => {
    try {
      const response = await reportService.getMaintenance(status);
      setMaintenance(response.data || []);
    } catch (error) {
      toast.error('Failed to filter maintenance report');
    }
  };

  const exportCsv = (rows, filename, mapper) => {
    const normalizedRows = rows.map(mapper);
    if (!normalizedRows.length) {
      toast.error('No data to export');
      return;
    }

    const headers = Object.keys(normalizedRows[0]);
    const csv = [
      headers.join(','),
      ...normalizedRows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eeims-${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderTableCard = (title, action, children) => (
    <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#0f172a' }}>{title}</h3>
        {action}
      </div>
      <div style={{ padding: '1rem 1.25rem' }}>{children}</div>
    </div>
  );

  const conditionVariant = (condition) => {
    if (condition === 'poor') return 'danger';
    if (condition === 'fair') return 'warning';
    return 'success';
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.45rem' }}>Reports & Analytics</h1>
        <p style={{ color: '#64748b' }}>Generate and export system reports.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[
          ['inventory', 'Inventory'],
          ['issues', 'Issues'],
          ['maintenance', 'Maintenance'],
          ['low-stock', 'Low Stock'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.7rem 1rem',
              borderRadius: '9999px',
              backgroundColor: activeTab === key ? '#2563eb' : 'white',
              color: activeTab === key ? 'white' : '#475569',
              border: activeTab === key ? 'none' : '1px solid #cbd5e1',
              fontWeight: '700',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader text="Loading reports..." />
      ) : (
        <>
          {activeTab === 'inventory' && renderTableCard(
            `Equipment Inventory Report (${inventory.length} items)`,
            <button onClick={() => exportCsv(inventory, 'inventory', (item) => ({
              equipment_name: item.name,
              category: item.Category?.name || 'No Category',
              location: item.Location?.name || 'No Location',
              current_stock: item.quantity,
              minimum_stock: item.minimumStock,
              status: item.quantity <= item.minimumStock ? 'Low Stock' : 'In Stock',
              condition: item.condition,
            }))} style={{ padding: '0.65rem 1rem', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', fontWeight: '600' }}>Export CSV</button>,
            inventory.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>{['Equipment Name', 'Category', 'Location', 'Current Stock', 'Minimum Stock', 'Status', 'Condition'].map((label) => <th key={label} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>{label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#0f172a' }}>{item.name}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.Category?.name || 'No Category'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.Location?.name || 'No Location'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: item.quantity <= item.minimumStock ? '#dc2626' : '#16a34a', fontWeight: '700' }}>{item.quantity}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.minimumStock}</td>
                        <td style={{ padding: '0.9rem 1rem' }}><Badge variant={item.quantity <= item.minimumStock ? 'danger' : 'success'} size="sm">{item.quantity <= item.minimumStock ? 'Low Stock' : 'In Stock'}</Badge></td>
                        <td style={{ padding: '0.9rem 1rem' }}><Badge variant={conditionVariant(item.condition)} size="sm">{item.condition}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title="No inventory data found" />
          )}

          {activeTab === 'issues' && renderTableCard(
            'Issue Report',
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <input type="date" value={issueFilters.startDate} onChange={(e) => setIssueFilters((prev) => ({ ...prev, startDate: e.target.value }))} style={{ padding: '0.65rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
              <input type="date" value={issueFilters.endDate} onChange={(e) => setIssueFilters((prev) => ({ ...prev, endDate: e.target.value }))} style={{ padding: '0.65rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '10px' }} />
              <button onClick={loadIssueReport} style={{ padding: '0.65rem 1rem', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', fontWeight: '600' }}>Apply Filter</button>
              <button onClick={() => exportCsv(issues, 'issues', (item) => ({
                equipment_name: item.Equipment?.name || 'Unknown',
                issued_to: item.User?.name || 'Unknown',
                quantity: item.quantity,
                issue_date: item.issueDate || '',
                return_date: item.returnDate || 'Not returned',
                status: item.status,
              }))} style={{ padding: '0.65rem 1rem', borderRadius: '10px', backgroundColor: '#16a34a', color: 'white', fontWeight: '600' }}>Export CSV</button>
            </div>,
            issues.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>{['Equipment Name', 'Issued To', 'Quantity', 'Issue Date', 'Return Date', 'Status'].map((label) => <th key={label} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>{label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {issues.map((item) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#0f172a' }}>{item.Equipment?.name || 'Unknown'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.User?.name || 'Unknown'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.quantity}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.issueDate ? new Date(item.issueDate).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : 'Not returned'}</td>
                        <td style={{ padding: '0.9rem 1rem' }}><Badge variant={item.status === 'rejected' ? 'danger' : item.status === 'returned' ? 'success' : item.status === 'pending' ? 'warning' : 'info'} size="sm">{item.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title="No issue data found" />
          )}

          {activeTab === 'maintenance' && renderTableCard(
            'Maintenance Report',
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <select value={maintenanceStatus} onChange={(e) => { setMaintenanceStatus(e.target.value); loadMaintenanceReport(e.target.value); }} style={{ padding: '0.65rem 0.8rem', border: '1px solid #cbd5e1', borderRadius: '10px' }}>
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
              <button onClick={() => exportCsv(maintenance, 'maintenance', (item) => ({
                equipment_name: item.Equipment?.name || 'Unknown',
                technician_name: item.technician?.name || 'Unknown',
                scheduled_date: item.scheduledDate || '',
                completed_date: item.completedDate || '-',
                status: item.status,
                notes: item.notes || '',
              }))} style={{ padding: '0.65rem 1rem', borderRadius: '10px', backgroundColor: '#16a34a', color: 'white', fontWeight: '600' }}>Export CSV</button>
            </div>,
            maintenance.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>{['Equipment Name', 'Technician Name', 'Scheduled Date', 'Completed Date', 'Status', 'Notes'].map((label) => <th key={label} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>{label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {maintenance.map((item) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#0f172a' }}>{item.Equipment?.name || 'Unknown'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.technician?.name || 'Unknown'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{new Date(item.scheduledDate).toLocaleDateString()}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.completedDate ? new Date(item.completedDate).toLocaleDateString() : '-'}</td>
                        <td style={{ padding: '0.9rem 1rem' }}><Badge variant={item.status === 'completed' ? 'success' : item.status === 'overdue' ? 'danger' : 'warning'} size="sm">{item.status}</Badge></td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.notes ? `${item.notes.slice(0, 60)}${item.notes.length > 60 ? '...' : ''}` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title="No maintenance data found" />
          )}

          {activeTab === 'low-stock' && renderTableCard(
            `Low Stock Report (${lowStock.length} items require restocking)`,
            <button onClick={() => exportCsv(lowStock, 'low-stock', (item) => ({
              equipment_name: item.name,
              category: item.Category?.name || 'No Category',
              location: item.Location?.name || 'No Location',
              current_stock: item.quantity,
              minimum_required: item.minimumStock,
              shortage: item.minimumStock - item.quantity,
            }))} style={{ padding: '0.65rem 1rem', borderRadius: '10px', backgroundColor: '#2563eb', color: 'white', fontWeight: '600' }}>Export CSV</button>,
            lowStock.length ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>{['Equipment Name', 'Category', 'Location', 'Current Stock', 'Minimum Required', 'Shortage'].map((label) => <th key={label} style={{ padding: '0.85rem 1rem', textAlign: 'left', color: '#64748b', fontSize: '0.8rem' }}>{label}</th>)}</tr>
                  </thead>
                  <tbody>
                    {lowStock.map((item) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.9rem 1rem', fontWeight: '600', color: '#0f172a' }}>{item.name}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.Category?.name || 'No Category'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.Location?.name || 'No Location'}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#dc2626', fontWeight: '700' }}>{item.quantity}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#475569' }}>{item.minimumStock}</td>
                        <td style={{ padding: '0.9rem 1rem', color: '#dc2626', fontWeight: '700' }}>{item.minimumStock - item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <EmptyState title="No low stock items found" />
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default Reports;
