package it.dan.authService.entity;

import it.dan.authService.validation.ValidEmailDomain;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtRequest {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    @ValidEmailDomain(message = "Invalid email format")
    private String email;


    @NotBlank(message = "Password cannot be blank")
    private String password;

}
