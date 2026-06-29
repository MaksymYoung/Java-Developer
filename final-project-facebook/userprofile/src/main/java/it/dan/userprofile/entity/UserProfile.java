package it.dan.userprofile.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "userId")
@Entity
@Table(name = "userprofiles", schema = "userprofile")
public class UserProfile extends AbstractEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(length = 100)
    private String nickname;

    @Column(length = 128)
    private String company;

    @Column(length = 400)
    private String interests;

    @Column(length = 50)
    private String country;

    @Column(length = 50)
    private String state;

    @Column(length = 50)
    private String city;

    @Column(length = 100)
    private String address;

    @Column(length = 50)
    private String apartment;

    @Column(length = 50)
    private String postcode;

    @Column(length = 100)
    private String linkedin;

    @Column(length = 100)
    private String telegram;

    @Column(length = 100)
    private String viber;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "userprofile_images", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "image")
    private List<String> images;
}
