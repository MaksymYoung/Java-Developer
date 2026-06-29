package it.dan.authService.mapper.user;


import it.dan.authService.dto.UserDto;
import it.dan.authService.entity.User;
import it.dan.authService.mapper.DtoMapperFacade;
import org.springframework.stereotype.Service;

@Service
public class UserDtoMapper extends DtoMapperFacade<User, UserDto> {

    public UserDtoMapper() {
        super(User.class, UserDto.class);
    }

    @Override
    protected void decorateDto(UserDto dto, User user) {
        dto.setEmail(user.getEmail());
        dto.setPassword(String.valueOf(user.getPassword()));
        dto.setBirthDate(user.getBirthDate());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setGender(user.getGender());
        dto.setPhoneNumber(user.getPhoneNumber());
    }
}
