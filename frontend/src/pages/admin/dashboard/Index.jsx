import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import AdminLayout from '../../../components/layout/AdminLayout';
import equipmentService from '../../../services/equipmentService';
import issueService from '../../../services/issueService';
import maintenanceService from '../../../services/maintenanceService';
import alertService from '../../../services/alertService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    totalIssues: 0,
    pendingMaintenance: 0,
    lowStockItems: 0
  });
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for charts (in a real app, this would come from APIs)
  const categoryData = [
    { name: 'Electronics', value: 35, color: '#2563eb' },
    { name: 'Tools', value: 25, color: '#16a34a' },
    { name: 'Machinery', value: 20, color: '#dc2626' },
    { name: 'Safety', value: 15, color: '#d97706' },
    { name: 'Others', value: 5, color: '#7c3aed' }
  ];

  const issueTrendData = [
    { month: 'Jan', issues: 12 },
    { month: 'Feb', issues: 19 },
    { month: 'Mar', issues: 15 },
    { month: 'Apr', issues: 25 }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load equipment stats
      const equipmentResponse = await equipmentService.getAll();
      const equipmentData = equipmentResponse.data || [];

      // Load issues
      const issuesResponse = await issueService.getAll();
      const issuesData = issuesResponse.data || [];

      // Load maintenance
      const maintenanceResponse = await maintenanceService.getAll();
      const maintenanceData = maintenanceResponse.data || [];

      // Load alerts
      const alertsResponse = await alertService.getAll();
      const alertsData = alertsResponse.data || [];

      // Calculate stats
      const lowStockItems = equipmentData.filter(item => item.quantity <= item.minimumStock).length;
      const pendingMaintenance = maintenanceData.filter(item => item.status === 'pending').length;

      setStats({
        totalEquipment: equipmentData.length,
        totalIssues: issuesData.length,
        pendingMaintenance,
        lowStockItems
      });

      // Set recent data (last 5 items)
      setRecentIssues(issuesData.slice(0, 5));
      setRecentMaintenance(maintenanceData.slice(0, 5));
      setAlerts(alertsData.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, link }) => (
    <Link to={link} style={{
      display: 'block',
      backgroundColor: 'var(--white)',
      borderRadius: 'var(--radius)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#6b7280',
            marginBottom: '0.25rem'
          }}>{title}</p>
          <p style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#111827'
          }}>{loading ? '...' : value}</p>
        </div>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.25rem'
        }}>
          {icon}
        </div>
      </div>
    </Link>
  );

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>Admin Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Welcome back! Here's what's happening with your equipment inventory.</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Equipment"
          value={stats.totalEquipment}
          icon="📦"
          color="#2563eb"
          link="/admin/equipment"
        />
        <StatCard
          title="Active Issues"
          value={stats.totalIssues}
          icon="⚠️"
          color="#dc2626"
          link="/admin/issues"
        />
        <StatCard
          title="Pending Maintenance"
          value={stats.pendingMaintenance}
          icon="🔧"
          color="#d97706"
          link="/admin/maintenance"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon="📉"
          color="#16a34a"
          link="/admin/equipment"
        />
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Category Distribution */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>Equipment by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Issue Trends */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>Issue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={issueTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="issues" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activities */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Issues */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>Recent Issues</h3>
          <div style={{ spaceY: '0.75rem' }}>
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <div key={issue.id} style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>{issue.Equipment?.name || 'Unknown Equipment'}</span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      backgroundColor: issue.status === 'issued' ? '#fef3c7' : '#d1fae5',
                      color: issue.status === 'issued' ? '#92400e' : '#065f46'
                    }}>
                      {issue.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Issued to: {issue.User?.name || 'Unknown User'}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No recent issues</p>
            )}
          </div>
        </div>

        {/* Recent Maintenance */}
        <div style={{
          backgroundColor: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '1rem'
          }}>Recent Maintenance</h3>
          <div style={{ spaceY: '0.75rem' }}>
            {recentMaintenance.length > 0 ? (
              recentMaintenance.map((maintenance) => (
                <div key={maintenance.id} style={{
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>{maintenance.Equipment?.name || 'Unknown Equipment'}</span>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      backgroundColor: maintenance.status === 'pending' ? '#fef3c7' : '#d1fae5',
                      color: maintenance.status === 'pending' ? '#92400e' : '#065f46'
                    }}>
                      {maintenance.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Technician: {maintenance.technician?.name || 'Unknown'}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No recent maintenance</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
