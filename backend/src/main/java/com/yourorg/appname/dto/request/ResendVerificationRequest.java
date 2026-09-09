package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResendVerificationRequest {
    @NotBlank(message = "Email or username is required")
    private String identifier;
}
