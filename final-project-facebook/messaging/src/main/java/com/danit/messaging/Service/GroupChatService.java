package com.danit.messaging.Service;

import com.danit.messaging.Entity.GroupChat;
import com.danit.messaging.Entity.GroupMessage;
import com.danit.messaging.repo.GroupChatRepository;
import com.danit.messaging.repo.GroupMessageRepository;

import exception.GroupNotFoundException;
import exception.UnauthorizedException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class GroupChatService {

    @Autowired
    private GroupChatRepository groupChatRepository;

    @Autowired
    private GroupMessageRepository groupMessageRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    public GroupChat createGroupChat(String name, Integer adminId) {
        GroupChat groupChat = new GroupChat();
        groupChat.setName(name);
        groupChat.setAdmin(adminId);  // Сохраняем adminId
        groupChat.setParticipants(new ArrayList<>(List.of(adminId)));  // Добавляем adminId в участники
        return groupChatRepository.save(groupChat);
    }
    @Transactional
    public GroupMessage sendGroupMessage(Integer senderId, Integer groupId, String content) {
        // Проверяем, существует ли группа
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));

        // Проверяем, является ли senderId участником группы
        if (group.getParticipants() == null || !group.getParticipants().contains(senderId)) {
            throw new IllegalArgumentException("Sender with ID " + senderId + " is not a participant of the group with ID " + groupId);
        }

        // Создаем и сохраняем сообщение
        GroupMessage message = new GroupMessage();
        message.setSenderId(senderId);  // Сохраняем senderId
        message.setGroupId(groupId);    // Указываем groupId
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return groupMessageRepository.save(message);
    }

    @Transactional
    public List<GroupMessage> getGroupMessages(Integer groupId, Integer currentUserId) {
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));
        if (group.getParticipants() == null || !group.getParticipants().contains(currentUserId)) {
            throw new IllegalArgumentException("User with ID " + currentUserId + " is not a participant of the group with ID " + groupId);
        }
        List<GroupMessage> groupMessages = groupMessageRepository.findByGroupId(groupId);

        groupMessages.sort(Comparator.comparing(GroupMessage::getTimestamp));

        return groupMessages;
    }

    @Transactional
    public void addParticipant(Integer groupId, Integer userId) {
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));

        if (group.getParticipants() == null) {
            group.setParticipants(new ArrayList<>());
        }

        // Проверка, является ли пользователь уже участником
        if (group.getParticipants().contains(userId)) {
            throw new IllegalArgumentException("User with ID " + userId + " is already a participant of the group");
        }

        group.getParticipants().add(userId);  // Добавляем userId
        groupChatRepository.save(group);

        // Уведомляем всех участников о добавлении нового пользователя
        simpMessagingTemplate.convertAndSend("/topic/groupParticipants/" + groupId, group.getParticipants());

        // Уведомляем нового участника о добавлении в группу
        simpMessagingTemplate.convertAndSendToUser(userId.toString(), "/queue/newChat", group);
    }

    @Transactional
    public void removeParticipant(Integer groupId, Integer userId, Integer currentUserId) {
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));

        // Проверка прав пользователя
        if (!group.getAdmin().equals(currentUserId) && !userId.equals(currentUserId)) {
            throw new UnauthorizedException("User with ID " + currentUserId + " does not have permission to remove participant " + userId);
        }

        // Удаление участника
        if (group.getParticipants() != null) {
            group.getParticipants().remove(userId);

            // Если удаленный участник был администратором
            if (group.getAdmin().equals(userId)) {
                if (group.getParticipants().isEmpty()) {
                    // Удаляем группу, если больше нет участников
                    groupChatRepository.delete(group);
                } else {
                    // Назначаем нового администратора
                    group.setAdmin(group.getParticipants().get(0));
                    groupChatRepository.save(group);
                }
            } else {
                groupChatRepository.save(group);
            }

            // Уведомляем всех участников о том, что пользователь был удален
            simpMessagingTemplate.convertAndSend("/topic/groupParticipants/" + groupId, group.getParticipants());

            // Уведомляем удаленного участника о том, что его удалили из группы
            simpMessagingTemplate.convertAndSendToUser(userId.toString(), "/queue/removedFromChat", group);
        }
    }



    public List<GroupChat> getChatsByUserId(Integer userId) {
        String jpql = "SELECT g FROM GroupChat g JOIN g.participants p WHERE p = :userId";
        TypedQuery<GroupChat> query = entityManager.createQuery(jpql, GroupChat.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }

    @Transactional
    public void deleteGroupChat(Integer groupId, Integer currentUserId) {
        GroupChat group = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));

        if (!group.getAdmin().equals(currentUserId)) {
            throw new UnauthorizedException("User with ID " + currentUserId + " does not have permission to delete this group");
        }

        // Уведомляем всех участников чата о том, что чат был удален через топик
        group.getParticipants().forEach(userId ->
                simpMessagingTemplate.convertAndSendToUser(userId.toString(), "/queue/chatDeleted", group)
        );

        // Удаляем все сообщения и сам чат
        List<GroupMessage> messages = groupMessageRepository.findByGroupId(groupId);
        groupMessageRepository.deleteAll(messages);
        groupChatRepository.deleteById(groupId);
    }


    @Transactional
    public GroupChat updateGroupName(Integer groupId, String newName, Integer currentUserId) {
        GroupChat groupChat = groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));

        if (!groupChat.getAdmin().equals(currentUserId)) {
            throw new UnauthorizedException("User with ID " + currentUserId + " does not have permission to rename this group");
        }

        groupChat.setName(newName);
        GroupChat updatedGroupChat = groupChatRepository.save(groupChat);

        // Уведомляем всех участников о смене названия группы
        groupChat.getParticipants().forEach(userId ->
                simpMessagingTemplate.convertAndSendToUser(userId.toString(), "/queue/chatRenamed", updatedGroupChat)
        );

        return updatedGroupChat;
    }


    public GroupChat getGroupById(Integer groupId) {
        return groupChatRepository.findById(groupId)
                .orElseThrow(() -> new GroupNotFoundException("Group with ID " + groupId + " not found"));
    }
}
