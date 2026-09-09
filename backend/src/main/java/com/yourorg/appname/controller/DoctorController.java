package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.DoctorResponse;
import com.yourorg.appname.dto.response.DoctorReviewResponse;
import com.yourorg.appname.dto.response.ScheduleResponse;
import com.yourorg.appname.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long hospitalId
    ) {
        List<DoctorResponse> doctors = doctorService.getAllDoctors(search, departmentId, hospitalId);
        return ResponseEntity.ok(ApiResponse.ok(doctors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.ok(doctor));
    }

    @GetMapping("/{id}/schedules")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getDoctorSchedules(
            @PathVariable Long id,
            @RequestParam(required = false) String date
    ) {
        List<ScheduleResponse> schedules = doctorService.getDoctorSchedules(id, date);
        return ResponseEntity.ok(ApiResponse.ok(schedules));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<ApiResponse<List<DoctorReviewResponse>>> getDoctorReviews(@PathVariable Long id) {
        List<DoctorReviewResponse> reviews = doctorService.getDoctorReviews(id);
        return ResponseEntity.ok(ApiResponse.ok(reviews));
    }
}
