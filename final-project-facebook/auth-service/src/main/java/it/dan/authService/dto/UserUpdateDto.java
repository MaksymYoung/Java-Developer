package it.dan.authService.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateDto {

    @Nullable
    private String firstName;

    @Nullable
    private String lastName;

    @Nullable
    private String phoneNumber;

    @NotNull(message = "Birth date is mandatory")
    private LocalDate birthDate;

    @Nullable
    private String gender;
}

