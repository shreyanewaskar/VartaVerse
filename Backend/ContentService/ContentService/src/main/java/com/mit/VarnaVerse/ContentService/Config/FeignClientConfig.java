package com.mit.VarnaVerse.ContentService.Config;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Configuration
public class FeignClientConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            var attributes = RequestContextHolder.getRequestAttributes();
            if (attributes == null) return;

            var request = ((ServletRequestAttributes) attributes).getRequest();
            if (request == null) return;

            String token = request.getHeader("Authorization");
            if (token != null && !token.isEmpty()) {
                template.header("Authorization", token);
            }
        };
    }
}

