package it.dan.authService.service;

import it.dan.authService.dto.SearchUserDto;
import it.dan.authService.dto.UserDto;
import it.dan.authService.dto.UserUpdateDto;
import it.dan.authService.entity.Account;
import it.dan.authService.entity.PasswordResetToken;
import it.dan.authService.entity.User;
import it.dan.authService.mapper.user.SearchUserDtoMapper;
import it.dan.authService.mapper.user.UserDtoMapper;
import it.dan.authService.repository.PasswordResetTokenRepository;
import it.dan.authService.repository.UserRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDtoMapper userDtoMapper;
    @Autowired
    private SearchUserDtoMapper searchUserDtoMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public String initiatePasswordReset(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken(token, user);
            tokenRepository.save(resetToken);
            emailService.sendPasswordResetEmail(user.getEmail(), token);
            return token; // Повертаємо токен
        }
        return null;
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByToken(token);
        if (tokenOptional.isPresent()) {
            PasswordResetToken resetToken = tokenOptional.get();
            if (resetToken.isExpired()) {
                return false;
            }
            User user = resetToken.getUser();
            user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
            userRepository.save(user);
            tokenRepository.delete(resetToken);
            return true;
        }
        return false;
    }

    @Override
    public UserDto registerUser(UserDto userDto) {
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken");
        }

        User user = userDtoMapper.convertToEntity(userDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Account account = new Account();
        account.setCreatedAt(LocalDate.now());
        account.setActive(true);
        account.setUser(user);

        user.setAccount(account);

        User savedUser = userRepository.save(user);

        return userDtoMapper.convertToDto(savedUser);
    }

    @Override
    public UserDto getUserByEmailAndPassword(String email, String password) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return userDtoMapper.convertToDto(user);
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    @Override
    public UserDto getUserById(Long id) {
        return userRepository.findById(id)
                .map(userDtoMapper::convertToDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Optional<User> getByEmail(@NonNull String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public UserUpdateDto update(Long id, UserUpdateDto updatedUser) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User currentUser = optionalUser.get();
            currentUser.setFirstName(updatedUser.getFirstName());
            currentUser.setLastName(updatedUser.getLastName());
            currentUser.setPhoneNumber(updatedUser.getPhoneNumber());
            currentUser.setBirthDate(updatedUser.getBirthDate());
            currentUser.setGender(updatedUser.getGender());


            userRepository.updateUserById(id, updatedUser.getFirstName(), updatedUser.getLastName(), updatedUser.getPhoneNumber(), updatedUser.getBirthDate(), updatedUser.getGender());
            return updatedUser;
        } else {
            throw new IllegalArgumentException("User with id " + id + " not found");
        }
    }

    @Override
    public List<SearchUserDto> searchUsersByName(String name) {
        List<User> users = userRepository.findByFirstNameOrLastNameContaining(name);
        return users.stream()
                .map(searchUserDtoMapper::convertToDto)
                .collect(Collectors.toList());
    }

}

