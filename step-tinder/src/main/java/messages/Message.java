package messages;

import lombok.*;
import utils.exceptions.InvalidMessageDataException;

import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;

@AllArgsConstructor
@Getter
@Setter
public class Message {
    private UUID messageId;
    private UUID fromUserId;
    private UUID toUserId;
    private String messageText;
    private Long time;

    public Message(UUID fromUserId, UUID toUserId, String messageText) {
        this(null, fromUserId, toUserId, messageText, null);
    }

    public static Message fromRS(ResultSet rs) throws SQLException, InvalidMessageDataException {
        UUID messageId = rs.getObject("messageId", UUID.class);
        UUID fromUserId = rs.getObject("fromUserId", UUID.class);
        UUID toUserId = rs.getObject("toUserId", UUID.class);
        String messageText = rs.getString("messageText");
        Long time = rs.getLong("time");

        if (messageId == null || fromUserId == null || toUserId == null || messageText == null || time == null)
            throw new InvalidMessageDataException();

        return new Message(messageId, fromUserId, toUserId, messageText, time);
    }

    public static String formatUnixTimestamp(Long timestamp) {
        Date date = new Date(timestamp * 1000);
        SimpleDateFormat sdf = new SimpleDateFormat("MMMM dd, HH:mm", Locale.ENGLISH);
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/Kiev"));
        return sdf.format(date);
    }
}
