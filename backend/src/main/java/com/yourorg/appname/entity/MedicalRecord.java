package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "record_type", nullable = false, length = 100)
    private String recordType; // LAB_REPORT, DIAGNOSTIC, DISCHARGE, PRESCRIPTION

    @Column(nullable = false)
    private String title;

    @Column(name = "file_url")
    private String fileUrl;

    @Column(name = "file_size")
    private String fileSize;

    @Column(name = "record_date")
    private String recordDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
