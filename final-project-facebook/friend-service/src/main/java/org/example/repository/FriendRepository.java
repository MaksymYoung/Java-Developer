package org.example.repository;

import org.example.domain.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {

    @Query("SELECT f FROM Friend f " +
            "WHERE f.user1Id = :userId OR f.user2Id = :userId")
    List<Friend> findAllFriendsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(f) > 0 " +
            "FROM Friend f " +
            "WHERE (f.user1Id  = :user1Id AND f.user2Id = :user2Id) " +
            "OR (f.user2Id = :user1Id AND f.user1Id = :user2Id)")
    boolean existsByUser1IdAndUser2IdOrUser2IdAndUser1Id(@Param("user1Id") Long user1Id,
                                                         @Param("user2Id") Long user2Id);


    @Modifying
    @Transactional
    void deleteByUser1IdAndUser2Id(Long user1Id, Long user2Id);

    @Modifying
    @Transactional
    void deleteByUser2IdAndUser1Id(Long user2Id, Long user1Id);
}