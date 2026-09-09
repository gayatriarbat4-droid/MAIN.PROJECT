package com.yourorg.appname.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyResponse {
    private Long id;
    private String requestCode;
    private String patientName;
    private String patientPhone;
    private String incidentLocation;
    private String emergencyType;
    private String severity;
    private String status;
    private Integer etaMinutes;
    private String ambulanceUnit;
    private LocalDateTime createdAt;
}
