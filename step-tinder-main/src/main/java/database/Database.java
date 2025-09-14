package database;

import utils.environment.HerokuEnv;

import java.sql.*;

public class Database {

    public static Connection connect() throws SQLException {
        return DriverManager.getConnection(HerokuEnv.jdbc_url(), HerokuEnv.jdbc_username(), HerokuEnv.jdbc_password());
    }

}
