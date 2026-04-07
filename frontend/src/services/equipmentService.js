import API from './axios';

const equipmentService = {
  getAll: async (params) => {
    const response = await API.get('/equipment', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/equipment/${id}`);
    return response.data;
  },

  getLowStock: async () => {
    const response = await API.get('/equipment/low-stock');
    return response.data;
  },

  create: async (data) => {
    const response = await API.post('/equipment', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await API.put(`/equipment/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/equipment/${id}`);
    return response.data;
  },
};

export default equipmentService;