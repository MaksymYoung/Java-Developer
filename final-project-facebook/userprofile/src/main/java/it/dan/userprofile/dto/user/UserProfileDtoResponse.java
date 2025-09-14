package it.dan.userprofile.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileDtoResponse {
	private Long id;
	private Long userId;
	private String nickname;
	private String company;
	private String interests;
	private String country;
	private String state;
	private String city;
	private String address;
	private String apartment;
	private String postcode;
	private String linkedin;
	private String telegram;
	private String viber;
	protected LocalDateTime creationDate;
	protected LocalDateTime lastModifiedDate;
}
