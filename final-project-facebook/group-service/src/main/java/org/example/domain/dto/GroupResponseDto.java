package org.example.domain.dto;

import lombok.Data;
import org.example.domain.GroupType;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class GroupResponseDto {
    private Long id;
    private String name;
    private String description;
    private String coverImageUrl;
    private GroupType groupType;
    private Long ownerId;
    private LocalDateTime createdDate;
    private LocalDateTime lastModifiedDate;
    private Set<Long> members;
}