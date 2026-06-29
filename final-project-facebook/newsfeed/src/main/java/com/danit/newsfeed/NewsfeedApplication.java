package com.danit.newsfeed;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class NewsfeedApplication {

    public static void main(final String[] args) {
        SpringApplication.run(NewsfeedApplication.class);
    }
}
