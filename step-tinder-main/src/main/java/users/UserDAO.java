package users;

import database.Database;
import utils.exceptions.InvalidUserDataException;
import utils.interfaces.DAO;

import java.sql.*;
import java.util.*;

public class UserDAO implements DAO<User> {

    public Optional<User> get(String username) throws SQLException {
        try (Connection conn = Database.connect()) {
            String select = """
                    SELECT id, username, full_name, picture, password
                    FROM users
                    WHERE username=?
                    """;

            PreparedStatement st = conn.prepareStatement(select);
            st.setString(1, username);

            ResultSet rs = st.executeQuery();
            rs.next();

            return Optional.of(User.fromRS(rs));
        } catch (InvalidUserDataException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<User> get(UUID id) throws SQLException {
        try (Connection conn = Database.connect()) {
            String select = """
                    SELECT id, username, full_name, picture, password
                    FROM users
                    WHERE id=?
                    """;

            PreparedStatement st = conn.prepareStatement(select);
            st.setObject(1, id);

            ResultSet rs = st.executeQuery();
            rs.next();

            return Optional.of(User.fromRS(rs));
        } catch (InvalidUserDataException e) {
            return Optional.empty();
        }
    }

    public List<User> getAllExcept(UUID userId) throws SQLException {
        List<User> users = new ArrayList<>();
        try (Connection conn = Database.connect()) {
            String selectAllExcept = "SELECT id, username, full_name, picture, password FROM users WHERE id != ?";
            try (PreparedStatement st = conn.prepareStatement(selectAllExcept)) {
                st.setObject(1, userId);
                ResultSet rs = st.executeQuery();
                while (rs.next()) {
                    users.add(User.fromRS(rs));
                }
            }
        } catch (InvalidUserDataException e) {
            throw new RuntimeException("Invalid user data retrieved from the database", e);
        }
        return users;
    }

    @Override
    public void insert(User u) throws SQLException {
        try (Connection conn = Database.connect()) {
            String insert = """
                    INSERT INTO users (username, full_name, picture, password)
                    values (?, ?, ?, ?)
                    """;

            PreparedStatement st = conn.prepareStatement(insert);

            st.setString(1, u.getUsername());
            st.setString(2, u.getFullName());
            st.setString(3, u.getPicture());
            st.setString(4, u.getPassword());

            int ignoredN = st.executeUpdate();
        }
    }
}
