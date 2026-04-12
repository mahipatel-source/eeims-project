import API from './axios';

const authService = {
  // login user
  login: async (email, password, role = null) => {
    const response = await API.post('/auth/login', { email, password, role });
    return response;
  },

  // get logged in user
  getMe: async () => {
    const response = await API.get('/auth/me');
    return response;
  },

  // logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authService;
