import API from './axios';

const issueService = {
  getAll: async () => {
    const response = await API.get('/issues');
    return response.data;
  },

  getPending: async () => {
    const response = await API.get('/issues/pending');
    return response.data;
  },

  getById: async (id) => {
    const response = await API.get(`/issues/${id}`);
    return response.data;
  },

  getMyRequests: async () => {
    const response = await API.get('/issues/my-requests');
    return response.data;
  },

  getByUser: async (userId) => {
    const response = await API.get(`/issues/user/${userId}`);
    return response.data;
  },

  requestEquipment: async (data) => {
    const response = await API.post('/issues/request', data);
    return response.data;
  },

  approve: async (id) => {
    const response = await API.put(`/issues/${id}/approve`);
    return response.data;
  },

  reject: async (id, reason) => {
    const response = await API.put(`/issues/${id}/reject`, { rejectionReason: reason });
    return response.data;
  },

  returnEquipment: async (id) => {
    const response = await API.put(`/issues/${id}/return`);
    return response.data;
  },
};

export default issueService;