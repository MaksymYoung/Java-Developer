package org.example.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "group_roles")
public class GroupRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RoleType roleType;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @Column(name = "user_id")
    private Long userId;
}
