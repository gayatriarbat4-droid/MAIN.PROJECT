package com.yourorg.appname.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String name;

    private String tagline;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    private String state;

    @Column(name = "zip_code")
    private String zipCode;

    private String phone;

    private String email;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column(name = "review_count")
    private Integer reviewCount;

    private String accreditation;

    @Column(name = "trauma_level")
    private String traumaLevel;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "emergency_open_247")
    @Builder.Default
    private Boolean emergencyOpen247 = true;

    @Column(name = "inpatient_suites")
    private Integer inpatientSuites;

    @Column(name = "icu_beds")
    private Integer icuBeds;

    @Column(name = "robotic_or_suites")
    private Integer roboticOrSuites;

    @Column(name = "daily_capacity")
    private Integer dailyCapacity;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Department> departments = new ArrayList<>();

    @OneToMany(mappedBy = "hospital", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Doctor> doctors = new ArrayList<>();
}
