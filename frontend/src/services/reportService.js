import API from './axios';

const reportService = {
  getInventory: async () => {
    const response = await API.get('/reports/inventory');
    return response.data;
  },

  getIssues: async (startDate, endDate) => {
    const response = await API.get('/reports/issues', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  getMaintenance: async (status) => {
    const response = await API.get('/reports/maintenance', {
      params: { status },
    });
    return response.data;
  },

  getLowStock: async () => {
    const response = await API.get('/reports/low-stock');
    return response.data;
  },
};

export default reportService;