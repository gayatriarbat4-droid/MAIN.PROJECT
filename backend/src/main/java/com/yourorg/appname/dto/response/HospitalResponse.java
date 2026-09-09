package com.yourorg.appname.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalResponse {
    private Long id;
    private String name;
    private String tagline;
    private String description;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String email;
    private BigDecimal rating;
    private Integer reviewCount;
    private String accreditation;
    private String traumaLevel;
    private String imageUrl;
    private Boolean emergencyOpen247;
    private Integer inpatientSuites;
    private Integer icuBeds;
    private Integer roboticOrSuites;
    private Integer dailyCapacity;
    private List<DepartmentResponse> departments;
}
