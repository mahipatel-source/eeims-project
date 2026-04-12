import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import alertService from '../../../services/alertService';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Loader from '../../../components/ui/Loader';
import Modal from '../../../components/ui/Modal';
import toast from 'react-hot-toast';

const typeConfig = {
  low_stock: { label: 'Low Stock', variant: 'danger' },
  maintenance_due: { label: 'Maintenance Due', variant: 'warning' },
  general: { label: 'General', variant: 'primary' },
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadAlerts();
    const timer = setInterval(loadAlerts, 60000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = useMemo(() => alerts.filter((item) => !item.isRead).length, [alerts]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const response = await alertService.getAll();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await alertService.markAsRead(id);
      setAlerts((prev) => prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)));
      toast.success('Alert marked as read');
    } catch (error) {
      console.error('Error marking alert as read:', error);
      toast.error('Failed to mark alert as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setSubmitting(true);
      await alertService.markAllAsRead();
      setAlerts((prev) => prev.map((item) => ({ ...item, isRead: true })));
      toast.success('All alerts marked as read');
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
      toast.error('Failed to mark all alerts as read');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAlert) return;

    try {
      setSubmitting(true);
      await alertService.delete(selectedAlert.id);
      setAlerts((prev) => prev.filter((item) => item.id !== selectedAlert.id));
      toast.success('Alert deleted successfully');
      setShowDeleteModal(false);
      setSelectedAlert(null);
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error('Failed to delete alert');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.45rem' }}>Alerts</h1>
          <p style={{ color: '#64748b' }}>{unreadCount} unread alerts</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            disabled={submitting}
            style={{ backgroundColor: '#2563eb', color: 'white', borderRadius: '12px', padding: '0.8rem 1.1rem', fontWeight: '600', opacity: submitting ? 0.7 : 1 }}
          >
            Mark All as Read
          </button>
        )}
      </div>

      {loading ? (
        <Loader text="Loading alerts..." />
      ) : alerts.length === 0 ? (
        <EmptyState icon="✅" title="No alerts found" description="Your system is running smoothly!" />
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {alerts.map((alert) => {
            const config = typeConfig[alert.type] || typeConfig.general;
            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: alert.isRead ? '#ffffff' : '#eff6ff',
                  border: `1px solid ${alert.isRead ? '#e2e8f0' : '#bfdbfe'}`,
                  borderRadius: '18px',
                  boxShadow: '0 8px 22px rgba(15, 23, 42, 0.06)',
                  padding: '1rem 1.1rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ width: '10px', paddingTop: '0.35rem' }}>
                  {!alert.isRead && <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb' }} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <Badge variant={config.variant} size="sm">{config.label}</Badge>
                    {alert.Equipment?.name && <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{alert.Equipment.name}</span>}
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ color: '#0f172a', fontWeight: alert.isRead ? '500' : '700', lineHeight: 1.6 }}>{alert.message}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAlert(alert);
                      setShowDeleteModal(true);
                    }}
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', fontWeight: '600' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedAlert(null); }} title="Delete Alert" size="sm">
        <p style={{ color: '#64748b', marginBottom: '1.25rem' }}>Are you sure you want to delete this alert?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={() => { setShowDeleteModal(false); setSelectedAlert(null); }} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#334155' }}>Cancel</button>
          <button onClick={handleDelete} disabled={submitting} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#dc2626', color: 'white', fontWeight: '600', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default Alerts;
