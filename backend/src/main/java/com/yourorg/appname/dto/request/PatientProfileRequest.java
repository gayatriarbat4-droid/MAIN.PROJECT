package com.yourorg.appname.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileRequest {
    private String fullName;
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String bloodGroup;
    private String height;
    private String weight;
    private String address;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String allergies;
    private String chronicConditions;
}
