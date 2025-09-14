package servlets;

import auth.Auth;
import lombok.Data;
import users.*;
import utils.FreemarkerService;
import utils.exceptions.UserNotFoundException;

import javax.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;

@Data
public class LoginServlet extends HttpServlet {

    UserService userService;
    FreemarkerService freemarker;

    public LoginServlet()  {
        this.userService = new UserService(new UserDAO());
        this.freemarker = FreemarkerService.resources();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        Auth.getCookieValue(req).ifPresentOrElse(
                cookieValue -> {
                    try {
                        resp.sendRedirect("/users");
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                },
                () -> {

                        HashMap<String, Object> data = new HashMap<>();
                        data.put("error", "");
                        freemarker.render("login.ftl", data, resp);

                }
        );
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String username = req.getParameter("login");
        String password = req.getParameter("password");

        try {
            User user = userService.get(username);

            if (user.checkPassword(password)) {
                Auth.setCookieValue(user.getId().toString(), resp);
                resp.sendRedirect("/users");
            } else {
                HashMap<String, Object> data = new HashMap<>();
                data.put("error", "Invalid username or password.");
                freemarker.render("login.ftl", data, resp);
            }
        } catch (SQLException | UserNotFoundException e) {
            HashMap<String, Object> data = new HashMap<>();
            data.put("error", "Invalid username or password.");
            freemarker.render("login.ftl", data, resp);
        }
    }
}
