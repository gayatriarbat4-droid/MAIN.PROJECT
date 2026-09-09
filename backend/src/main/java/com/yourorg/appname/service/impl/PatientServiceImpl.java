package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.PatientProfileRequest;
import com.yourorg.appname.dto.response.MedicalRecordResponse;
import com.yourorg.appname.dto.response.PatientResponse;
import com.yourorg.appname.entity.Patient;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.MedicalRecordRepository;
import com.yourorg.appname.repository.PatientRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.service.PatientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final EntityMapper mapper;

    public PatientServiceImpl(
            PatientRepository patientRepository,
            UserRepository userRepository,
            MedicalRecordRepository medicalRecordRepository,
            EntityMapper mapper
    ) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.mapper = mapper;
    }

    @Override
    public PatientResponse getCurrentPatientProfile(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> {
                    Patient p = Patient.builder().user(user).build();
                    return patientRepository.save(p);
                });

        return mapper.toPatientResponse(patient);
    }

    @Override
    @Transactional
    public PatientResponse updatePatientProfile(PatientProfileRequest request, String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            user.setPhone(request.getPhone());
        }
        userRepository.save(user);

        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> Patient.builder().user(user).build());

        if (request.getDateOfBirth() != null) patient.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null) patient.setGender(request.getGender());
        if (request.getBloodGroup() != null) patient.setBloodGroup(request.getBloodGroup());
        if (request.getHeight() != null) patient.setHeight(request.getHeight());
        if (request.getWeight() != null) patient.setWeight(request.getWeight());
        if (request.getAddress() != null) patient.setAddress(request.getAddress());
        if (request.getEmergencyContactName() != null) patient.setEmergencyContactName(request.getEmergencyContactName());
        if (request.getEmergencyContactPhone() != null) patient.setEmergencyContactPhone(request.getEmergencyContactPhone());
        if (request.getAllergies() != null) patient.setAllergies(request.getAllergies());
        if (request.getChronicConditions() != null) patient.setChronicConditions(request.getChronicConditions());

        Patient saved = patientRepository.save(patient);
        return mapper.toPatientResponse(saved);
    }

    @Override
    public List<MedicalRecordResponse> getMedicalRecords(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        return medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId()).stream()
                .map(mapper::toMedicalRecordResponse)
                .collect(Collectors.toList());
    }
}
