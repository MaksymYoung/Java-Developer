package it.dan.userprofile.dto.user;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDtoRequest {

    @NotNull(message = "{user.nickname.notpresent}")
    @Pattern(regexp = "^[a-zA-Z0-9 ]*$", message = "{user.nickname.invalid}")
    private String nickname;

    @Size(max = 128, message = "{user.company.size}")
    private String company;

    @Size(max = 400, message = "{user.interests.size}")
    private String interests;

    @Size(max = 50, message = "{user.country.size}")
    private String country;

    @Size(max = 50, message = "{user.state.size}")
    private String state;

    @Size(max = 50, message = "{user.city.size}")
    private String city;

    @Size(max = 100, message = "{user.address.size}")
    private String address;

    @Size(max = 50, message = "{user.apartment.size}")
    private String apartment;

    @Size(max = 50, message = "{user.postcode.size}")
    private String postcode;

    @Size(max = 100, message = "{user.linkedin.size}")
    private String linkedin;

    @Size(max = 100, message = "{user.telegram.size}")
    private String telegram;

    @Size(max = 100, message = "{user.viber.size}")
    private String viber;
}
