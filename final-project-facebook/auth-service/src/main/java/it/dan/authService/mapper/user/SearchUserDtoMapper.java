package it.dan.authService.mapper.user;

import it.dan.authService.dto.SearchUserDto;
import it.dan.authService.entity.User;
import it.dan.authService.mapper.DtoMapperFacade;
import org.springframework.stereotype.Service;

@Service
public class SearchUserDtoMapper extends DtoMapperFacade<User, SearchUserDto> {

    public SearchUserDtoMapper() {
        super(User.class, SearchUserDto.class);
    }

    @Override
    protected void decorateDto(SearchUserDto dto, User user) {
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setPassword(String.valueOf(user.getPassword()));
        dto.setBirthDate(user.getBirthDate());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setGender(user.getGender());
    }
}
