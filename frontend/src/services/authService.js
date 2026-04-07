import API from './axios';

const authService = {
  // login user
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data;
  },

  // get logged in user
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  // logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;