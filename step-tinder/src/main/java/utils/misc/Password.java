package utils.misc;


import org.mindrot.jbcrypt.BCrypt;

public class Password {

    private final static int workload = 12;

    public static String hash(String password) {
        String salt = BCrypt.gensalt(workload);
        return BCrypt.hashpw(password, salt);
    }

    public static boolean check(String password, String hash) {
        if (hash == null || !hash.startsWith("$2a$"))
            return false;

        return BCrypt.checkpw(password, hash);
    }

}
