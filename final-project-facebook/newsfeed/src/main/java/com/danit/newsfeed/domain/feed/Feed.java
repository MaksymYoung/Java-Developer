package com.danit.newsfeed.domain.feed;




import java.io.Serializable;
import java.time.LocalDateTime;

import com.danit.newsfeed.domain.comment.Comment;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Formula;

import java.util.List;

@Entity
@Table(name = "feeds")
@Getter
@Setter
public class Feed implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private LocalDateTime postDate;
    @Column(name = "image")
    @CollectionTable(name = "newsfeed_images")
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> images;
    private Long userId;
    private Long groupId;
    @Formula("(SELECT COUNT(*) FROM likes l WHERE l.feed_id = id)")
    private Long likesCount;
    @OneToMany(
            mappedBy = "feed",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<Comment> comments;
}
