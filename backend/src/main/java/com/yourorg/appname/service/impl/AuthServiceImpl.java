package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.LoginRequest;
import com.yourorg.appname.dto.request.RegisterRequest;
import com.yourorg.appname.dto.request.ResendVerificationRequest;
import com.yourorg.appname.dto.request.VerifyEmailRequest;
import com.yourorg.appname.dto.response.AuthResponse;
import com.yourorg.appname.dto.response.UserResponse;
import com.yourorg.appname.entity.Patient;
import com.yourorg.appname.entity.User;
import com.yourorg.appname.exception.BadRequestException;
import com.yourorg.appname.exception.ResourceNotFoundException;
import com.yourorg.appname.mapper.EntityMapper;
import com.yourorg.appname.repository.PatientRepository;
import com.yourorg.appname.repository.UserRepository;
import com.yourorg.appname.security.JwtUtil;
import com.yourorg.appname.service.AuthService;
import com.yourorg.appname.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EntityMapper mapper;
    private final EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:}")
    private String mailUsername;

    public AuthServiceImpl(
            UserRepository userRepository,
            PatientRepository patientRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            EntityMapper mapper,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.mapper = mapper;
        this.emailService = emailService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String cleanUsername = request.getUsername() != null ? request.getUsername().trim() : "";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(cleanUsername, request.getPassword())
        );

        User user = userRepository.findByUsernameIgnoreCase(cleanUsername)
                .or(() -> userRepository.findByEmailIgnoreCase(cleanUsername))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isEmailVerified()) {
            if (isDemoUser(user.getUsername()) || mailUsername == null || mailUsername.trim().isEmpty()) {
                user.setEmailVerified(true);
                user.setVerificationToken(null);
                user.setVerificationOtp(null);
                userRepository.save(user);
            } else {
                throw new BadRequestException("Your email address is not verified yet. Please check your inbox or click 'Resend Verification'.");
            }
        }

        String token = jwtUtil.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getExpirationMs())
                .user(mapper.toUserResponse(user))
                .requiresVerification(false)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        String verificationToken = UUID.randomUUID().toString();
        String otp = String.format("%06d", new java.security.SecureRandom().nextInt(1000000));
        boolean autoVerify = (mailUsername == null || mailUsername.trim().isEmpty());

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone() != null ? request.getPhone().trim() : "")
                .role("ROLE_PATIENT")
                .emailVerified(autoVerify)
                .verificationToken(verificationToken)
                .verificationOtp(otp)
                .verificationExpiresAt(LocalDateTime.now().plusHours(24))
                .build();

        User savedUser = userRepository.save(user);

        // Automatically initialize linked Patient profile
        Patient patient = Patient.builder()
                .user(savedUser)
                .address("")
                .bloodGroup("O+")
                .allergies("None documented")
                .chronicConditions("None")
                .build();
        patientRepository.save(patient);

        // Send verification email via EmailService
        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getFullName(), verificationToken, otp);

        String token = autoVerify ? jwtUtil.generateToken(savedUser.getUsername()) : null;
        Long expiresIn = autoVerify ? jwtUtil.getExpirationMs() : 0L;

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .expiresIn(expiresIn)
                .user(mapper.toUserResponse(savedUser))
                .requiresVerification(!autoVerify)
                .build();
    }

    @Override
    @Transactional
    public AuthResponse verifyEmail(VerifyEmailRequest request) {
        String token = request.getToken() != null ? request.getToken().trim() : null;
        String otp = request.getOtp() != null ? request.getOtp().trim() : null;

        User user = null;
        if (token != null && !token.isEmpty()) {
            user = userRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new BadRequestException("Invalid or expired verification token."));
        } else if (otp != null && !otp.isEmpty()) {
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                User candidate = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                        .or(() -> userRepository.findByUsernameIgnoreCase(request.getEmail().trim()))
                        .orElseThrow(() -> new BadRequestException("No account found for: " + request.getEmail().trim()));
                if (otp.equals(candidate.getVerificationOtp())) {
                    user = candidate;
                } else {
                    throw new BadRequestException("Invalid 6-digit verification code.");
                }
            } else {
                user = userRepository.findByVerificationOtp(otp)
                        .orElseThrow(() -> new BadRequestException("Invalid or expired 6-digit verification code."));
            }
        } else {
            throw new BadRequestException("Verification token or OTP code is required.");
        }

        if (user.getVerificationExpiresAt() != null && user.getVerificationExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code or link has expired. Please request a new one.");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationOtp(null);
        user.setVerificationExpiresAt(null);
        User verifiedUser = userRepository.save(user);

        String jwt = jwtUtil.generateToken(verifiedUser.getUsername());

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresIn(jwtUtil.getExpirationMs())
                .user(mapper.toUserResponse(verifiedUser))
                .requiresVerification(false)
                .build();
    }

    @Override
    @Transactional
    public void resendVerification(ResendVerificationRequest request) {
        String identifier = request.getIdentifier() != null ? request.getIdentifier().trim() : "";
        User user = userRepository.findByEmailIgnoreCase(identifier)
                .or(() -> userRepository.findByUsernameIgnoreCase(identifier))
                .orElseThrow(() -> new BadRequestException("No account found for: " + identifier));

        if (user.isEmailVerified()) {
            throw new BadRequestException("This account is already verified. You can sign in directly.");
        }

        String verificationToken = UUID.randomUUID().toString();
        String otp = String.format("%06d", new java.security.SecureRandom().nextInt(1000000));

        user.setVerificationToken(verificationToken);
        user.setVerificationOtp(otp);
        user.setVerificationExpiresAt(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken, otp);
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return mapper.toUserResponse(user);
    }

    private boolean isDemoUser(String username) {
        if (username == null) return false;
        String u = username.trim().toLowerCase();
        return u.equals("narkhade") || u.equals("mansinarkhade") ||
               u.equals("johnathan_vance") || u.equals("dr_collins") ||
               u.equals("admin_sarah") || u.equals("admin") || u.equals("dr_michael_collins");
    }
}
