package it.dan.authService.service;

import it.dan.authService.dto.SearchUserDto;
import it.dan.authService.dto.UserDto;
import it.dan.authService.dto.UserUpdateDto;

import java.util.List;

public interface UserService {
    UserDto registerUser(UserDto userDto);
    UserDto getUserByEmailAndPassword(String email, String password);
    UserDto getUserById(Long id);
    String initiatePasswordReset(String email);
    boolean resetPassword(String token, String newPassword);
    UserUpdateDto update(Long id, UserUpdateDto updatedUser);
    List<SearchUserDto> searchUsersByName(String firstName);


}
