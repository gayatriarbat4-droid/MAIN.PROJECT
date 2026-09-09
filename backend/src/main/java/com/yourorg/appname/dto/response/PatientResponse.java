package com.yourorg.appname.dto.response;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponse {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
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
    private List<MedicalRecordResponse> medicalRecords;
}
