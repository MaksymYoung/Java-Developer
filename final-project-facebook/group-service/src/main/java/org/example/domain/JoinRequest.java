package org.example.domain;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "join_request")
public class JoinRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    private Long userId;

    @Enumerated(EnumType.STRING)
    private JoinRequestStatus status;
}

