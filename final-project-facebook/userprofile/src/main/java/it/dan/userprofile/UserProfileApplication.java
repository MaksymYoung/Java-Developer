package it.dan.userprofile;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UserProfileApplication implements ApplicationRunner {

    public static void main(String[] args) {
        SpringApplication.run(UserProfileApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("http://localhost:8091/swagger-ui/index.html");
    }
}
