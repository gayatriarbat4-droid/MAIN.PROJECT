package com.yourorg.appname.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponse {
    private Long id;
    private Long hospitalId;
    private String hospitalName;
    private Long departmentId;
    private String departmentName;
    private String name;
    private String title;
    private String specialty;
    private String licenseNumber;
    private Integer experienceYears;
    private String languages;
    private BigDecimal rating;
    private Integer reviewCount;
    private BigDecimal consultationFee;
    private String roomSuite;
    private String bio;
    private String education;
    private String avatarUrl;
    private Boolean availableThisWeek;
    private List<ScheduleResponse> availableSchedules;
    private List<DoctorReviewResponse> reviews;
}
