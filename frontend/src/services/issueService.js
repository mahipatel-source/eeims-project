import API from './axios';

const issueService = {
  getAll: async () => {
    const response = await API.get('/issues');
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/issues/${id}`);
    return response.data;
  },

  getByUser: async (userId) => {
    const response = await API.get(`/issues/user/${userId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await API.post('/issues', data);
    return response.data;
  },

  return: async (id) => {
    const response = await API.put(`/issues/${id}/return`);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/issues/${id}`);
    return response.data;
  },
};

export default issueService;