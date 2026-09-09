import apiClient from './apiClient';
import { TOKEN_KEY, USER_KEY } from '../constants';

export const authService = {
  async login(username, password) {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data?.success && response.data?.data?.token) {
      const { token, user } = response.data.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return response.data;
  },

  async register(registrationData) {
    const response = await apiClient.post('/auth/register', registrationData);
    if (response.data?.success && response.data?.data?.token) {
      const { token, user } = response.data.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return response.data;
  },

  async verifyEmail({ token, otp, email }) {
    const response = await apiClient.post('/auth/verify-email', { token, otp, email });
    if (response.data?.success && response.data?.data?.token) {
      const { token: jwtToken, user } = response.data.data;
      localStorage.setItem(TOKEN_KEY, jwtToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return response.data;
  },

  async resendVerification(identifier) {
    const response = await apiClient.post('/auth/resend-verification', { identifier });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredUser() {
    const raw = localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;
