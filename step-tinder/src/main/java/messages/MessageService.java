package messages;

import lombok.AllArgsConstructor;

import java.sql.SQLException;
import java.util.*;

@AllArgsConstructor
public class MessageService {
    private MessageDAO dao;

    public List<Message> ReadMessageFromDialog(UUID fromUserId, UUID toUserId) {
        List<Message> messages = dao.get(fromUserId, toUserId);
        messages.sort(Comparator.comparingLong(Message::getTime));
        return messages;
    }

    public boolean addMessage(Message message) throws SQLException {
        dao.insert(message);
        return true;
    }
}
