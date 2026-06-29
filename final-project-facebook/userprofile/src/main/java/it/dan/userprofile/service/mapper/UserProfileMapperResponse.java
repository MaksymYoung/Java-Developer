package it.dan.userprofile.service.mapper;

import it.dan.userprofile.dto.user.UserProfileDtoResponse;
import it.dan.userprofile.entity.UserProfile;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserProfileMapperResponse extends Mappable<UserProfile, UserProfileDtoResponse> {
    @Override
    UserProfile toEntity(UserProfileDtoResponse dto);

    @Override
    UserProfileDtoResponse toDto(UserProfile entity);

    @Override
    List<UserProfileDtoResponse> toDto(List<UserProfile> entity);
}
