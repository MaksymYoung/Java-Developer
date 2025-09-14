package org.example.service.mappers;

import org.example.domain.GroupImage;
import org.example.domain.dto.GroupImageDto;
import org.springframework.stereotype.Component;

@Component
public class GroupImageDtoMapper extends DtoMapperFacade<GroupImage, GroupImageDto> {
    public GroupImageDtoMapper() {
        super(GroupImage.class, GroupImageDto.class);
    }

    @Override
    protected void decorateEntity(GroupImage entity, GroupImageDto dto) {
    }

    @Override
    protected void decorateDto(GroupImageDto dto, GroupImage entity) {
    }
}
