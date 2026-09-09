package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.LoginRequest;
import com.yourorg.appname.dto.request.RegisterRequest;
import com.yourorg.appname.dto.request.ResendVerificationRequest;
import com.yourorg.appname.dto.request.VerifyEmailRequest;
import com.yourorg.appname.dto.response.AuthResponse;
import com.yourorg.appname.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse verifyEmail(VerifyEmailRequest request);
    void resendVerification(ResendVerificationRequest request);
    UserResponse getCurrentUser(String username);
}
