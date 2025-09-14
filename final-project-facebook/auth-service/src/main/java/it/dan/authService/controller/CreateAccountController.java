package it.dan.authService.controller;

import io.swagger.v3.oas.annotations.Operation;
import it.dan.authService.dto.SearchUserDto;
import it.dan.authService.dto.UserDto;
import it.dan.authService.dto.UserUpdateDto;
import it.dan.authService.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class CreateAccountController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDto> registerUser(@Validated @RequestBody UserDto userDto) {
        try {
            UserDto registeredUser = userService.registerUser(userDto);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(409).body(null);
        }
    }

    @GetMapping("/getByEmailAndPassword")
    public ResponseEntity<UserDto> getByEmailAndPassword(
            @RequestParam String email,
            @RequestParam String password) {
        try {
            UserDto user = userService.getUserByEmailAndPassword(email, password);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        try {
            UserDto userDto = userService.getUserById(id);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + id + " not found");
        }
    }

    @Operation(summary = "Update user by id")
    @PutMapping("/id/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateDto userUpdateDto) {
        try {
            UserUpdateDto currentUser = userService.update(id, userUpdateDto);
            if (userUpdateDto.getFirstName() != null) {
                currentUser.setFirstName(userUpdateDto.getFirstName());
            }
            if (userUpdateDto.getLastName() != null) {
                currentUser.setLastName(userUpdateDto.getLastName());
            }
            if (userUpdateDto.getPhoneNumber() != null) {
                currentUser.setPhoneNumber(userUpdateDto.getPhoneNumber());
            }
            if (userUpdateDto.getBirthDate() != null) {
                currentUser.setBirthDate(userUpdateDto.getBirthDate());
            }
            if (userUpdateDto.getGender() != null) {
                currentUser.setGender(userUpdateDto.getGender());
            }
            if (currentUser != null) {
                return ResponseEntity.ok(currentUser);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + id + " not found");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User with ID " + id + " not found");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while updating the user");
        }
    }

    @GetMapping("/searchByName")
    public ResponseEntity<?> searchUsersByName(@RequestParam String name) {
        try {
            List<SearchUserDto> users = userService.searchUsersByName(name);
            if (!users.isEmpty()) {
                return ResponseEntity.ok(users);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No users found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while searching for users");
        }
    }




}

