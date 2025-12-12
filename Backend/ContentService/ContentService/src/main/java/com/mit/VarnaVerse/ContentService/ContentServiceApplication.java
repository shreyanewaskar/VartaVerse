package com.mit.VarnaVerse.ContentService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;


@SpringBootApplication
@EnableFeignClients(basePackages = "com.mit.VarnaVerse.ContentService.Client")
public class ContentServiceApplication {
    public static void main(String[] args) {
    	
        SpringApplication.run(ContentServiceApplication.class, args);
    }
}
