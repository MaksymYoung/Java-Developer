package messages;

import database.Database;
import utils.exceptions.InvalidMessageDataException;
import utils.interfaces.DAO;

import java.sql.*;
import java.util.*;

public class MessageDAO implements DAO<Message> {

    public List<Message> get(UUID fromUserId, UUID toUserId) {
        List<Message> messages = new ArrayList<>();
        try (Connection con = Database.connect()) {
            String sql = "SELECT * FROM messages WHERE (user_from=? AND user_to=?) OR ( user_from=? AND user_to=?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setObject(1, fromUserId);
            ps.setObject(2, toUserId);
            ps.setObject(3, toUserId);
            ps.setObject(4, fromUserId);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                UUID messageId = UUID.fromString(rs.getString("id"));
                UUID fromUser = UUID.fromString(rs.getString("user_from"));
                UUID toUser = UUID.fromString(rs.getString("user_to"));
                String messageText = rs.getString("content");
                long time = rs.getLong("time");
                Message message = new Message(messageId, fromUser, toUser, messageText, time);
                messages.add(message);
            }
            return messages;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void insert(Message message) throws SQLException {
        try (Connection con = Database.connect()) {
            String sql = "INSERT INTO messages (user_from, user_to, content) values ( ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(sql);
            ps.setObject(1, message.getFromUserId());
            ps.setObject(2, message.getToUserId());
            ps.setObject(3, message.getMessageText());
            ps.execute();
        }
    }

    @Override
    public Optional<Message> get(UUID id) throws SQLException {
        try (Connection conn = Database.connect()) {
            String select = """
                    SELECT  messageId, fromUserId, toUserId, messageText, time
                    FROM messages
                    WHERE messageId=?
                    """;

            PreparedStatement st = conn.prepareStatement(select);
            st.setObject(1, id);

            ResultSet rs = st.executeQuery();
            rs.next();

            return Optional.of(Message.fromRS(rs));
        } catch (InvalidMessageDataException e) {
            throw new RuntimeException(e);
        }
    }
}
