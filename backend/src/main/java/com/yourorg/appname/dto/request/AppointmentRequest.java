package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentRequest {
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    private Long hospitalId;

    @NotNull(message = "Appointment date is required")
    private String appointmentDate;

    @NotNull(message = "Time slot is required")
    private String timeSlot;

    @Builder.Default
    private String consultationType = "IN_CLINIC"; // IN_CLINIC, TELEHEALTH

    private String primaryReason;
    private String clinicalNotes;
    private String insuranceProvider;
    private String policyId;
    private BigDecimal copayAmount;
    private BigDecimal totalFee;

    // Optional patient info if booking for family
    private Boolean isBookingForSelf;
    private String patientFullName;
    private String patientPhone;
    private String patientEmail;
}
