package auth;

import javax.servlet.http.*;
import java.util.*;

public class Auth {

    private static final String cookieName = "AuthenticatedUserUUID";
    private static final Cookie[] emptyCookies = new Cookie[]{};
    private static final RuntimeException EXCEPTION = new RuntimeException("THIS ERROR SHOULD NOT OCCUR. CHECK IF YOU HAVE FILTERED COOKIES.");

    private static Cookie[] ensureNotNull(Cookie[] cs) {
        return cs == null ? emptyCookies : cs;
    }

    public static Optional<String> getCookieValue(HttpServletRequest rq) {
        return Arrays.stream(ensureNotNull(rq.getCookies()))
                .filter(c -> c.getName().equals(cookieName))
                .map(Cookie::getValue)
                .findFirst();
    }

    public static String getCookieValueForced(HttpServletRequest rq) {
        return getCookieValue(rq).orElseThrow(() -> EXCEPTION);
    }

    public static void setCookieValue(String v, HttpServletResponse rs) {
        Cookie cookie = new Cookie(cookieName, v);
        cookie.setMaxAge(60 * 60);
        rs.addCookie(cookie);
    }

    public static void clearCookie(HttpServletResponse rs) {
        Cookie cookie = new Cookie(cookieName, "");
        cookie.setMaxAge(0);
        rs.addCookie(cookie);
    }
}
