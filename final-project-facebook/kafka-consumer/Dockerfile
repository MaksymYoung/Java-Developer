# Use an official OpenJDK runtime as a parent image
FROM openjdk:21-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the application's JAR file into the container
COPY target/kafka-consumer-0.0.1-SNAPSHOT.jar app.jar

# Make port 8084 available to the world outside this container
EXPOSE 8084

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
