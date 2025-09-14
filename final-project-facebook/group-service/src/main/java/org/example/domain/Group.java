package org.example.domain;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.TemporalType.TIMESTAMP;

@Data
@Entity
@Table(name = "groups_table")
public class Group extends AbstractEntity {
    @Id
    private Long id;

    private String name;
    private String description;

    private String coverImageUrl;

    @Enumerated(EnumType.STRING)
    private GroupType groupType;

    @Column(name = "owner_id")
    private Long ownerId;

    @CreatedDate
    @Temporal(TIMESTAMP)
    @Column(name = "created_date", updatable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Temporal(TIMESTAMP)
    @Column(name = "last_modified_date", updatable = false)
    private LocalDateTime lastModifiedDate;

    @ElementCollection
    @CollectionTable(name = "user_group", joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "user_id")
    private Set<Long> members = new HashSet<>();

    @OneToMany(mappedBy = "group")
    private Set<JoinRequest> joinRequests = new HashSet<>();
}
