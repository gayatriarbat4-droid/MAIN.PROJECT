package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_code", nullable = false, unique = true, length = 50)
    private String requestCode;

    @Column(name = "patient_name", nullable = false, length = 150)
    private String patientName;

    @Column(name = "patient_phone", nullable = false, length = 50)
    private String patientPhone;

    @Column(name = "incident_location", nullable = false)
    private String incidentLocation;

    @Column(name = "emergency_type", nullable = false, length = 100)
    private String emergencyType;

    @Column(length = 50)
    @Builder.Default
    private String severity = "CRITICAL";

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "DISPATCHED"; // PENDING, DISPATCHED, EN_ROUTE, ARRIVED, RESOLVED

    @Column(name = "eta_minutes")
    @Builder.Default
    private Integer etaMinutes = 7;

    @Column(name = "ambulance_unit", length = 50)
    @Builder.Default
    private String ambulanceUnit = "Medic Unit 4";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
