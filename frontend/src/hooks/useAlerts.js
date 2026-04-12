import { useAlertContext } from '../context/AlertContext';

export const useAlerts = () => {
  const context = useAlertContext();
  
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  
  return context;
};

export default useAlerts;