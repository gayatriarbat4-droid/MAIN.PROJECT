package com.yourorg.appname.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordResponse {
    private Long id;
    private Long patientId;
    private String recordType;
    private String title;
    private String fileUrl;
    private String fileSize;
    private String recordDate;
    private String notes;
}
