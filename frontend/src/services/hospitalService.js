import apiClient from './apiClient';

export const hospitalService = {
  async getAllHospitals(search = '') {
    const params = search ? { search } : {};
    const response = await apiClient.get('/hospitals', { params });
    return response.data;
  },

  async getHospitalById(id) {
    const response = await apiClient.get(`/hospitals/${id}`);
    return response.data;
  },

  async getDepartments(hospitalId) {
    const response = await apiClient.get(`/hospitals/${hospitalId}/departments`);
    return response.data;
  },
};
