import API from './axios';

const locationService = {
  getAll: async () => {
    const response = await API.get('/locations');
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/locations/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await API.post('/locations', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await API.put(`/locations/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/locations/${id}`);
    return response.data;
  },
};

export default locationService;