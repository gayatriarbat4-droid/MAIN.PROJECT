package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyIntakeRequest {
    @NotBlank(message = "Patient name is required")
    private String patientName;

    @NotBlank(message = "Phone number is required")
    private String patientPhone;

    @NotBlank(message = "Incident location is required")
    private String incidentLocation;

    @NotBlank(message = "Emergency classification is required")
    private String emergencyType;

    private String severity;
    private String additionalNotes;
}
