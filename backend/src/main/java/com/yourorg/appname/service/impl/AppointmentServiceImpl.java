package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.AppointmentRequest;
import com.yourorg.appname.dto.request.RescheduleRequest;
import com.yourorg.appname.dto.response.AppointmentResponse;
import com.yourorg.appname.entity.*;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.*;
import com.yourorg.appname.service.AppointmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final EntityMapper mapper;

    public AppointmentServiceImpl(
            AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            HospitalRepository hospitalRepository,
            PatientRepository patientRepository,
            UserRepository userRepository,
            DoctorScheduleRepository doctorScheduleRepository,
            EntityMapper mapper
    ) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request, String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Patient patient = patientRepository.findByUser(user)
                .orElseGet(() -> {
                    Patient newP = Patient.builder().user(user).build();
                    return patientRepository.save(newP);
                });

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + request.getDoctorId()));

        Hospital hospital = (request.getHospitalId() != null)
                ? hospitalRepository.findById(request.getHospitalId()).orElse(doctor.getHospital())
                : doctor.getHospital();

        // Generate distinctive booking reference, e.g. MC-XXXXX
        String bookingRef = "MC-" + (int)(10000 + Math.random() * 90000);

        // Mark schedule slot booked if exists
        doctorScheduleRepository.findByDoctorIdAndAvailableDateAndTimeSlot(
                doctor.getId(), request.getAppointmentDate(), request.getTimeSlot()
        ).ifPresent(schedule -> {
            schedule.setIsBooked(true);
            doctorScheduleRepository.save(schedule);
        });

        Appointment appointment = Appointment.builder()
                .bookingReference(bookingRef)
                .patient(patient)
                .doctor(doctor)
                .hospital(hospital)
                .appointmentDate(request.getAppointmentDate())
                .timeSlot(request.getTimeSlot())
                .status("CONFIRMED")
                .consultationType(request.getConsultationType() != null ? request.getConsultationType() : "IN_CLINIC")
                .primaryReason(request.getPrimaryReason())
                .clinicalNotes(request.getClinicalNotes())
                .insuranceProvider(request.getInsuranceProvider() != null ? request.getInsuranceProvider() : "Blue Cross Blue Shield")
                .policyId(request.getPolicyId() != null ? request.getPolicyId() : "BCBS-8894102-01")
                .copayAmount(request.getCopayAmount() != null ? request.getCopayAmount() : new BigDecimal("30.00"))
                .totalFee(request.getTotalFee() != null ? request.getTotalFee() : doctor.getConsultationFee())
                .patientFullName(Boolean.FALSE.equals(request.getIsBookingForSelf()) && request.getPatientFullName() != null ?
                        request.getPatientFullName() : user.getFullName())
                .patientPhone(request.getPatientPhone() != null ? request.getPatientPhone() : user.getPhone())
                .patientEmail(request.getPatientEmail() != null ? request.getPatientEmail() : user.getEmail())
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return mapper.toAppointmentResponse(saved);
    }

    @Override
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapper.toAppointmentResponse(appointment);
    }

    @Override
    public AppointmentResponse getAppointmentByReference(String reference) {
        Appointment appointment = appointmentRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with reference: " + reference));
        return mapper.toAppointmentResponse(appointment);
    }

    @Override
    public List<AppointmentResponse> getAppointmentsForCurrentPatient(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found for user: " + currentUsername));

        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patient.getId()).stream()
                .map(mapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentResponse rescheduleAppointment(Long id, RescheduleRequest request, String currentUsername) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setAppointmentDate(request.getNewDate());
        appointment.setTimeSlot(request.getNewTimeSlot());
        appointment.setStatus("RESCHEDULED");

        Appointment saved = appointmentRepository.save(appointment);
        return mapper.toAppointmentResponse(saved);
    }

    @Override
    @Transactional
    public AppointmentResponse cancelAppointment(Long id, String currentUsername) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        appointment.setStatus("CANCELLED");
        Appointment saved = appointmentRepository.save(appointment);
        return mapper.toAppointmentResponse(saved);
    }

    @Override
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(mapper::toAppointmentResponse)
                .collect(Collectors.toList());
    }
}
