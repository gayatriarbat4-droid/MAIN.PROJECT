package com.yourorg.appname.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

/**
 * Cloud Database Configuration for Render.
 * Activates whenever:
 * 1. Running on Render (RENDER environment variable is present)
 * 2. DATABASE_URL environment variable is present
 * 3. Active profile is 'postgres'
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Bean
    @Primary
    public DataSource dataSource() {
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = databaseUrl;
        }

        HikariConfig config = new HikariConfig();

        if (envDbUrl != null && !envDbUrl.isBlank()) {
            log.info("Configuring PostgreSQL DataSource from DATABASE_URL...");
            try {
                String cleanUrl = envDbUrl.trim();
                if (cleanUrl.startsWith("postgres://")) {
                    cleanUrl = "postgresql://" + cleanUrl.substring("postgres://".length());
                }

                URI dbUri = new URI(cleanUrl);

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

                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName);

                if (dbUri.getQuery() != null && !dbUri.getQuery().isBlank()) {
                    jdbcUrl += "?" + dbUri.getQuery();
                } else {
                    jdbcUrl += "?sslmode=require";
                }

                log.info("Configured PostgreSQL connection to {}:{}/{}", host, port, dbName);
                config.setJdbcUrl(jdbcUrl);
                config.setDriverClassName("org.postgresql.Driver");
            } catch (Exception e) {
                log.error("Failed to parse DATABASE_URL: {}. Falling back to in-memory database.", e.getMessage());
                configureH2Fallback(config);
            }
        } else {
            log.warn("Cloud container running without DATABASE_URL! Activating in-memory H2 database fallback.");
            configureH2Fallback(config);
        }

        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setConnectionTimeout(20000);
        config.setMaxLifetime(1800000);
        config.setPoolName("MediCare-HikariPool");

        return new HikariDataSource(config);
    }

    private void configureH2Fallback(HikariConfig config) {
        config.setJdbcUrl("jdbc:h2:mem:medicare_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
    }
}