package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.DepartmentResponse;
import com.yourorg.appname.dto.response.HospitalResponse;
import com.yourorg.appname.entity.Hospital;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.DepartmentRepository;
import com.yourorg.appname.repository.HospitalRepository;
import com.yourorg.appname.service.HospitalService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;
    private final DepartmentRepository departmentRepository;
    private final EntityMapper mapper;

    public HospitalServiceImpl(
            HospitalRepository hospitalRepository,
            DepartmentRepository departmentRepository,
            EntityMapper mapper
    ) {
        this.hospitalRepository = hospitalRepository;
        this.departmentRepository = departmentRepository;
        this.mapper = mapper;
    }

    @Override
    public List<HospitalResponse> getAllHospitals(String search) {
        List<Hospital> hospitals;
        if (search != null && !search.trim().isEmpty()) {
            hospitals = hospitalRepository.findByCityContainingIgnoreCaseOrNameContainingIgnoreCase(search, search);
        } else {
            hospitals = hospitalRepository.findAll();
        }
        return hospitals.stream().map(mapper::toHospitalResponse).collect(Collectors.toList());
    }

    @Override
    public HospitalResponse getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital not found with id: " + id));
        return mapper.toHospitalResponse(hospital);
    }

    @Override
    public List<DepartmentResponse> getDepartmentsByHospital(Long hospitalId) {
        return departmentRepository.findByHospitalId(hospitalId).stream()
                .map(mapper::toDepartmentResponse)
                .collect(Collectors.toList());
    }
}
