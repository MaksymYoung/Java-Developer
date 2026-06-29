package utils.environment;

class ConnectionDetails {

    public static final String url = System.getenv("jdbc_url");
    public static final String username = System.getenv("jdbc_username");
    public static final String password = System.getenv("jdbc_password");

}
