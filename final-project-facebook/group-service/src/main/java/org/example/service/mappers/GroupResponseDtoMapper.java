package org.example.service.mappers;

import org.example.domain.Group;
import org.example.domain.dto.GroupResponseDto;
import org.springframework.stereotype.Component;

import java.math.BigInteger;

@Component
public class GroupResponseDtoMapper extends DtoMapperFacade<Group, GroupResponseDto> {
    public GroupResponseDtoMapper() {
        super(Group.class, GroupResponseDto.class);
    }

    @Override
    protected void decorateEntity(Group entity, GroupResponseDto dto) {
        // Additional entity customization can be done here
    }

    @Override
    protected void decorateDto(GroupResponseDto dto, Group entity) {
        // Additional DTO customization can be done here
    }
}
