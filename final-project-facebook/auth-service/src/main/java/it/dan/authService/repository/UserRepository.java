package it.dan.authService.repository;

import it.dan.authService.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
    Optional<User> findById(Long id);
    @Query("SELECT u FROM User u WHERE LOWER(u.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(u.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<User> findByFirstNameOrLastNameContaining(@Param("name") String name);



    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.firstName = :firstName, u.lastName = :lastName, u.phoneNumber = :phoneNumber, u.birthDate = :birthDate, u.gender = :gender WHERE u.id = :id")
    void updateUserById(@Param("id") Long id,
                        @Param("firstName") String firstName,
                        @Param("lastName") String lastName,
                        @Param("phoneNumber") String phoneNumber,
                        @Param("birthDate") LocalDate birthDate,
                        @Param("gender") String gender);


}
