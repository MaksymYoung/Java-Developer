package com.danit.messaging.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name = "group_chat")
public class GroupChat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(name = "admin_id")
    private Integer admin;

    @ElementCollection
    @CollectionTable(name = "group_participants",
            joinColumns = @JoinColumn(name = "group_id"))
    @Column(name = "user_id")
    private List<Integer> participants = new ArrayList<>();
}
