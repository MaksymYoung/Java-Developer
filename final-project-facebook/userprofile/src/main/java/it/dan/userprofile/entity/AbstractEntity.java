package it.dan.userprofile.entity;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Temporal;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

import static jakarta.persistence.TemporalType.TIMESTAMP;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class AbstractEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    private Long id;

    @CreatedDate
    @Temporal(TIMESTAMP)
    @Column(name = "creation_date")
    protected LocalDateTime creationDate;

    @LastModifiedDate
    @Temporal(TIMESTAMP)
    @Column(name = "last_modified_date")
    protected LocalDateTime lastModifiedDate;
}
