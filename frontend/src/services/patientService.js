import apiClient from './apiClient';

export const patientService = {
  async getMyProfile() {
    const response = await apiClient.get('/patients/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await apiClient.put('/patients/me/profile', profileData);
    return response.data;
  },

  async getMyRecords() {
    const response = await apiClient.get('/patients/me/records');
    return response.data;
  },
};
