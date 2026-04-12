import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import AdminLayout from '../../../components/layout/AdminLayout';
import equipmentService from '../../../services/equipmentService';
import issueService from '../../../services/issueService';
import maintenanceService from '../../../services/maintenanceService';
import alertService from '../../../services/alertService';
import API from '../../../services/axios';
import Badge from '../../../components/ui/Badge';
import Loader from '../../../components/ui/Loader';
import EmptyState from '../../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#2563eb', '#16a34a', '#d97706', '#7c3aed', '#dc2626', '#0891b2'];

const fallbackCategoryData = [
  { name: 'Motors', value: 4 },
  { name: 'Fuses', value: 3 },
  { name: 'Cables', value: 2 },
];

const fallbackTrendData = [
  { date: 'Day 1', count: 1 },
  { date: 'Day 2', count: 3 },
  { date: 'Day 3', count: 2 },
  { date: 'Day 4', count: 4 },
  { date: 'Day 5', count: 2 },
  { date: 'Day 6', count: 5 },
  { date: 'Day 7', count: 3 },
];

const statusVariantMap = {
  pending: 'warning',
  issued: 'info',
  returned: 'success',
  rejected: 'danger',
  completed: 'success',
  overdue: 'danger',
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEquipment: 0,
    activeIssues: 0,
    pendingMaintenance: 0,
    lowStockItems: 0,
    unreadAlerts: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [categoryData, setCategoryData] = useState(fallbackCategoryData);
  const [issueTrendData, setIssueTrendData] = useState(fallbackTrendData);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        equipmentRes,
        issuesRes,
        maintenanceRes,
        alertsRes,
        categoryRes,
        trendRes,
      ] = await Promise.all([
        equipmentService.getAll(),
        issueService.getAll(),
        maintenanceService.getAll(),
        alertService.getAll(),
        API.get('/dashboard/equipment-by-category').catch(() => null),
        API.get('/dashboard/issue-trend').catch(() => null),
      ]);

      const equipment = equipmentRes.data || [];
      const issues = issuesRes.data || [];
      const maintenance = maintenanceRes.data || [];
      const alerts = alertsRes.data || [];

      setStats({
        totalEquipment: equipment.length,
        activeIssues: issues.filter((item) => item.status === 'issued' || item.status === 'pending').length,
        pendingMaintenance: maintenance.filter((item) => item.status === 'pending').length,
        lowStockItems: equipment.filter((item) => item.quantity <= item.minimumStock).length,
        unreadAlerts: alerts.filter((item) => !item.isRead).length,
      });

      setRecentIssues(issues.slice(0, 5));
      setRecentMaintenance(maintenance.slice(0, 5));

      if (categoryRes?.data?.data?.length) {
        setCategoryData(
          categoryRes.data.data.map((item) => ({
            name: item.Category?.name || 'Uncategorized',
            value: Number(item.count) || 0,
          }))
        );
      }

      if (trendRes?.data?.data?.length) {
        setIssueTrendData(
          trendRes.data.data.map((item) => ({
            date: item.date,
            count: Number(item.count) || 0,
          }))
        );
      }
    } catch (error) {
      console.error('Error loading admin dashboard:', error);
      toast.error('Failed to load dashboard data');
      setStats({
        totalEquipment: 0,
        activeIssues: 0,
        pendingMaintenance: 0,
        lowStockItems: 0,
        unreadAlerts: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient, link }) => (
    <Link
      to={link}
      style={{
        textDecoration: 'none',
        background: 'white',
        borderRadius: '18px',
        padding: '1.4rem',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)',
        display: 'block',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.35rem' }}>{title}</div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a' }}>{loading ? '...' : value}</div>
        </div>
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.35rem',
          }}
        >
          {icon}
        </div>
      </div>
    </Link>
  );

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: '#64748b' }}>Complete overview of inventory, issues, maintenance, and alerts.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <StatCard title="Total Equipment" value={stats.totalEquipment} icon="📦" gradient="linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" link="/admin/equipment" />
        <StatCard title="Active Issues" value={stats.activeIssues} icon="⚠️" gradient="linear-gradient(135deg, #dc2626 0%, #fb7185 100%)" link="/admin/maintenance" />
        <StatCard title="Pending Maintenance" value={stats.pendingMaintenance} icon="🔧" gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" link="/admin/maintenance" />
        <StatCard title="Low Stock Items" value={stats.lowStockItems} icon="📉" gradient="linear-gradient(135deg, #16a34a 0%, #059669 100%)" link="/admin/equipment" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Equipment by Category</h3>
          {loading ? (
            <Loader text="Loading chart..." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={4}>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </section>

        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Issue Trends</h3>
          {loading ? (
            <Loader text="Loading chart..." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={issueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>Recent Issues</h3>
            <Badge variant="danger" size="sm">{stats.unreadAlerts} unread alerts</Badge>
          </div>
          {recentIssues.length ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>Equipment</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>Issued To</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: '600', color: '#0f172a' }}>{item.Equipment?.name || 'Unknown'}</td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>{item.User?.name || 'Unknown'}</td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                        <Badge variant={statusVariantMap[item.status] || 'default'} size="sm">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No recent issues" description="Issue activity will appear here once equipment requests are created." />
          )}
        </section>

        <section style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.25rem', boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '1rem' }}>Recent Maintenance</h3>
          {recentMaintenance.length ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>Equipment</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>Technician</th>
                    <th style={{ textAlign: 'center', padding: '0.75rem 0.5rem', color: '#64748b', fontSize: '0.8rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMaintenance.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 0.5rem', fontWeight: '600', color: '#0f172a' }}>{item.Equipment?.name || 'Unknown'}</td>
                      <td style={{ padding: '0.85rem 0.5rem', color: '#64748b' }}>{item.technician?.name || 'Unassigned'}</td>
                      <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                        <Badge variant={statusVariantMap[item.status] || 'default'} size="sm">{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No recent maintenance" description="Scheduled and completed maintenance records will appear here." />
          )}
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
