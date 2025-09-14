package it.dan.userprofile.service.mapper;

import it.dan.userprofile.dto.image.UserImageDto;
import it.dan.userprofile.entity.UserImage;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserImageMapper extends  Mappable<UserImage, UserImageDto> {
}
