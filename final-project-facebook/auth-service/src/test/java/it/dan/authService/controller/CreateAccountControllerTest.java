package it.dan.authService.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import it.dan.authService.dto.SearchUserDto;
import it.dan.authService.dto.UserDto;
import it.dan.authService.dto.UserUpdateDto;
import it.dan.authService.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@ExtendWith(MockitoExtension.class)
@ActiveProfiles("local")
class CreateAccountControllerTest {

    @Mock
    private UserServiceImpl userService;

    @InjectMocks
    private CreateAccountController createAccountController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        mockMvc = MockMvcBuilders.standaloneSetup(createAccountController)
                .build();
    }

    @Test
    void registerUser() throws Exception {
        UserDto userDto = new UserDto();
        userDto.setFirstName("Pavlo");
        userDto.setLastName("Barabah");
        userDto.setEmail("pavlo@example.com");
        userDto.setPassword("password123");
        userDto.setBirthDate(LocalDate.of(1990, 1, 1));
        userDto.setPhoneNumber("1234567890");
        userDto.setGender("Male");

        when(userService.registerUser(any(UserDto.class))).thenReturn(userDto);

        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Pavlo"))
                .andExpect(jsonPath("$.lastName").value("Barabah"))
                .andExpect(jsonPath("$.email").value("pavlo@example.com"));

        verify(userService, times(1)).registerUser(any(UserDto.class));
    }

    @Test
    void getByEmailAndPassword() throws Exception {
        String email = "pavlo@example.com";
        String password = "password123";

        UserDto userDto = new UserDto();
        userDto.setFirstName("Pavlo");
        userDto.setLastName("Barabah");
        userDto.setEmail("pavlo@example.com");
        userDto.setPassword("password123");

        when(userService.getUserByEmailAndPassword(email, password)).thenReturn(userDto);

        mockMvc.perform(get("/api/v1/users/getByEmailAndPassword")
                        .param("email", email)
                        .param("password", password)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.password").value(password));

        verify(userService, times(1)).getUserByEmailAndPassword(email, password);
    }

    @Test
    void getUser() throws Exception {
        Long id = 2L;

        UserDto userDto = new UserDto();
        userDto.setEmail("pavlo.ivanov@example.com");
        userDto.setFirstName("Pavlo");
        userDto.setLastName("Ivanov");

        when(userService.getUserById(id)).thenReturn(userDto);

        mockMvc.perform(get("/api/v1/users/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Pavlo"))
                .andExpect(jsonPath("$.lastName").value("Ivanov"))
                .andExpect(jsonPath("$.email").value("pavlo.ivanov@example.com"));

        verify(userService, times(1)).getUserById(id);
    }

    @Test
    void updateUser() throws Exception {
        Long userId = 1L;
        UserUpdateDto userDto = new UserUpdateDto();
        userDto.setFirstName("UpdatedName");
        userDto.setLastName("UpdatedSurname");
        userDto.setBirthDate(LocalDate.of(1990, 1, 1));
        userDto.setPhoneNumber("0987654321");
        userDto.setGender("Male");

        when(userService.update(eq(userId), any(UserUpdateDto.class))).thenReturn(userDto);

        mockMvc.perform(put("/api/v1/users/id/{id}", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("UpdatedName"))
                .andExpect(jsonPath("$.lastName").value("UpdatedSurname"));

        verify(userService, times(1)).update(eq(userId), any(UserUpdateDto.class));
    }

    @Test
    void searchUsersByName() throws Exception {
        SearchUserDto user1 = new SearchUserDto();
        user1.setFirstName("John");
        user1.setLastName("Doe");

        SearchUserDto user2 = new SearchUserDto();
        user2.setFirstName("Jane");
        user2.setLastName("Doe");

        List<SearchUserDto> users = Arrays.asList(user1, user2);

        when(userService.searchUsersByName("Doe")).thenReturn(users);

        mockMvc.perform(get("/api/v1/users/searchByName")
                        .param("name", "Doe")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].firstName", is("John")))
                .andExpect(jsonPath("$[0].lastName", is("Doe")))
                .andExpect(jsonPath("$[1].firstName", is("Jane")))
                .andExpect(jsonPath("$[1].lastName", is("Doe")));
    }

}
