package utils.interfaces;

import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

public interface DAO<A> {

    Optional<A> get(UUID id) throws SQLException;

    void insert(A a) throws SQLException;

}
