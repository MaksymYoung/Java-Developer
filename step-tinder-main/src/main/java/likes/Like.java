package likes;

import lombok.*;
import utils.exceptions.InvalidLikeDataException;

import java.sql.*;
import java.util.UUID;

@AllArgsConstructor
@Data
public class Like {

    UUID id;
    UUID user_from;
    UUID user_to;
    boolean value;

    public static Like fromRS(ResultSet rs) throws SQLException, InvalidLikeDataException {
        UUID id = rs.getObject("id", UUID.class);
        UUID user_from = rs.getObject("user_from", UUID.class);
        UUID user_to = rs.getObject("user_to", UUID.class);
        boolean value = rs.getBoolean("value");

        if (id == null || user_from == null || user_to == null) throw new InvalidLikeDataException();

        return new Like(id, user_from, user_to, value);
    }
}
