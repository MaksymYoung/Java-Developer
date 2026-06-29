package com.danit.messaging.Controllers;

import com.danit.messaging.Entity.PrivateMessages;
import com.danit.messaging.Service.PrivateMessagesService;
import com.danit.messaging.dto.PrivateMessagesDto;
import com.danit.messaging.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:63342", "http://localhost:5173"})
@RequestMapping("/msg")
public class PrivateMessagesController {

    @Autowired
    private PrivateMessagesService privateMessagesService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Метод для извлечения токена и получения ID пользователя
    private Integer getUserIdFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return jwtTokenProvider.getId(token);  // Возвращаем сразу Integer
        }
        return null;
    }

    @PostMapping("/api/messages")
    @Operation(summary = "Send a private message")
    @ResponseBody
    public PrivateMessages sendMessageViaHttp(@RequestBody PrivateMessagesDto messageDto, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            return privateMessagesService.sendMessage(
                    currentUserId,
                    messageDto.getReceiverId(),
                    messageDto.getContent()
            );
        } else {
            throw new RuntimeException("Unauthorized: Invalid or missing JWT token");
        }
    }

    @GetMapping("/messages/{receiverId}")
    @Operation(summary = "Get messages between two users")
    public ResponseEntity<List<PrivateMessages>> getMessages(
            @PathVariable Integer receiverId,
            HttpServletRequest request
    ) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            List<PrivateMessages> allMessages = privateMessagesService.getAllMessagesBetween(currentUserId, receiverId);
            return ResponseEntity.ok(allMessages);
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/messages/{receiverId}")
    @Operation(summary = "Delete messages between two users")
    public ResponseEntity<Void> deleteMessages(@PathVariable Integer receiverId, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            privateMessagesService.deleteMessages(currentUserId, receiverId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/users-with-dialogs")
    @Operation(summary = "Get users with whom the current user has dialogs")
    public ResponseEntity<List<Integer>> getUsersWithDialogs(HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            List<Integer> usersWithDialogs = privateMessagesService.getUsersWithDialogs(currentUserId);
            return ResponseEntity.ok(usersWithDialogs);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
