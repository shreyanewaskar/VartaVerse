package com.mit.VarnaVerse.UserService.PayLoads;


import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Component
public class JwtResponse {
    private String jwtToken;
    private String userName;
    private Long userId;

    public JwtResponse() {}

    public JwtResponse(String jwtToken, String userName, Long userId) {
        this.jwtToken = jwtToken;
        this.userName = userName;
        this.userId = userId;
    }

    // Getters and Setters
    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public String toString() {
        return "JWTResponse [jwtToken=" + jwtToken + ", userName=" + userName + ", userId=" + userId + "]";
    }
}
