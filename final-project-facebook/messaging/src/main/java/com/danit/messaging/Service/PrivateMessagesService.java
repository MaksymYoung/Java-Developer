package com.danit.messaging.Service;

import com.danit.messaging.Entity.PrivateMessages;
import com.danit.messaging.repo.PrivateMessagesRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PrivateMessagesService {
    @Autowired
    private PrivateMessagesRepository messageRepository;
    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public PrivateMessages sendMessage(Integer senderId, Integer receiverId, String content) {
        PrivateMessages message = new PrivateMessages();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<PrivateMessages> getMessages(Integer senderId, Integer receiverId) {
        return messageRepository.findBySenderIdAndReceiverId(senderId, receiverId);
    }

    public List<PrivateMessages> getAllMessagesBetween(Integer user1Id, Integer user2Id) {
        List<PrivateMessages> messagesFromUser1ToUser2 = messageRepository.findBySenderIdAndReceiverId(user1Id, user2Id);
        List<PrivateMessages> messagesFromUser2ToUser1 = messageRepository.findBySenderIdAndReceiverId(user2Id, user1Id);

        List<PrivateMessages> allMessages = Stream.concat(messagesFromUser1ToUser2.stream(), messagesFromUser2ToUser1.stream())
                .collect(Collectors.toList());

        // Сортировка сообщений по времени от старых к новым
        allMessages.sort(Comparator.comparing(PrivateMessages::getTimestamp));

        return allMessages;
    }
    @Transactional
    public void deleteMessages(Integer user1Id, Integer user2Id) {
        List<PrivateMessages> messagesFromUser1ToUser2 = messageRepository.findBySenderIdAndReceiverId(user1Id, user2Id);
        List<PrivateMessages> messagesFromUser2ToUser1 = messageRepository.findBySenderIdAndReceiverId(user2Id, user1Id);

        List<PrivateMessages> allMessages = Stream.concat(messagesFromUser1ToUser2.stream(), messagesFromUser2ToUser1.stream())
                .collect(Collectors.toList());

        messageRepository.deleteAll(allMessages);
    }
    @Transactional
    public List<Integer> getUsersWithDialogs(Integer userId) {
        String jpql = "SELECT DISTINCT CASE WHEN p.senderId = :userId THEN p.receiverId ELSE p.senderId END " +
                "FROM PrivateMessages p " +
                "WHERE p.senderId = :userId OR p.receiverId = :userId";
        TypedQuery<Integer> query = entityManager.createQuery(jpql, Integer.class);
        query.setParameter("userId", userId);
        return query.getResultList();
    }
}