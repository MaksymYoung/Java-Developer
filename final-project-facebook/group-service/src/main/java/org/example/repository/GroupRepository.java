package org.example.repository;

import org.example.domain.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    Optional<Group> findByName(String name);
    List<Group> findByNameContainingIgnoreCase(String name);

    @Query("SELECT g FROM Group g JOIN g.members m WHERE m = :memberId")
    List<Group> findByMemberId(@Param("memberId") Long memberId);

    List<Group> findByOwnerId(Long ownerId);
    Page<Group> findByOwnerId(Long ownerId, Pageable pageable);

    @Query("SELECT g FROM Group g JOIN g.members m WHERE m = :userId")
    Page<Group> findByMemberId(@Param("userId") Long userId, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = """
        UPDATE groups_table 
        SET cover_image_url = :fileName
        WHERE id = :id
        """, nativeQuery = true)
    void addImage(
            @Param("id") Long id,
            @Param("fileName") String fileName
    );
}