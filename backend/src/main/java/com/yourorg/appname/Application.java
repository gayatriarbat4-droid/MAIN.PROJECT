package com.yourorg.appname;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        String activeProfile = System.getProperty("spring.profiles.active");
        if (activeProfile == null) {
            activeProfile = System.getenv("SPRING_PROFILES_ACTIVE");
        }

        String envDbUrl = System.getenv("DATABASE_URL");
        String render = System.getenv("RENDER");

        if (activeProfile == null || activeProfile.isBlank()) {
            if (envDbUrl != null && !envDbUrl.isBlank()) {
                System.out.println(" [MediCare] DATABASE_URL detected. Activating postgres profile.");
                System.setProperty("spring.profiles.active", "postgres");
            } else if ("true".equalsIgnoreCase(render) || System.getenv("PORT") != null) {
                // Cloud container environment without DATABASE_URL: activate embedded H2 database
                System.out.println(" [MediCare] Cloud container detected without DATABASE_URL. Activating in-memory dev profile.");
                System.setProperty("spring.profiles.active", "dev");
            } else {
                // Local development on Windows: check if MSSQL is listening on port 60643 or 1433
                boolean mssqlReachable = isPortReachable("localhost", 60643, 800) || isPortReachable("localhost", 1433, 800);
                if (!mssqlReachable) {
                    System.out.println(" [MediCare] SQL Server not reachable. Falling back to dev profile.");
                    System.setProperty("spring.profiles.active", "dev");
                } else {
                    System.out.println(" [MediCare] SQL Server detected locally on port 60643/1433. Running with MSSQL.");
                }
            }
        }

        SpringApplication.run(Application.class, args);
    }

    private static boolean isPortReachable(String host, int port, int timeoutMs) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), timeoutMs);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}