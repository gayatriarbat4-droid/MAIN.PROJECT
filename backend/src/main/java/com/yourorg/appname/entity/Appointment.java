package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_reference", nullable = false, unique = true, length = 50)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id", nullable = false)
    private Hospital hospital;

    @Column(name = "appointment_date", nullable = false, length = 50)
    private String appointmentDate;

    @Column(name = "time_slot", nullable = false, length = 50)
    private String timeSlot;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "CONFIRMED"; // CONFIRMED, RESCHEDULED, COMPLETED, CANCELLED

    @Column(name = "consultation_type", nullable = false, length = 50)
    @Builder.Default
    private String consultationType = "IN_CLINIC"; // IN_CLINIC, TELEHEALTH

    @Column(name = "primary_reason")
    private String primaryReason;

    @Column(name = "clinical_notes", columnDefinition = "TEXT")
    private String clinicalNotes;

    @Column(name = "insurance_provider")
    private String insuranceProvider;

    @Column(name = "policy_id")
    private String policyId;

    @Column(name = "copay_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal copayAmount = new BigDecimal("30.00");

    @Column(name = "total_fee", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalFee = new BigDecimal("250.00");

    @Column(name = "patient_full_name")
    private String patientFullName;

    @Column(name = "patient_phone")
    private String patientPhone;

    @Column(name = "patient_email")
    private String patientEmail;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
