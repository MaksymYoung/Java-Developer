package it.dan.userprofile.service.mapper;

import it.dan.userprofile.dto.user.UserProfileDtoRequest;
import it.dan.userprofile.entity.UserProfile;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserProfileMapperRequest extends Mappable<UserProfile, UserProfileDtoRequest> {
    @Override
    UserProfile toEntity(UserProfileDtoRequest dto);

    @Override
    UserProfileDtoRequest toDto(UserProfile entity);

    @Override
    List<UserProfileDtoRequest> toDto(List<UserProfile> entity);
}
