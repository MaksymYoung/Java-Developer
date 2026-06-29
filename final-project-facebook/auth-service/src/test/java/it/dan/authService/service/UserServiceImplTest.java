package it.dan.authService.service;

import it.dan.authService.dto.SearchUserDto;
import it.dan.authService.dto.UserDto;
import it.dan.authService.dto.UserUpdateDto;
import it.dan.authService.entity.PasswordResetToken;
import it.dan.authService.entity.User;
import it.dan.authService.mapper.user.SearchUserDtoMapper;
import it.dan.authService.mapper.user.UserDtoMapper;
import it.dan.authService.repository.PasswordResetTokenRepository;
import it.dan.authService.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository tokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private UserDtoMapper userDtoMapper;
    @Mock
    private SearchUserDtoMapper searchUserDtoMapper;

    @InjectMocks
    private UserServiceImpl userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void initiatePasswordReset() {
        String email = "pavlo@gmail.com";
        String token = "reset-token-123";

        User testUser = new User();
        testUser.setEmail(email);

        when(userRepository.findByEmail(eq(email))).thenReturn(Optional.of(testUser));

        PasswordResetToken resetToken = new PasswordResetToken(token, testUser);

        when(tokenRepository.save(any(PasswordResetToken.class))).thenAnswer(invocation -> {
            PasswordResetToken savedToken = invocation.getArgument(0);
            assertEquals(testUser, savedToken.getUser(), "User should be correctly associated with the token");
            return savedToken;
        });

        doNothing().when(emailService).sendPasswordResetEmail(eq(email), any(String.class));

        String resultToken = userService.initiatePasswordReset(email);

        assertNotNull(resultToken, "Resulting token should not be null");

        verify(emailService).sendPasswordResetEmail(eq(email), any(String.class));
    }

    @Test
    void resetPassword() {
        String token = "reset-token-123";
        String newPassword = "newPassword123";

        PasswordEncoder encoder = new BCryptPasswordEncoder();

        User testUser = new User();
        testUser.setPassword(encoder.encode("oldPassword123"));

        PasswordResetToken resetToken = new PasswordResetToken(token, testUser);

        when(tokenRepository.findByToken(token)).thenReturn(Optional.of(resetToken));
        when(userRepository.save(testUser)).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            testUser.setPassword(user.getPassword());
            return testUser;
        });

        boolean isPasswordReset = userService.resetPassword(token, newPassword);

        assertTrue(isPasswordReset, "Password should be reset successfully");

        // Використовуємо мок для PasswordEncoder для тестування, що новий пароль правильно зашифрований
        when(passwordEncoder.matches(newPassword, testUser.getPassword())).thenReturn(true);

        assertTrue(passwordEncoder.matches(newPassword, testUser.getPassword()), "New password should match");
    }

    @Test
    void registerUser() {
        UserDto userDto = new UserDto();
        userDto.setEmail("pavlo@gmail.com");
        userDto.setPassword("password123");
        userDto.setFirstName("Pavlo");
        userDto.setLastName("Barabah");

        User testUser = new User();
        testUser.setEmail(userDto.getEmail());
        testUser.setPassword(userDto.getPassword());
        testUser.setFirstName(userDto.getFirstName());
        testUser.setLastName(userDto.getLastName());

        when(userDtoMapper.convertToEntity(userDto)).thenReturn(testUser);
        when(userRepository.save(testUser)).thenReturn(testUser);
        when(userDtoMapper.convertToDto(testUser)).thenReturn(userDto);

        UserDto registeredUser = userService.registerUser(userDto);

        assertNotNull(registeredUser, "Registered user should not be null");
        assertEquals(userDto.getEmail(), registeredUser.getEmail(), "Email should match");
        assertEquals(userDto.getFirstName(), registeredUser.getFirstName(), "First name should match");
        assertEquals(userDto.getLastName(), registeredUser.getLastName(), "Last name should match");

        verify(userRepository).save(testUser);
    }

    @Test
    void getUserByEmailAndPassword() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Barabah");
        testUser.setEmail("pavlo@gmail.com");
        testUser.setPassword("$2a$10$encryptedPassword");

        UserDto expectedUserDto = new UserDto();
        expectedUserDto.setFirstName("Pavlo");
        expectedUserDto.setLastName("Barabah");
        expectedUserDto.setEmail("pavlo@gmail.com");
        expectedUserDto.setPassword("password123");

        when(userRepository.findByEmail("pavlo@gmail.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", testUser.getPassword())).thenReturn(true);
        when(userDtoMapper.convertToDto(testUser)).thenReturn(expectedUserDto);

        UserDto userDto = userService.getUserByEmailAndPassword("pavlo@gmail.com", "password123");

        assertNotNull(userDto, "UserDto should not be null");
        assertEquals(expectedUserDto.getEmail(), userDto.getEmail(), "User's email should match!");
        assertEquals(expectedUserDto.getPassword(), userDto.getPassword(), "User's password should match!");
    }

    @Test
    void getUserById() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");

        UserDto expectedUserDto = new UserDto();
        expectedUserDto.setFirstName("Pavlo");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userDtoMapper.convertToDto(testUser)).thenReturn(expectedUserDto);

        UserDto userDto = userService.getUserById(1L);
        assertNotNull(userDto, "UserDto should not be null");
        assertEquals(expectedUserDto.getFirstName(), userDto.getFirstName(), "User's name should match!");
    }

    @Test
    void getByEmail() {
        User testUser = new User();
        testUser.setFirstName("Pavlo");
        testUser.setEmail("pavlo@gmail.com");

        UserDto expectedUserDto = new UserDto();
        expectedUserDto.setFirstName("Pavlo");
        expectedUserDto.setEmail("pavlo@gmail.com");

        when(userRepository.findByEmail("pavlo@gmail.com")).thenReturn(Optional.of(testUser));
        when(userDtoMapper.convertToDto(testUser)).thenReturn(expectedUserDto);

        Optional<User> optionalUser = userService.getByEmail("pavlo@gmail.com");
        assertTrue(optionalUser.isPresent(), "UserDto should not be null");
        assertEquals(expectedUserDto.getEmail(), optionalUser.get().getEmail(), "User's email should match!");
    }

    @Test
    void update() {
        User testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("Pavlo");
        testUser.setLastName("Barabah");

        UserUpdateDto updatedUser = new UserUpdateDto();
        updatedUser.setFirstName("Stepan");
        updatedUser.setLastName("Ivanov");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        userService.update(1L, updatedUser);

        verify(userRepository).updateUserById(
                1L,
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getPhoneNumber(),
                updatedUser.getBirthDate(),
                updatedUser.getGender()
        );
    }

    @Test
    void findByFirstNameOrLastNameContaining() {
        // Arrange
        User user1 = new User();
        user1.setFirstName("John");
        user1.setLastName("Doe");
        user1.setEmail("john.doe@example.com");
        user1.setPassword("password123");
        user1.setBirthDate(LocalDate.of(1990, 1, 1));

        User user2 = new User();
        user2.setFirstName("Jack");
        user2.setLastName("Doe");
        user2.setEmail("jack.doe@example.com");
        user2.setPassword("password789");
        user2.setBirthDate(LocalDate.of(1992, 7, 20));

        SearchUserDto userDto1 = new SearchUserDto();
        userDto1.setFirstName("John");
        userDto1.setLastName("Doe");

        SearchUserDto userDto2 = new SearchUserDto();
        userDto2.setFirstName("Jack");
        userDto2.setLastName("Doe");

        when(userRepository.findByFirstNameOrLastNameContaining("Doe"))
                .thenReturn(Arrays.asList(user1, user2));

        when(searchUserDtoMapper.convertToDto(user1)).thenReturn(userDto1);
        when(searchUserDtoMapper.convertToDto(user2)).thenReturn(userDto2);

        // Act
        List<SearchUserDto> result = userService.searchUsersByName("Doe");

        // Assert
        assertThat(result).hasSize(2);
        assertThat(result).extracting(SearchUserDto::getFirstName)
                .containsExactlyInAnyOrder("John", "Jack");
        assertThat(result).extracting(SearchUserDto::getLastName)
                .containsExactlyInAnyOrder("Doe", "Doe");

        // Verify interactions
        verify(userRepository).findByFirstNameOrLastNameContaining("Doe");
        verify(searchUserDtoMapper).convertToDto(user1);
        verify(searchUserDtoMapper).convertToDto(user2);
    }



}
