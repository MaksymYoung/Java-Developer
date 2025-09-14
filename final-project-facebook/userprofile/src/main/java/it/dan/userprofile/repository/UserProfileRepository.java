package it.dan.userprofile.repository;

import it.dan.userprofile.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {

    @Query("SELECT u FROM UserProfile u WHERE LOWER(u.nickname) LIKE LOWER(CONCAT('%', :searchString, '%'))")
    Page<UserProfile> findByNickname(String searchString, Pageable pageable);

    @Transactional
    @Modifying
    @Query(value = """
            INSERT INTO userprofile_images (user_id, image)
            VALUES (:userId, :fileName)
            """, nativeQuery = true)
    void addImage(
            Long userId,
            String fileName
    );

    @Transactional
    @Modifying
    @Query(value = """
                DELETE FROM userprofile_images
                WHERE user_id = :userId AND image LIKE CONCAT('%/userprofile/', :fileName)
            """, nativeQuery = true)
    void deleteImage(Long userId, String fileName);

    @Transactional
    @Modifying
    @Query(value = """
                DELETE FROM userprofile_images
                WHERE user_id = :userId AND image LIKE CONCAT('%/userprofile/avatar%', :userId, '%')
            """, nativeQuery = true)
    void deleteAvatar(Long userId);

    @Transactional
    @Modifying
    @Query(value = """
                DELETE FROM userprofile_images
                WHERE user_id = :userId AND image LIKE CONCAT('%/userprofile/cover%', :userId, '%')
            """, nativeQuery = true)
    void deleteCover(Long userId);

    @Query(value = """
                SELECT image FROM userprofile_images
                WHERE user_id = :userId AND image LIKE CONCAT('%/userprofile/', :fileName)
            """, nativeQuery = true)
    Optional<String> getImageByUserId(Long userId, String fileName);

    @Query(value = """
                SELECT image FROM userprofile_images
                WHERE user_id = :userId AND image LIKE CONCAT('%/userprofile/avatar%', :userId, '%')
            """, nativeQuery = true)
    Optional<String> getAvatarByUserId(Long userId);

    @Query(value = """
                SELECT image FROM userprofile_images
                WHERE user_id = :userId AND image LIKE CONCAT('%/userprofile/cover%', :userId, '%')
            """, nativeQuery = true)
    Optional<String> getCoverByUserId(Long userId);

    @Query(value = """
            SELECT image FROM userprofile_images
            WHERE user_id = :userId
            ORDER BY image
            """, nativeQuery = true)
    Page<String> getAllImagesByUserId(
            Long userId,
            Pageable pageable
    );

    Optional<UserProfile> findByUserId(Long userId);

    void deleteByUserId(Long userId);
}
