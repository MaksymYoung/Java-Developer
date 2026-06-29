package it.dan.authService.repository;

import it.dan.authService.entity.Account;
import it.dan.authService.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("local")
class AccountRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Test
    void findById() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Ivanov");
        testUser.setBirthDate(LocalDate.of(1990, 1, 1));
        testUser.setEmail("pavlo@gmail.com");
        testUser.setPassword("securepassword");

        testUser = userRepository.save(testUser);

        Account testAccount = new Account();
        testAccount.setCreatedAt(LocalDate.now());
        testAccount.setActive(true);
        testAccount.setUser(testUser);

        testAccount = accountRepository.save(testAccount);
        Optional<Account> byId = accountRepository.findById(testAccount.getId());

        assertTrue(byId.isPresent());
        assertEquals(testAccount.getId(), byId.get().getId());
    }
}

