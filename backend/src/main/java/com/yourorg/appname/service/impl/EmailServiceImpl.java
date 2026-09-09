package com.yourorg.appname.service.impl;

import com.yourorg.appname.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    public EmailServiceImpl(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendVerificationEmail(String toEmail, String fullName, String verificationToken, String otp) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + verificationToken;

        // Print to console banner so developer/tester can always verify immediately in dev mode
        logVerificationBanner(toEmail, fullName, verificationUrl, otp);

        // If SMTP sender is available and username is configured, attempt real email delivery
        if (mailSender != null && mailUsername != null && !mailUsername.trim().isEmpty()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setTo(toEmail);
                helper.setFrom(mailUsername, "MediCare Sanctuary");
                helper.setSubject("Verify Your MediCare HealthPass™ Account");
                helper.setText(buildHtmlEmail(fullName, verificationUrl, otp), true);

                mailSender.send(message);
                log.info("Verification email successfully dispatched via SMTP to {}", toEmail);
            } catch (Exception e) {
                log.warn("SMTP dispatch to {} was not completed: {}. Verification link logged to console.", toEmail, e.getMessage());
            }
        }
    }

    private void logVerificationBanner(String toEmail, String fullName, String verificationUrl, String otp) {
        System.out.println("=================================================================================");
        System.out.println(" [MediCare EMAIL DISPATCH]");
        System.out.println(" To: " + fullName + " <" + toEmail + ">");
        System.out.println(" Verification Link: " + verificationUrl);
        System.out.println(" 6-Digit OTP Code : " + otp);
        System.out.println(" (Valid for 24 hours)");
        System.out.println("=================================================================================");
    }

    private String buildHtmlEmail(String fullName, String verificationUrl, String otp) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f5; margin: 0; padding: 20px; }
                    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
                    .header { background: #00543b; color: #ffffff; padding: 32px 24px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
                    .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.85; }
                    .content { padding: 32px 24px; color: #161c27; line-height: 1.6; }
                    .greeting { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
                    .cta-btn { display: inline-block; background-color: #00543b; color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px; margin: 20px 0; }
                    .otp-box { background-color: #f0fdf4; border: 1.5px dashed #16a34a; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
                    .otp-code { font-family: monospace; font-size: 28px; font-weight: 700; letter-spacing: 6px; color: #00543b; margin: 8px 0; }
                    .footer { padding: 20px 24px; background: #f9f9ff; font-size: 12px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>MediCare HealthPass™</h1>
                        <p>Clinical Sanctuary & Specialty Care Network</p>
                    </div>
                    <div class="content">
                        <div class="greeting">Welcome, %s!</div>
                        <p>Thank you for creating your MediCare HealthPass™ patient account. To activate your account and securely access appointments and records, please verify your email address.</p>
                        
                        <div style="text-align: center;">
                            <a href="%s" class="cta-btn">Verify Email Address</a>
                        </div>
                        
                        <p style="text-align: center; margin-top: 4px; font-size: 13px; color: #64748b;">Or enter this 6-digit verification code on the verification screen:</p>
                        
                        <div class="otp-box">
                            <span style="font-size: 12px; text-transform: uppercase; color: #15803d; font-weight: 700; letter-spacing: 1px;">One-Time Security Code</span>
                            <div class="otp-code">%s</div>
                            <span style="font-size: 11px; color: #64748b;">This code expires in 24 hours</span>
                        </div>
                        
                        <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">If you did not create a MediCare account, you can safely ignore this email.</p>
                    </div>
                    <div class="footer">
                        MediCare Health System &copy; 2026. All rights reserved.<br>
                        Confidential Patient Communication
                    </div>
                </div>
            </body>
            </html>
            """.formatted(fullName, verificationUrl, otp);
    }
}
