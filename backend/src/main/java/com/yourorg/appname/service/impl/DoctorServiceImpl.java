package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.response.DoctorResponse;
import com.yourorg.appname.dto.response.DoctorReviewResponse;
import com.yourorg.appname.dto.response.ScheduleResponse;
import com.yourorg.appname.entity.Doctor;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.DoctorRepository;
import com.yourorg.appname.repository.DoctorReviewRepository;
import com.yourorg.appname.repository.DoctorScheduleRepository;
import com.yourorg.appname.service.DoctorService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorReviewRepository doctorReviewRepository;
    private final EntityMapper mapper;

    public DoctorServiceImpl(
            DoctorRepository doctorRepository,
            DoctorScheduleRepository doctorScheduleRepository,
            DoctorReviewRepository doctorReviewRepository,
            EntityMapper mapper
    ) {
        this.doctorRepository = doctorRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.doctorReviewRepository = doctorReviewRepository;
        this.mapper = mapper;
    }

    @Override
    public List<DoctorResponse> getAllDoctors(String search, Long departmentId, Long hospitalId) {
        List<Doctor> doctors;
        if (hospitalId != null) {
            doctors = doctorRepository.findByHospitalId(hospitalId);
        } else if (departmentId != null) {
            doctors = doctorRepository.findByDepartmentId(departmentId);
        } else if (search != null && !search.trim().isEmpty()) {
            doctors = doctorRepository.findByNameContainingIgnoreCaseOrSpecialtyContainingIgnoreCase(search, search);
        } else {
            doctors = doctorRepository.findAll();
        }
        return doctors.stream().map(mapper::toDoctorResponse).collect(Collectors.toList());
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapper.toDoctorResponse(doctor);
    }

    @Override
    public List<ScheduleResponse> getDoctorSchedules(Long doctorId, String date) {
        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException("Doctor not found with id: " + doctorId);
        }
        if (date != null && !date.trim().isEmpty()) {
            return doctorScheduleRepository.findByDoctorIdAndAvailableDate(doctorId, date).stream()
                    .map(mapper::toScheduleResponse)
                    .collect(Collectors.toList());
        }
        return doctorScheduleRepository.findByDoctorId(doctorId).stream()
                .map(mapper::toScheduleResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorReviewResponse> getDoctorReviews(Long doctorId) {
        return doctorReviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(mapper::toDoctorReviewResponse)
                .collect(Collectors.toList());
    }
}
