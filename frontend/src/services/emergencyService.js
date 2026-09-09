import apiClient from './apiClient';

export const emergencyService = {
  async submitIntake(intakeData) {
    const response = await apiClient.post('/emergency/intake', intakeData);
    return response.data;
  },

  async getStatus(requestCode) {
    const response = await apiClient.get(`/emergency/status/${requestCode}`);
    return response.data;
  },

  async getAllEmergencies() {
    const response = await apiClient.get('/emergency/all');
    return response.data;
  },
};
