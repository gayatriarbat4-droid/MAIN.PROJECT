package com.yourorg.appname.service;

public interface EmailService {
    void sendVerificationEmail(String toEmail, String fullName, String verificationToken, String otp);
}
