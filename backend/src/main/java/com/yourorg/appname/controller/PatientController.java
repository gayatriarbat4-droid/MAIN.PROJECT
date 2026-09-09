package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.PatientProfileRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.MedicalRecordResponse;
import com.yourorg.appname.dto.response.PatientResponse;
import com.yourorg.appname.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<PatientResponse>> getMyProfile(Authentication authentication) {
        PatientResponse profile = patientService.getCurrentPatientProfile(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/me/profile")
    public ResponseEntity<ApiResponse<PatientResponse>> updateProfile(
            @RequestBody PatientProfileRequest request,
            Authentication authentication
    ) {
        PatientResponse updated = patientService.updatePatientProfile(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/me/records")
    public ResponseEntity<ApiResponse<List<MedicalRecordResponse>>> getMyRecords(Authentication authentication) {
        List<MedicalRecordResponse> records = patientService.getMedicalRecords(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(records));
    }
}
