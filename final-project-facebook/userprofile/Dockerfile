# Use an OpenJDK 21 image as the base for the build stage
FROM openjdk:21-jdk-slim AS build
# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy the Maven project file
COPY pom.xml .

# Fetch the project dependencies
RUN mvn dependency:go-offline

# Copy the project source
COPY src /app/src

# Package the application
RUN mvn clean package -DskipTests

# Use OpenJDK 21 for the runtime stage
FROM openjdk:21-jdk-slim
# Copy the packaged application from the build stage
COPY --from=build /app/target/*.jar application.jar

# Expose the application port
EXPOSE 8091

# Define the entry point for the application
ENTRYPOINT ["java", "-jar", "application.jar"]
