# ==========================================================
# Stage 1: Build JAR with Maven & Eclipse Temurin JDK 17
# ==========================================================
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy Maven POM and pre-fetch dependencies for Docker layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and build executable JAR
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================================
# Stage 2: Minimal & Secure Production Runtime JRE 17
# ==========================================================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Create unprivileged system group and user for container security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy compiled JAR from builder stage
COPY --from=builder /app/target/medicare-backend-*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

# Render assigns port dynamically via $PORT environment variable (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Run Spring Boot with cloud-optimized JVM flags and dynamic port binding
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom -jar app.jar --server.port=${PORT:-8080}"]

