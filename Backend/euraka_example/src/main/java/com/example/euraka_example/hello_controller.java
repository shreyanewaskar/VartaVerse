package com.example.euraka_example;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class hello_controller {
	@GetMapping("/hello")
	public String sayhello() {
	 return "Hello From Spring";
	}

}

