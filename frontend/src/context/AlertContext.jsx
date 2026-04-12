import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import alertService from '../services/alertService';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAlerts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await alertService.getAll();
      setAlerts(response.data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await alertService.getUnreadCount();
      setUnreadCount(response.data || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, []);

  const markAsRead = async (id) => {
    try {
      await alertService.markAsRead(id);
      setAlerts(prev => prev.map(alert => 
        alert.id === id ? { ...alert, isRead: true } : alert
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking alert as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await alertService.markAllAsRead();
      setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
      throw error;
    }
  };

  const deleteAlert = async (id) => {
    try {
      await alertService.delete(id);
      const alert = alerts.find(a => a.id === id);
      setAlerts(prev => prev.filter(a => a.id !== id));
      if (alert && !alert.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
      throw error;
    }
  };

  const reportDamage = async (data) => {
    try {
      const response = await alertService.reportDamage(data);
      await fetchAlerts();
      return response.data;
    } catch (error) {
      console.error('Error reporting damage:', error);
      throw error;
    }
  };

  const addAlert = useCallback((alert) => {
    setAlerts(prev => [alert, ...prev]);
    if (!alert.isRead) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
    fetchUnreadCount();
  }, [fetchAlerts, fetchUnreadCount]);

  return (
    <AlertContext.Provider
      value={{
        alerts,
        unreadCount,
        isLoading,
        fetchAlerts,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteAlert,
        reportDamage,
        addAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

export default AlertContext;