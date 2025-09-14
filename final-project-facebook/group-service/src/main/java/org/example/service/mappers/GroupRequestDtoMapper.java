package org.example.service.mappers;

import org.example.domain.Group;
import org.example.domain.dto.GroupRequestDto;
import org.springframework.stereotype.Component;

@Component
public class GroupRequestDtoMapper extends DtoMapperFacade<Group, GroupRequestDto> {
    public GroupRequestDtoMapper() {
        super(Group.class, GroupRequestDto.class);
    }

    @Override
    protected void decorateEntity(Group entity, GroupRequestDto dto) {
    }

    @Override
    protected void decorateDto(GroupRequestDto dto, Group entity) {
    }
}
