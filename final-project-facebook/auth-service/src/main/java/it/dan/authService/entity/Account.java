package it.dan.authService.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "accounts")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Account extends AbstractEntity {

    @NotNull(message = "Created at date cannot be null")
    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "is_active")
    private boolean isActive;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;
}