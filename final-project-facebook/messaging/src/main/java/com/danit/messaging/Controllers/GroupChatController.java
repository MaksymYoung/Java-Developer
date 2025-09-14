package com.danit.messaging.Controllers;

import com.danit.messaging.Entity.GroupChat;
import com.danit.messaging.Entity.GroupMessage;
import com.danit.messaging.Service.GroupChatService;
import com.danit.messaging.dto.GroupMessageDto;
import com.danit.messaging.security.JwtTokenProvider;
import exception.GroupNotFoundException;
import exception.UnauthorizedException;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {"http://localhost:63342", "http://localhost:5173"})
@RequestMapping("/msg/chat")
public class GroupChatController {

    @Autowired
    private GroupChatService groupChatService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    // Метод для извлечения токена и получения ID пользователя
    private Integer getUserIdFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return jwtTokenProvider.getId(token);
        }
        return null;
    }

    @PostMapping("/create")
    @Operation(summary = "Create a group chat")
    public ResponseEntity<GroupChat> createGroupChat(@RequestParam String name, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            GroupChat groupChat = groupChatService.createGroupChat(name, currentUserId);
            return ResponseEntity.ok(groupChat);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/message")
    @Operation(summary = "Send message to group chat")
    public ResponseEntity<GroupMessage> sendGroupMessage(@RequestBody GroupMessageDto messageDto, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            GroupMessage message = groupChatService.sendGroupMessage(currentUserId, messageDto.getGroupId(), messageDto.getContent());
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/messages/{groupId}")
    @Operation(summary = "Get all messages in a group")
    public ResponseEntity<List<GroupMessage>> getGroupMessages(@PathVariable Integer groupId, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            try {
                // Получаем сообщения, проверяя, что текущий пользователь является участником группы
                List<GroupMessage> messages = groupChatService.getGroupMessages(groupId, currentUserId);
                return ResponseEntity.ok(messages);
            } catch (IllegalArgumentException e) {
                // Возвращаем статус FORBIDDEN, если текущий пользователь не является участником группы
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            }
        } else {
            // Возвращаем статус UNAUTHORIZED, если токен отсутствует или недействителен
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/addParticipant")
    @Operation(summary = "Add a member to the group")
    public ResponseEntity<Void> addParticipant(@RequestParam Integer groupId, @RequestParam Integer userId) {
        try {
            groupChatService.addParticipant(groupId, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (GroupNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/removeParticipant")
    @Operation(summary = "Remove member from a group")
    public ResponseEntity<Void> removeParticipant(@RequestParam Integer groupId, @RequestParam Integer userId, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            try {
                groupChatService.removeParticipant(groupId, userId, currentUserId);
                return ResponseEntity.ok().build();
            } catch (UnauthorizedException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            } catch (GroupNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Get all group chats for a specific user")
    public ResponseEntity<List<GroupChat>> getChatsByUserId(@PathVariable Integer userId, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            try {
                // Получаем чаты для текущего пользователя
                List<GroupChat> chats = groupChatService.getChatsByUserId(currentUserId);
                return ResponseEntity.ok(chats);
            } catch (Exception e) {
                // Логируем исключение для отладки
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            // Возвращаем статус UNAUTHORIZED, если токен отсутствует или недействителен
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/delete/{groupId}")
    @Operation(summary = "Delete a group chat by ID")
    public ResponseEntity<Void> deleteGroupChat(@PathVariable Integer groupId, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            try {
                groupChatService.deleteGroupChat(groupId, currentUserId);
                return ResponseEntity.noContent().build();
            } catch (GroupNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            } catch (UnauthorizedException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            } catch (Exception e) {
                // Логируем исключение для отладки
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/rename/{groupId}")
    @Operation(summary = "Rename a group chat")
    public ResponseEntity<GroupChat> renameGroupChat(
            @PathVariable Integer groupId,
            @RequestParam String newName,
            HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            try {
                GroupChat updatedGroupChat = groupChatService.updateGroupName(groupId, newName, currentUserId);
                return ResponseEntity.ok(updatedGroupChat);
            } catch (UnauthorizedException e) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
            } catch (GroupNotFoundException e) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
    @GetMapping("/group/{groupId}")
    @Operation(summary = "Get group chat by ID")
    public ResponseEntity<GroupChat> getGroupById(@PathVariable Integer groupId) {
        try {
            GroupChat groupChat = groupChatService.getGroupById(groupId);
            return ResponseEntity.ok(groupChat);
        } catch (GroupNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @ExceptionHandler(GroupNotFoundException.class)
    public ResponseEntity<String> handleGroupNotFoundException(GroupNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
