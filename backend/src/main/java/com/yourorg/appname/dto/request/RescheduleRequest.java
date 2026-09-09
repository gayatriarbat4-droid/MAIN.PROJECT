package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RescheduleRequest {
    @NotBlank(message = "New appointment date is required")
    private String newDate;

    @NotBlank(message = "New time slot is required")
    private String newTimeSlot;
}
