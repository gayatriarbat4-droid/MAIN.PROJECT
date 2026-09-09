package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.AppointmentRequest;
import com.yourorg.appname.dto.request.RescheduleRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.AppointmentResponse;
import com.yourorg.appname.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponse>> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication
    ) {
        AppointmentResponse response = appointmentService.createAppointment(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Appointment reserved successfully", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getMyAppointments(Authentication authentication) {
        List<AppointmentResponse> list = appointmentService.getAppointmentsForCurrentPatient(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse response = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/reference/{ref}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> getAppointmentByReference(@PathVariable String ref) {
        AppointmentResponse response = appointmentService.getAppointmentByReference(ref);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<AppointmentResponse>> rescheduleAppointment(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleRequest request,
            Authentication authentication
    ) {
        AppointmentResponse response = appointmentService.rescheduleAppointment(id, request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Appointment rescheduled successfully", response));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponse>> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication
    ) {
        AppointmentResponse response = appointmentService.cancelAppointment(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Appointment cancelled", response));
    }
}
