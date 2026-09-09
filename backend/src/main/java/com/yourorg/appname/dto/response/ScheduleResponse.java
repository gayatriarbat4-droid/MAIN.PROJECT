package com.yourorg.appname.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleResponse {
    private Long id;
    private Long doctorId;
    private String availableDate;
    private String timeSlot;
    private Boolean isBooked;
}
