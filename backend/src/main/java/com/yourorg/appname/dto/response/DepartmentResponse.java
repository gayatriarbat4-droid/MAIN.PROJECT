package com.yourorg.appname.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentResponse {
    private Long id;
    private Long hospitalId;
    private String name;
    private String description;
    private String iconName;
    private String headDoctorName;
}
