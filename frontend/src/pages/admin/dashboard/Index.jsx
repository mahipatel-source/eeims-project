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

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#6366f1' },
    { name: 'Tools', value: 25, color: '#10b981' },
    { name: 'Machinery', value: 20, color: '#f43f5e' },
    { name: 'Safety', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#8b5cf6' }
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
      const [equipmentRes, issuesResponse, maintenanceResponse, alertsResponse] = await Promise.all([
        equipmentService.getAll(),
        issueService.getAll(),
        maintenanceService.getAll(),
        alertService.getAll()
      ]);

      const equipmentData = equipmentRes.data || [];
      const issuesData = issuesResponse.data || [];
      const maintenanceData = maintenanceResponse.data || [];
      const alertsData = alertsResponse.data || [];

      const lowStockItems = equipmentData.filter(item => item.quantity <= item.minimumStock).length;
      const pendingMaintenance = maintenanceData.filter(item => item.status === 'pending').length;

      setStats({
        totalEquipment: equipmentData.length,
        totalIssues: issuesData.length,
        pendingMaintenance,
        lowStockItems
      });

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

  const StatCard = ({ title, value, icon, color, gradient, link, delay }) => (
    <Link to={link} style={{ textDecoration: 'none' }} className="animate-fade-in-up" style={{ animationDelay: delay }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: gradient,
        }}></div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#64748b',
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>{title}</p>
            <p style={{
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em'
            }}>{loading ? '...' : value}</p>
          </div>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontSize: '1.5rem'
          }}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2.5rem' }} className="animate-fade-in">
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0f172a',
          marginBottom: '0.5rem',
          letterSpacing: '-0.025em'
        }}>Dashboard</h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Welcome back! Here's what's happening with your equipment inventory.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <StatCard
            title="Total Equipment"
            value={stats.totalEquipment}
            icon="📦"
            gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
            link="/admin/equipment"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <StatCard
            title="Active Issues"
            value={stats.totalIssues}
            icon="⚠️"
            gradient="linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)"
            link="/admin/issues"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <StatCard
            title="Pending Maintenance"
            value={stats.pendingMaintenance}
            icon="🔧"
            gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
            link="/admin/maintenance"
          />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockItems}
            icon="📉"
            gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
            link="/admin/equipment"
          />
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}></span>
            Equipment by Category
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={8} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '20px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></span>
            Issue Trends
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={issueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="issues" 
                stroke="url(#gradient)" 
                strokeWidth={4}
                dot={{ fill: '#10b981', strokeWidth: 2, stroke: '#fff', r: 6 }}
                activeDot={{ r: 8 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem'
      }}>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}></span>
            Recent Issues
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentIssues.length > 0 ? (
              recentIssues.map((issue) => (
                <div key={issue.id} style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>{issue.Equipment?.name || 'Unknown Equipment'}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Issued to: {issue.User?.name || 'Unknown User'}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    background: issue.status === 'issued' ? '#fef3c7' : issue.status === 'pending' ? '#e0e7ff' : '#d1fae5',
                    color: issue.status === 'issued' ? '#92400e' : issue.status === 'pending' ? '#4338ca' : '#065f46'
                  }}>
                    {issue.status}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No recent issues
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s', background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}></span>
            Recent Maintenance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentMaintenance.length > 0 ? (
              recentMaintenance.map((maintenance) => (
                <div key={maintenance.id} style={{
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9375rem' }}>{maintenance.Equipment?.name || 'Unknown Equipment'}</p>
                    <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Technician: {maintenance.technician?.name || 'Unknown'}
                    </p>
                  </div>
                  <span style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '9999px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    background: maintenance.status === 'pending' ? '#fef3c7' : maintenance.status === 'completed' ? '#d1fae5' : '#fee2e2',
                    color: maintenance.status === 'pending' ? '#92400e' : maintenance.status === 'completed' ? '#065f46' : '#dc2626'
                  }}>
                    {maintenance.status}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                No recent maintenance
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;