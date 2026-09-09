package com.yourorg.appname.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyEmailRequest {
    private String token;
    private String otp;
    private String email;
}
