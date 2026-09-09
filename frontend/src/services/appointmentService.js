import apiClient from './apiClient';

export const appointmentService = {
  async createAppointment(appointmentData) {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  },

  async getMyAppointments() {
    const response = await apiClient.get('/appointments/my');
    return response.data;
  },

  async getAppointmentById(id) {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  async getAppointmentByReference(reference) {
    const response = await apiClient.get(`/appointments/reference/${reference}`);
    return response.data;
  },

  async rescheduleAppointment(id, newDate, newTimeSlot) {
    const response = await apiClient.put(`/appointments/${id}/reschedule`, {
      newDate,
      newTimeSlot,
    });
    return response.data;
  },

  async cancelAppointment(id) {
    const response = await apiClient.put(`/appointments/${id}/cancel`);
    return response.data;
  },
};
