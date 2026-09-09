package com.yourorg.appname.service;

import com.yourorg.appname.dto.response.DepartmentResponse;
import com.yourorg.appname.dto.response.HospitalResponse;

import java.util.List;

public interface HospitalService {
    List<HospitalResponse> getAllHospitals(String search);
    HospitalResponse getHospitalById(Long id);
    List<DepartmentResponse> getDepartmentsByHospital(Long hospitalId);
}
