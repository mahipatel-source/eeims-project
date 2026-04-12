import { useState, useCallback, useEffect } from 'react';
import equipmentService from '../services/equipmentService';

export const useEquipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [currentEquipment, setCurrentEquipment] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (params) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await equipmentService.getAll(params);
      setEquipment(response.data || []);
      return response.data || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch equipment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchById = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await equipmentService.getById(id);
      setCurrentEquipment(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch equipment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchLowStock = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await equipmentService.getLowStock();
      setLowStockItems(response.data || []);
      return response.data || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch low stock items');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const create = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await equipmentService.create(data);
      setEquipment(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create equipment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const update = useCallback(async (id, data) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await equipmentService.update(id, data);
      setEquipment(prev => prev.map(item => 
        item.id === id ? response.data : item
      ));
      if (currentEquipment?.id === id) {
        setCurrentEquipment(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update equipment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentEquipment]);

  const remove = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      await equipmentService.delete(id);
      setEquipment(prev => prev.filter(item => item.id !== id));
      if (currentEquipment?.id === id) {
        setCurrentEquipment(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete equipment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentEquipment]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    equipment,
    currentEquipment,
    lowStockItems,
    isLoading,
    error,
    fetchAll,
    fetchById,
    fetchLowStock,
    create,
    update,
    remove,
    clearError,
  };
};

export default useEquipment;