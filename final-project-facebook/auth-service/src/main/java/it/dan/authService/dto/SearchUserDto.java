package it.dan.authService.dto;

import it.dan.authService.validation.ValidEmailDomain;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SearchUserDto {

    @NotNull(message = "ID cannot be null")
    private Long id;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    @ValidEmailDomain(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @NotNull(message = "Birth date is mandatory")
    private LocalDate birthDate;

    @Nullable
    private String firstName;

    @Nullable
    private String lastName;

    @Nullable
    private String phoneNumber;

    @Nullable
    private String gender;
}
