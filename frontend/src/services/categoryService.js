import API from './axios';

const categoryService = {
  getAll: async () => {
    const response = await API.get('/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await API.post('/categories', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await API.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;