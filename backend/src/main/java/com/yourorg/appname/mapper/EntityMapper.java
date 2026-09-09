package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.*;
import com.yourorg.appname.entity.*;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class EntityMapper {

    public UserResponse toUserResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .emailVerified(user.isEmailVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    public HospitalResponse toHospitalResponse(Hospital hospital) {
        if (hospital == null) return null;
        return HospitalResponse.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .tagline(hospital.getTagline())
                .description(hospital.getDescription())
                .address(hospital.getAddress())
                .city(hospital.getCity())
                .state(hospital.getState())
                .zipCode(hospital.getZipCode())
                .phone(hospital.getPhone())
                .email(hospital.getEmail())
                .rating(hospital.getRating())
                .reviewCount(hospital.getReviewCount())
                .accreditation(hospital.getAccreditation())
                .traumaLevel(hospital.getTraumaLevel())
                .imageUrl(hospital.getImageUrl())
                .emergencyOpen247(hospital.getEmergencyOpen247())
                .inpatientSuites(hospital.getInpatientSuites())
                .icuBeds(hospital.getIcuBeds())
                .roboticOrSuites(hospital.getRoboticOrSuites())
                .dailyCapacity(hospital.getDailyCapacity())
                .departments(hospital.getDepartments() != null ?
                        hospital.getDepartments().stream().map(this::toDepartmentResponse).collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }

    public DepartmentResponse toDepartmentResponse(Department department) {
        if (department == null) return null;
        return DepartmentResponse.builder()
                .id(department.getId())
                .hospitalId(department.getHospital() != null ? department.getHospital().getId() : null)
                .name(department.getName())
                .description(department.getDescription())
                .iconName(department.getIconName())
                .headDoctorName(department.getHeadDoctorName())
                .build();
    }

    public DoctorResponse toDoctorResponse(Doctor doctor) {
        if (doctor == null) return null;
        return DoctorResponse.builder()
                .id(doctor.getId())
                .hospitalId(doctor.getHospital() != null ? doctor.getHospital().getId() : null)
                .hospitalName(doctor.getHospital() != null ? doctor.getHospital().getName() : null)
                .departmentId(doctor.getDepartment() != null ? doctor.getDepartment().getId() : null)
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getName() : null)
                .name(doctor.getName())
                .title(doctor.getTitle())
                .specialty(doctor.getSpecialty())
                .licenseNumber(doctor.getLicenseNumber())
                .experienceYears(doctor.getExperienceYears())
                .languages(doctor.getLanguages())
                .rating(doctor.getRating())
                .reviewCount(doctor.getReviewCount())
                .consultationFee(doctor.getConsultationFee())
                .roomSuite(doctor.getRoomSuite())
                .bio(doctor.getBio())
                .education(doctor.getEducation())
                .avatarUrl(doctor.getAvatarUrl())
                .availableThisWeek(doctor.getAvailableThisWeek())
                .availableSchedules(doctor.getSchedules() != null ?
                        doctor.getSchedules().stream().map(this::toScheduleResponse).collect(Collectors.toList())
                        : Collections.emptyList())
                .reviews(doctor.getReviews() != null ?
                        doctor.getReviews().stream().map(this::toDoctorReviewResponse).collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }

    public ScheduleResponse toScheduleResponse(DoctorSchedule schedule) {
        if (schedule == null) return null;
        return ScheduleResponse.builder()
                .id(schedule.getId())
                .doctorId(schedule.getDoctor() != null ? schedule.getDoctor().getId() : null)
                .availableDate(schedule.getAvailableDate())
                .timeSlot(schedule.getTimeSlot())
                .isBooked(schedule.getIsBooked())
                .build();
    }

    public DoctorReviewResponse toDoctorReviewResponse(DoctorReview review) {
        if (review == null) return null;
        return DoctorReviewResponse.builder()
                .id(review.getId())
                .doctorId(review.getDoctor() != null ? review.getDoctor().getId() : null)
                .patientName(review.getPatientName())
                .rating(review.getRating())
                .reviewDate(review.getReviewDate())
                .comment(review.getComment())
                .build();
    }

    public AppointmentResponse toAppointmentResponse(Appointment appointment) {
        if (appointment == null) return null;
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .bookingReference(appointment.getBookingReference())
                .patientId(appointment.getPatient() != null ? appointment.getPatient().getId() : null)
                .patientName(appointment.getPatientFullName() != null ? appointment.getPatientFullName() :
                        (appointment.getPatient() != null && appointment.getPatient().getUser() != null ?
                                appointment.getPatient().getUser().getFullName() : null))
                .patientPhone(appointment.getPatientPhone() != null ? appointment.getPatientPhone() :
                        (appointment.getPatient() != null && appointment.getPatient().getUser() != null ?
                                appointment.getPatient().getUser().getPhone() : null))
                .patientEmail(appointment.getPatientEmail() != null ? appointment.getPatientEmail() :
                        (appointment.getPatient() != null && appointment.getPatient().getUser() != null ?
                                appointment.getPatient().getUser().getEmail() : null))
                .doctorId(appointment.getDoctor() != null ? appointment.getDoctor().getId() : null)
                .doctorName(appointment.getDoctor() != null ? appointment.getDoctor().getName() : null)
                .doctorTitle(appointment.getDoctor() != null ? appointment.getDoctor().getTitle() : null)
                .doctorSpecialty(appointment.getDoctor() != null ? appointment.getDoctor().getSpecialty() : null)
                .doctorAvatarUrl(appointment.getDoctor() != null ? appointment.getDoctor().getAvatarUrl() : null)
                .doctorRoomSuite(appointment.getDoctor() != null ? appointment.getDoctor().getRoomSuite() : null)
                .hospitalId(appointment.getHospital() != null ? appointment.getHospital().getId() : null)
                .hospitalName(appointment.getHospital() != null ? appointment.getHospital().getName() : null)
                .hospitalAddress(appointment.getHospital() != null ? appointment.getHospital().getAddress() : null)
                .appointmentDate(appointment.getAppointmentDate())
                .timeSlot(appointment.getTimeSlot())
                .status(appointment.getStatus())
                .consultationType(appointment.getConsultationType())
                .primaryReason(appointment.getPrimaryReason())
                .clinicalNotes(appointment.getClinicalNotes())
                .insuranceProvider(appointment.getInsuranceProvider())
                .policyId(appointment.getPolicyId())
                .copayAmount(appointment.getCopayAmount())
                .totalFee(appointment.getTotalFee())
                .createdAt(appointment.getCreatedAt())
                .build();
    }

    public PatientResponse toPatientResponse(Patient patient) {
        if (patient == null) return null;
        User u = patient.getUser();
        return PatientResponse.builder()
                .id(patient.getId())
                .userId(u != null ? u.getId() : null)
                .username(u != null ? u.getUsername() : null)
                .fullName(u != null ? u.getFullName() : null)
                .email(u != null ? u.getEmail() : null)
                .phone(u != null ? u.getPhone() : null)
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .height(patient.getHeight())
                .weight(patient.getWeight())
                .address(patient.getAddress())
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactPhone(patient.getEmergencyContactPhone())
                .allergies(patient.getAllergies())
                .chronicConditions(patient.getChronicConditions())
                .medicalRecords(patient.getMedicalRecords() != null ?
                        patient.getMedicalRecords().stream().map(this::toMedicalRecordResponse).collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }

    public MedicalRecordResponse toMedicalRecordResponse(MedicalRecord record) {
        if (record == null) return null;
        return MedicalRecordResponse.builder()
                .id(record.getId())
                .patientId(record.getPatient() != null ? record.getPatient().getId() : null)
                .recordType(record.getRecordType())
                .title(record.getTitle())
                .fileUrl(record.getFileUrl())
                .fileSize(record.getFileSize())
                .recordDate(record.getRecordDate())
                .notes(record.getNotes())
                .build();
    }

    public EmergencyResponse toEmergencyResponse(EmergencyRequest emergency) {
        if (emergency == null) return null;
        return EmergencyResponse.builder()
                .id(emergency.getId())
                .requestCode(emergency.getRequestCode())
                .patientName(emergency.getPatientName())
                .patientPhone(emergency.getPatientPhone())
                .incidentLocation(emergency.getIncidentLocation())
                .emergencyType(emergency.getEmergencyType())
                .severity(emergency.getSeverity())
                .status(emergency.getStatus())
                .etaMinutes(emergency.getEtaMinutes())
                .ambulanceUnit(emergency.getAmbulanceUnit())
                .createdAt(emergency.getCreatedAt())
                .build();
    }
}
