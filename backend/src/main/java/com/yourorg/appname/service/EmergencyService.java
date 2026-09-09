package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.EmergencyIntakeRequest;
import com.yourorg.appname.dto.response.EmergencyResponse;

import java.util.List;

public interface EmergencyService {
    EmergencyResponse submitIntake(EmergencyIntakeRequest request);
    EmergencyResponse getEmergencyStatus(String requestCode);
    List<EmergencyResponse> getAllEmergencies();
}
