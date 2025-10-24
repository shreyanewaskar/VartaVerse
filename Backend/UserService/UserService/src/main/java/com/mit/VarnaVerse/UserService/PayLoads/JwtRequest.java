package com.mit.VarnaVerse.UserService.PayLoads;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "password")
public class JwtRequest {
    private String email;
    private Long userId;
    private String password;
}
