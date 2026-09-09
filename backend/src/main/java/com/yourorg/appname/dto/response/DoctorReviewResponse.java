package com.yourorg.appname.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorReviewResponse {
    private Long id;
    private Long doctorId;
    private String patientName;
    private BigDecimal rating;
    private String reviewDate;
    private String comment;
}
