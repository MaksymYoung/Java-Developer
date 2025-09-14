package com.danit.messaging.Service;

import com.danit.messaging.Entity.GroupChat;
import com.danit.messaging.Entity.GroupMessage;
import com.danit.messaging.Entity.PrivateMessages;
import com.danit.messaging.dto.search.GroupChatSearchDto;
import com.danit.messaging.dto.search.PrivateMessageSearchDto;
import com.danit.messaging.dto.search.SearchResultsDto;
import com.danit.messaging.repo.GroupChatRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SearchService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private GroupChatRepository groupChatRepository;

    public SearchResultsDto searchMessages(Integer currentUserId, String query) {
        // Поиск приватных сообщений по тексту
        List<PrivateMessages> privateMessages = searchPrivateMessagesByContent(currentUserId, query);

        // Поиск сообщений в групповых чатах по тексту
        List<GroupMessage> groupMessages = searchGroupMessagesByContent(query);

        // Формирование результатов
        List<PrivateMessageSearchDto> privateMessageDtos = privateMessages.stream()
                .map(msg -> new PrivateMessageSearchDto(msg.getId(), msg.getContent(), msg.getTimestamp()))
                .collect(Collectors.toList());

        // Группировка сообщений по groupId
        Map<Integer, List<GroupMessage>> groupedGroupMessages = groupMessages.stream()
                .collect(Collectors.groupingBy(GroupMessage::getGroupId));

        // Получение информации о группах
        List<GroupChatSearchDto> groupChatDtos = groupedGroupMessages.entrySet().stream()
                .map(entry -> {
                    Integer groupId = entry.getKey();
                    List<GroupMessage> messages = entry.getValue();
                    GroupChat groupChat = groupChatRepository.findById(groupId)
                            .orElseThrow(() -> new RuntimeException("GroupChat not found"));
                    GroupMessage lastMessage = messages.stream()
                            .max(Comparator.comparing(GroupMessage::getTimestamp))
                            .orElse(null);
                    return new GroupChatSearchDto(groupChat.getId(), groupChat.getName(),
                            lastMessage != null ? lastMessage.getContent() : "",
                            lastMessage != null ? lastMessage.getTimestamp() : null);
                })
                .collect(Collectors.toList());

        SearchResultsDto result = new SearchResultsDto();
        result.setPrivateMessages(privateMessageDtos);
        result.setGroupChats(groupChatDtos);

        return result;
    }

    private List<PrivateMessages> searchPrivateMessagesByContent(Integer currentUserId, String content) {
        String jpql = "SELECT pm FROM PrivateMessages pm " +
                "WHERE pm.content LIKE :content " +
                "AND (pm.senderId = :currentUserId OR pm.receiverId = :currentUserId)";
        TypedQuery<PrivateMessages> query = entityManager.createQuery(jpql, PrivateMessages.class);
        query.setParameter("content", "%" + content + "%");
        query.setParameter("currentUserId", currentUserId);
        return query.getResultList();
    }

    private List<GroupMessage> searchGroupMessagesByContent(String content) {
        String jpql = "SELECT gm FROM GroupMessage gm WHERE gm.content LIKE :content";
        TypedQuery<GroupMessage> query = entityManager.createQuery(jpql, GroupMessage.class);
        query.setParameter("content", "%" + content + "%");
        return query.getResultList();
    }
}