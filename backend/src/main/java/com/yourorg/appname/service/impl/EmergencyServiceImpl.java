package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.EmergencyIntakeRequest;
import com.yourorg.appname.dto.response.EmergencyResponse;
import com.yourorg.appname.entity.EmergencyRequest;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.EmergencyRequestRepository;
import com.yourorg.appname.service.EmergencyService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmergencyServiceImpl implements EmergencyService {

    private final EmergencyRequestRepository emergencyRequestRepository;
    private final EntityMapper mapper;

    public EmergencyServiceImpl(EmergencyRequestRepository emergencyRequestRepository, EntityMapper mapper) {
        this.emergencyRequestRepository = emergencyRequestRepository;
        this.mapper = mapper;
    }

    @Override
    public EmergencyResponse submitIntake(EmergencyIntakeRequest request) {
        String requestCode = "EMG-" + (int)(1000 + Math.random() * 9000);
        int eta = 4 + (int)(Math.random() * 5); // 4 to 8 mins
        String unit = "Medic Unit " + (1 + (int)(Math.random() * 12));

        EmergencyRequest emergency = EmergencyRequest.builder()
                .requestCode(requestCode)
                .patientName(request.getPatientName())
                .patientPhone(request.getPatientPhone())
                .incidentLocation(request.getIncidentLocation())
                .emergencyType(request.getEmergencyType())
                .severity(request.getSeverity() != null ? request.getSeverity() : "CRITICAL")
                .status("DISPATCHED")
                .etaMinutes(eta)
                .ambulanceUnit(unit)
                .build();

        EmergencyRequest saved = emergencyRequestRepository.save(emergency);
        return mapper.toEmergencyResponse(saved);
    }

    @Override
    public EmergencyResponse getEmergencyStatus(String requestCode) {
        EmergencyRequest emergency = emergencyRequestRepository.findByRequestCode(requestCode)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency request not found for code: " + requestCode));
        return mapper.toEmergencyResponse(emergency);
    }

    @Override
    public List<EmergencyResponse> getAllEmergencies() {
        return emergencyRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(mapper::toEmergencyResponse)
                .collect(Collectors.toList());
    }
}
