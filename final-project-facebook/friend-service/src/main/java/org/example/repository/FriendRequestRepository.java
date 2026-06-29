package org.example.repository;

import org.example.domain.FriendRequest;
import org.example.domain.FriendRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    @Query("SELECT COUNT(fr) > 0 " +
            "FROM FriendRequest fr " +
            "WHERE fr.senderId = :senderId " +
            "AND fr.receiverId = :receiverId " +
            "AND fr.status = :status")
    boolean existsBySenderIdAndReceiverIdAndStatus(@Param("senderId") Long senderId,
                                                   @Param("receiverId") Long receiverId,
                                                   @Param("status") FriendRequestStatus status);

    @Query("SELECT fr FROM FriendRequest fr WHERE fr.receiverId = :receiverId AND fr.status = :status")
    List<FriendRequest> findByReceiverIdAndStatus(@Param("receiverId") Long receiverId, @Param("status") FriendRequestStatus status);
//    List<FriendRequest> findByReceiverIdAndStatus(Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findBySenderId(Long senderId);

    @Query("SELECT fr FROM FriendRequest fr WHERE fr.senderId = :senderId AND fr.receiverId = :receiverId AND fr.status = :status")
    Optional<FriendRequest> findBySenderIdAndReceiverIdAndStatus(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId, @Param("status") FriendRequestStatus status);

    @Modifying
    @Query("DELETE FROM FriendRequest fr WHERE " +
            "(fr.senderId = :senderId AND fr.receiverId = :receiverId OR " +
            "fr.senderId = :receiverId AND fr.receiverId = :senderId) AND fr.status = :status")
    void deleteBySenderIdAndReceiverIdOrReceiverIdAndSenderIdAndStatus(
            @Param("senderId") Long senderId,
            @Param("receiverId") Long receiverId,
            @Param("status") FriendRequestStatus status);
}
