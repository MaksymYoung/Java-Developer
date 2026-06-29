package org.example.domain;

import lombok.*;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "friend_requests")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "receiver_id", nullable = false)
    private Long receiverId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private FriendRequestStatus status;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;
}


