package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.PatientProfileRequest;
import com.yourorg.appname.dto.response.MedicalRecordResponse;
import com.yourorg.appname.dto.response.PatientResponse;

import java.util.List;

public interface PatientService {
    PatientResponse getCurrentPatientProfile(String currentUsername);
    PatientResponse updatePatientProfile(PatientProfileRequest request, String currentUsername);
    List<MedicalRecordResponse> getMedicalRecords(String currentUsername);
}
