package org.example.domain;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "friends")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Friend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user1_id", nullable = false)
    private Long user1Id;

    @Column(name = "user2_id", nullable = false)
    private Long user2Id;
}
