package com.danit.notifications;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KafkaConsumerApplication implements ApplicationRunner {

    public static void main(String[] args) {
        SpringApplication.run(KafkaConsumerApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("http://localhost:8084/swagger-ui/index.html");
    }
}
