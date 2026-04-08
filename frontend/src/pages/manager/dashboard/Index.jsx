import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ManagerLayout from '../../../components/layout/ManagerLayout';
import equipmentService from '../../../services/equipmentService';
import maintenanceService from '../../../services/maintenanceService';
import issueService from '../../../services/issueService';
import toast from 'react-hot-toast';

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalEquipment: 0,
    pendingMaintenance: 0,
    activeIssues: 0,
    lowStockItems: 0
  });
  const [pendingMaintenance, setPendingMaintenance] = useState([]);
  const [activeIssues, setActiveIssues] = useState([]);
  const [lowStockEquipment, setLowStockEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart data for maintenance trend
  const maintenanceTrendData = [
    { month: 'Jan', completed: 8, pending: 3 },
    { month: 'Feb', completed: 12, pending: 2 },
    { month: 'Mar', completed: 10, pending: 4 },
    { month: 'Apr', completed: 15, pending: 3 }
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data
      const [equipmentData, maintenanceData, issuesData] = await Promise.all([
        equipmentService.getAll(),
        maintenanceService.getAll(),
        issueService.getAll()
      ]);

      const equipmentList = equipmentData.data || [];
      const maintenanceList = maintenanceData.data || [];
      const issuesList = issuesData.data || [];

      // Filter data for manager view
      const lowStock = equipmentList.filter(item => item.quantity <= item.minimumStock);
      const pending = maintenanceList.filter(m => m.status === 'pending').slice(0, 10);
      const pendingRequests = issuesList.filter(i => i.status === 'requested').slice(0, 10);

      setStats({
        totalEquipment: equipmentList.length,
        pendingMaintenance: maintenanceList.filter(m => m.status === 'pending').length,
        activeIssues: issuesList.filter(i => i.status === 'requested').length,
        lowStockItems: lowStock.length
      });

      setPendingMaintenance(pending);
      setActiveIssues(pendingRequests);
      setLowStockEquipment(lowStock);

    } catch (error) {
      console.error('Error loading dashboard:', error);
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
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
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

  if (loading) {
    return (
      <ManagerLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#6b7280' }}>Loading dashboard...</div>
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#111827',
          marginBottom: '0.5rem'
        }}>Manager Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Overview of equipment, maintenance, and issues</p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard
          title="Total Equipment"
          value={stats.totalEquipment}
          icon="📦"
          color="#2563eb"
          link="/manager/equipment-view"
        />
        <StatCard
          title="Pending Maintenance"
          value={stats.pendingMaintenance}
          icon="🔧"
          color="#f59e0b"
          link="/manager/dashboard"
        />
        <StatCard
          title="Pending Requests"
          value={stats.activeIssues}
          icon="⚠️"
          color="#dc2626"
          link="/manager/issue-history"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon="📉"
          color="#8b5cf6"
          link="/manager/equipment-view"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Maintenance Trend Chart */}
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
          }}>Maintenance Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={maintenanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }} />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Items */}
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
          }}>Low Stock Items</h3>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {lowStockEquipment.length > 0 ? (
              lowStockEquipment.map((item) => (
                <div key={item.id} style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>{item.name}</p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Stock: {item.quantity} / Min: {item.minimumStock}</p>
                  </div>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>Low</span>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No low stock items</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Pending Maintenance */}
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
          }}>Pending Maintenance</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {pendingMaintenance.length > 0 ? (
              pendingMaintenance.map((item) => (
                <div key={item.id} style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid #e5e7eb',
                  borderLeft: '3px solid #f59e0b'
                }}>
                  <p style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                    Equipment ID: {item.equipmentId}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Scheduled: {new Date(item.scheduledDate).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.notes || 'No notes'}</p>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No pending maintenance</p>
            )}
          </div>
        </div>

        {/* Active Issues */}
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
          }}>Active Issues</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {activeIssues.length > 0 ? (
              activeIssues.map((item) => (
                <div key={item.id} style={{
                  padding: '0.75rem',
                  borderBottom: '1px solid #e5e7eb',
                  borderLeft: '3px solid #dc2626'
                }}>
                  <p style={{ fontWeight: '500', color: '#111827', marginBottom: '0.25rem' }}>
                    {item.Equipment?.name || `Request #${item.id}`}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Status: <span style={{ fontWeight: '500' }}>{item.status}</span>
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    Requested: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>No active issues</p>
            )}
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};

export default ManagerDashboard;
