package com.yourorg.appname.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentResponse {
    private Long id;
    private String bookingReference;
    private Long patientId;
    private String patientName;
    private String patientPhone;
    private String patientEmail;
    private Long doctorId;
    private String doctorName;
    private String doctorTitle;
    private String doctorSpecialty;
    private String doctorAvatarUrl;
    private String doctorRoomSuite;
    private Long hospitalId;
    private String hospitalName;
    private String hospitalAddress;
    private String appointmentDate;
    private String timeSlot;
    private String status;
    private String consultationType;
    private String primaryReason;
    private String clinicalNotes;
    private String insuranceProvider;
    private String policyId;
    private BigDecimal copayAmount;
    private BigDecimal totalFee;
    private LocalDateTime createdAt;
}
