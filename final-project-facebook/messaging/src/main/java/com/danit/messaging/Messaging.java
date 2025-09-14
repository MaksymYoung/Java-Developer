package com.danit.messaging;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "com.danit.messaging.repo")

public class Messaging  implements ApplicationRunner {


    public static void main(String[] args) {
        SpringApplication.run(Messaging.class, args);
    }
    @Override public void run(ApplicationArguments args) throws Exception {
        System.out.println("http://localhost:8082/h2-console");
        System.out.println("http://localhost:8082/swagger-ui/index.html \n");

    }
}
