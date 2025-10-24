package com.example.euraka_example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
@EnableEurekaServer
@SpringBootApplication
public class EurakaExampleApplication {

	public static void main(String[] args) {
		SpringApplication.run(EurakaExampleApplication.class, args);
	}

}
