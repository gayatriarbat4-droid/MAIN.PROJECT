import apiClient from './apiClient';

export const doctorService = {
  async getAllDoctors({ search = '', departmentId = null, hospitalId = null } = {}) {
    const params = {};
    if (search) params.search = search;
    if (departmentId) params.departmentId = departmentId;
    if (hospitalId) params.hospitalId = hospitalId;

    const response = await apiClient.get('/doctors', { params });
    return response.data;
  },

  async getDoctorById(id) {
    const response = await apiClient.get(`/doctors/${id}`);
    return response.data;
  },

  async getDoctorSchedules(id, date = '') {
    const params = date ? { date } : {};
    const response = await apiClient.get(`/doctors/${id}/schedules`, { params });
    return response.data;
  },

  async getDoctorReviews(id) {
    const response = await apiClient.get(`/doctors/${id}/reviews`);
    return response.data;
  },
};
