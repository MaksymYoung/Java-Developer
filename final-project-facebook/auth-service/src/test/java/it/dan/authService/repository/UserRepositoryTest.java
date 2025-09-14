package it.dan.authService.repository;

import it.dan.authService.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@ActiveProfiles("local")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Barabah");
        testUser.setEmail("pavlo@gmail.com");
        testUser.setPassword("password123");
        testUser.setBirthDate(LocalDate.of(2000, 3, 23));

        userRepository.save(testUser);

        Optional<User> byEmail = userRepository.findByEmail("pavlo@gmail.com");

        assertTrue(byEmail.isPresent());
        assertEquals("pavlo@gmail.com", byEmail.get().getEmail());

    }

    @Test
    void findByEmailAndPassword() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Barabah");
        testUser.setEmail("pavlo@gmail.com");
        testUser.setPassword("password123");
        testUser.setBirthDate(LocalDate.of(2000, 3, 23));

        userRepository.save(testUser);

        Optional<User> byEmailAndPassword = userRepository.findByEmailAndPassword("pavlo@gmail.com", "password123");

        assertTrue(byEmailAndPassword.isPresent());
        assertEquals("pavlo@gmail.com", byEmailAndPassword.get().getEmail());
        assertEquals("password123", byEmailAndPassword.get().getPassword());
    }

    @Test
    void findById() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Barabah");
        testUser.setEmail("pavlo@gmail.com");
        testUser.setPassword("password123");
        testUser.setBirthDate(LocalDate.of(2000, 3, 23));

        userRepository.save(testUser);

        Long savedUserId = testUser.getId(); // Get the generated ID
        Optional<User> byId = userRepository.findById(savedUserId);

        assertTrue(byId.isPresent(), "User should be found by ID");
        assertEquals(savedUserId, byId.get().getId(), "ID should match the saved user's ID");
    }


    @Test
    void findByFirstNameOrLastNameContaining() {
        User user1 = new User();
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setEmail("john.doe@example.com");
        user1.setPassword("password123");
        user1.setBirthDate(LocalDate.of(1990, 1, 1));
        userRepository.save(user1);

        User user2 = new User();
        user2.setFirstName("Jane");
        user2.setLastName("Smith");
        user2.setEmail("jane.smith@example.com");
        user2.setPassword("password456");
        user2.setBirthDate(LocalDate.of(1985, 5, 15));
        userRepository.save(user2);

        User user3 = new User();
        user3.setFirstName("Jack");
        user3.setLastName("Doe");
        user3.setEmail("jack.doe@example.com");
        user3.setPassword("password789");
        user3.setBirthDate(LocalDate.of(1992, 7, 20));
        userRepository.save(user3);

        List<User> result = userRepository.findByFirstNameOrLastNameContaining("Doe");
        System.out.println("Result for 'Doe': " + result);
        assertThat(result).hasSize(2);
        assertThat(result).extracting(User::getFirstName).containsExactlyInAnyOrder("John", "Jack");

        result = userRepository.findByFirstNameOrLastNameContaining("Smith");
        System.out.println("Result for 'Smith': " + result);
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("Jane");

        result = userRepository.findByFirstNameOrLastNameContaining("J");
        System.out.println("Result for 'J': " + result);
        assertThat(result).hasSize(3);
        assertThat(result).extracting(User::getFirstName).containsExactlyInAnyOrder("John", "Jane", "Jack");
    }





}