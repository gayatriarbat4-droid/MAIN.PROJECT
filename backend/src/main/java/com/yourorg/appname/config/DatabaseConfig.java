package com.yourorg.appname.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Production Database Configuration for Render Cloud PostgreSQL.
 * Activated only when spring.profiles.active contains 'postgres'.
 *
 * Automatically parses cloud DATABASE_URL (e.g. postgres://user:pass@host:port/dbname)
 * into a standard JDBC HikariDataSource with SSL enabled.
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${spring.datasource.url:#{null}}")
    private String fallbackUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String fallbackUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String fallbackPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Render and other PaaS providers inject DATABASE_URL into environment
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = databaseUrl;
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        if (envDbUrl != null && !envDbUrl.isBlank()) {
            log.info("Configuring PostgreSQL DataSource from DATABASE_URL...");
            try {
                // Normalize URL scheme so java.net.URI can parse it cleanly
                String cleanUrl = envDbUrl.trim();
                if (cleanUrl.startsWith("postgres://")) {
                    cleanUrl = "postgresql://" + cleanUrl.substring("postgres://".length());
                }

                URI dbUri = new URI(cleanUrl);

                // Extract username and password from userInfo if present
                String userInfo = dbUri.getUserInfo();
                if (userInfo != null && !userInfo.isEmpty()) {
                    String[] userParts = userInfo.split(":", 2);
                    config.setUsername(userParts[0]);
                    if (userParts.length > 1) {
                        config.setPassword(userParts[1]);
                    }
                }

                String host = dbUri.getHost();
                int port = dbUri.getPort() != -1 ? dbUri.getPort() : 5432;
                String path = dbUri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "medicare_db";

                // Construct standard PostgreSQL JDBC URL
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);

                // SSL handling: Render requires sslmode=require for cloud PostgreSQL
                if (dbUri.getQuery() != null && !dbUri.getQuery().isBlank()) {
                    jdbcUrl += "?" + dbUri.getQuery();
                } else {
                    jdbcUrl += "?sslmode=require";
                }

                log.info("Constructed JDBC URL: jdbc:postgresql://{}:{}/{}", host, port, dbName);
                config.setJdbcUrl(jdbcUrl);
            } catch (Exception e) {
                log.error("Failed to parse DATABASE_URL ({}): {}. Falling back to standard datasource properties.",
                        e.getClass().getSimpleName(), e.getMessage());
                configureFallback(config);
            }
        } else {
            log.info("DATABASE_URL not found; using standard fallback datasource properties.");
            configureFallback(config);
        }

        // Hikari Connection Pool tuning for cloud container environments
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(20000);
        config.setMaxLifetime(1800000);
        config.setPoolName("MediCare-HikariPool-Postgres");

        return new HikariDataSource(config);
    }

    private void configureFallback(HikariConfig config) {
        String url = fallbackUrl != null && !fallbackUrl.isBlank()
                ? fallbackUrl
                : "jdbc:postgresql://localhost:5432/medicare_db";
        config.setJdbcUrl(url);
        if (fallbackUsername != null) config.setUsername(fallbackUsername);
        if (fallbackPassword != null) config.setPassword(fallbackPassword);
    }
}