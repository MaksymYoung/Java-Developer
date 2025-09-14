package it.dan.authService.repository;

import it.dan.authService.entity.PasswordResetToken;
import it.dan.authService.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@DataJpaTest
@ActiveProfiles("local")
class PasswordResetTokenRepositoryTest {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByToken() {
        String tokenValue = "test-token-123";

        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Ivanov");
        testUser.setBirthDate(LocalDate.of(1990, 1, 1));
        testUser.setEmail("pavlo@gmail.com");
        testUser.setPassword("securepassword");

        testUser = userRepository.saveAndFlush(testUser);

        PasswordResetToken token = new PasswordResetToken();
        token.setToken(tokenValue);
        token.setUser(testUser);

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        calendar.add(Calendar.HOUR, 1);
        token.setExpiryDate(calendar.getTime());

        tokenRepository.save(token);

        Optional<PasswordResetToken> foundToken = tokenRepository.findByToken(tokenValue);

        assertTrue(foundToken.isPresent(), "Token should be found");
        PasswordResetToken retrievedToken = foundToken.get();
        assertEquals(tokenValue, retrievedToken.getToken(), "Token value should match");
        assertEquals(testUser, retrievedToken.getUser(), "User associated with token should match");
    }

}
