import API from './axios';

const alertService = {
  getAll: async () => {
    const response = await API.get('/alerts');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await API.get('/alerts/unread/count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await API.put(`/alerts/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await API.put('/alerts/mark-all-read');
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/alerts/${id}`);
    return response.data;
  },

  reportDamage: async (data) => {
    const response = await API.post('/alerts/report-damage', data);
    return response.data;
  },
};

export default alertService;