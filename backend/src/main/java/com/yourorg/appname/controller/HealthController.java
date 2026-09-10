package com.yourorg.appname.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping({"/", "/health", "/api/health"})
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "MediCare Hospital Management API",
                "message", "Backend is running smoothly and ready to accept requests!",
                "timestamp", LocalDateTime.now().toString(),
                "endpoints", Map.of(
                        "auth", "/api/auth",
                        "hospitals", "/api/hospitals",
                        "doctors", "/api/doctors",
                        "emergency", "/api/emergency"
                )
        ));
    }
}