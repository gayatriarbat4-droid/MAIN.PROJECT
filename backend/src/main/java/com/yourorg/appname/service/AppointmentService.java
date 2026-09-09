package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.AppointmentRequest;
import com.yourorg.appname.dto.request.RescheduleRequest;
import com.yourorg.appname.dto.response.AppointmentResponse;

import java.util.List;

public interface AppointmentService {
    AppointmentResponse createAppointment(AppointmentRequest request, String currentUsername);
    AppointmentResponse getAppointmentById(Long id);
    AppointmentResponse getAppointmentByReference(String reference);
    List<AppointmentResponse> getAppointmentsForCurrentPatient(String currentUsername);
    AppointmentResponse rescheduleAppointment(Long id, RescheduleRequest request, String currentUsername);
    AppointmentResponse cancelAppointment(Long id, String currentUsername);
    List<AppointmentResponse> getAllAppointments();
}
