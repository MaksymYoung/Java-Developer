package org.example.domain.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.example.domain.GroupType;
import java.util.Set;

@Data
public class GroupRequestDto {
    @NotBlank
    @Size(max = 255)
    @Size(min = 2, message = "Name must be at least 3 characters long")
    private String name;

    @Size(max = 1000)
    private String description;

    @Size(max = 2048)
    private String coverImageUrl;

    @NotNull
    private GroupType groupType;

    private Set<Long> members;
}
