import API from './axios';

const maintenanceService = {
  getAll: async () => {
    const response = await API.get('/maintenance');
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/maintenance/${id}`);
    return response.data;
  },

  getByTechnician: async (technicianId) => {
    const response = await API.get(`/maintenance/technician/${technicianId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await API.post('/maintenance', data);
    return response.data;
  },

  complete: async (id, data) => {
    const response = await API.put(`/maintenance/${id}/complete`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/maintenance/${id}`);
    return response.data;
  },
};

export default maintenanceService;