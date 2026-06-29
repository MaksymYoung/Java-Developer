package com.danit.newsfeed.repository;

import com.danit.newsfeed.domain.feed.Feed;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;


public interface FeedRepository extends JpaRepository<Feed, Long> {
    @Query(value = """
             SELECT exists(
                           SELECT 1
                           FROM feeds
                           WHERE user_id = :userId
                             AND id = :feedId)
            """, nativeQuery = true)
    boolean isFeedOwner(
            @Param("userId") Long userId,
            @Param("feedId") Long feedId
    );

    @Query("SELECT f FROM Feed f WHERE f.userId IN :friendsIds")
    Page<Feed> findAllFeedsByListOfFriendsIds(
            @Param("friendsIds") List<Long> friendsIds, Pageable pageable);
    @Query("SELECT f FROM Feed f WHERE f.userId = :userId")
    Page<Feed> findAllByUserId(Long userId, Pageable pageable);

//    void assignToUserById(Long feedId , Long UserId);
@Modifying
@Transactional
@Query(value = """
            INSERT INTO newsfeed_images (feed_id, image)
            VALUES (:id, :fileName)
            """, nativeQuery = true)
void addImage(
        @Param("id") Long id,
        @Param("fileName") String fileName
);


    @Query("SELECT f FROM Feed f WHERE f.userId "
            + "= :ownerId AND f.groupId IS NULL")
    Page<Feed> findFeedsByOwnerIdWithoutGroup(
            @Param("ownerId") Long ownerId,
            Pageable pageable);

    @Query("SELECT f FROM Feed f WHERE f.userId "
            + "IN :ownerIds AND f.groupId IS NULL")
    Page<Feed> findFeedsByOwnerIdsWithoutGroup(
            @Param("ownerIds") List<Long> ownerIds,
            Pageable pageable);
    @Query("SELECT f FROM Feed f WHERE f.groupId = :groupId")
    Page<Feed> findFeedsByGroupId(
            @Param("groupId") Long groupId,
                                  Pageable pageable);
    @Query("SELECT p FROM Feed p "
            + "LEFT JOIN Like l ON p = l.feed "
            + "WHERE p.groupId IS NULL "
            + "GROUP BY p.id "
            + "ORDER BY COUNT(l.id) DESC")
    Page<Feed> findTopPostsByLikesAndGroupIdIsNull(Pageable pageable);
}
