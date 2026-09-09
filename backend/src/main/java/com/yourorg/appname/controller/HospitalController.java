package com.yourorg.appname.controller;

import com.yourorg.appname.dto.response.ApiResponse;
import com.yourorg.appname.dto.response.DepartmentResponse;
import com.yourorg.appname.dto.response.HospitalResponse;
import com.yourorg.appname.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HospitalResponse>>> getAllHospitals(
            @RequestParam(required = false) String search
    ) {
        List<HospitalResponse> hospitals = hospitalService.getAllHospitals(search);
        return ResponseEntity.ok(ApiResponse.ok(hospitals));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HospitalResponse>> getHospitalById(@PathVariable Long id) {
        HospitalResponse hospital = hospitalService.getHospitalById(id);
        return ResponseEntity.ok(ApiResponse.ok(hospital));
    }

    @GetMapping("/{id}/departments")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartmentsByHospital(@PathVariable Long id) {
        List<DepartmentResponse> departments = hospitalService.getDepartmentsByHospital(id);
        return ResponseEntity.ok(ApiResponse.ok(departments));
    }
}
