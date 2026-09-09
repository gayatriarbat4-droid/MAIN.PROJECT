package com.yourorg.appname;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        // If no active profile was specified explicitly, check if SQL Server (port 1433) is reachable
        if (System.getProperty("spring.profiles.active") == null && System.getenv("SPRING_PROFILES_ACTIVE") == null) {
            boolean mssqlReachable = isPortReachable("localhost", 1433, 800);
            if (!mssqlReachable) {
                System.out.println("=================================================================================");
                System.out.println(" [MediCare] Microsoft SQL Server port 1433 is not reachable.");
                System.out.println(" [MediCare] Auto-activating embedded in-memory database (dev profile)...");
                System.out.println(" [MediCare] (To connect to MSSQL: right-click database/enable-mssql-tcp.bat as admin)");
                System.out.println("=================================================================================");
                System.setProperty("spring.profiles.default", "dev");
            } else {
                System.out.println(" [MediCare] Microsoft SQL Server detected on port 1433. Using MSSQL profile.");
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
