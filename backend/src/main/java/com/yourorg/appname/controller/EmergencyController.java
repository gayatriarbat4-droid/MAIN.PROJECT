package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.EmergencyIntakeRequest;
import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.EmergencyResponse;
import com.yourorg.appname.service.EmergencyService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @PostMapping("/intake")
    public ResponseEntity<ApiResponse<EmergencyResponse>> submitIntake(@Valid @RequestBody EmergencyIntakeRequest request) {
        EmergencyResponse response = emergencyService.submitIntake(request);
        return ResponseEntity.ok(ApiResponse.ok("Emergency dispatch initiated", response));
    }

    @GetMapping("/status/{requestCode}")
    public ResponseEntity<ApiResponse<EmergencyResponse>> getStatus(@PathVariable String requestCode) {
        EmergencyResponse response = emergencyService.getEmergencyStatus(requestCode);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<EmergencyResponse>>> getAllEmergencies() {
        List<EmergencyResponse> list = emergencyService.getAllEmergencies();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
