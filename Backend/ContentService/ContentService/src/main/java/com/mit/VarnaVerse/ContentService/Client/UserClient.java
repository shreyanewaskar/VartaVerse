package com.mit.VarnaVerse.ContentService.Client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import com.mit.VarnaVerse.ContentService.Payloads.UserDTO;
import com.mit.VarnaVerse.ContentService.Config.FeignClientConfig;

@FeignClient(
        name = "user-service",
        url = "http://localhost:8083",
        configuration = FeignClientConfig.class
)
public interface UserClient {

    @GetMapping("/users/me")
    UserDTO getCurrentUser(@RequestHeader("Authorization") String token);
}
