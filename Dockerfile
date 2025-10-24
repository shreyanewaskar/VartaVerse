# Use Maven + OpenJDK image to build and run Spring Boot apps
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

# Copy all backend services source
COPY Backend/euraka_example ./EurekaServer
COPY Backend/UserService/UserService ./UserService
COPY Backend/ContentService/ContentService ./ContentService


# Build all services
RUN mvn -f EurekaServer/pom.xml clean package -DskipTests
RUN mvn -f UserService/pom.xml clean package -DskipTests
RUN mvn -f ContentService/pom.xml clean package -DskipTests

# ---- Runtime image ----
FROM openjdk:17-jdk-alpine

WORKDIR /app

# Copy built jars from build stage
COPY --from=build /app/EurekaServer/target/*.jar ./eureka-server.jar
COPY --from=build /app/UserService/target/*.jar ./user-service.jar
COPY --from=build /app/ContentService/target/*.jar ./content-service.jar

# Copy run script
COPY run.sh ./run.sh
RUN chmod +x ./run.sh

# Expose ports
EXPOSE 8761 8086 8087 3306

# Start everything
CMD ["./run.sh"]
