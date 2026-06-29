package servlets;

import auth.Auth;
import likes.*;
import lombok.Data;
import users.*;
import utils.FreemarkerService;

import javax.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;

@Data
public class UserServlet extends HttpServlet {
    UserService userService;
    LikeService likeService;
    FreemarkerService freemarker;

    public UserServlet() throws IOException {
        this.userService = new UserService(new UserDAO());
        this.likeService = new LikeService(new LikeDAO());
        this.freemarker = FreemarkerService.resources();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        try {
            UUID currentUserId = UUID.fromString(Auth.getCookieValueForced(req));

            Optional<User> targetUserOpt = likeService.getFirstAvailableUser(currentUserId);

            if (targetUserOpt.isPresent()) {
                User targetUser = targetUserOpt.get();
                HashMap<String, Object> data = new HashMap<>();
                data.put("picture", targetUser.getPicture());
                data.put("fullName", targetUser.getFullName());
                data.put("username", targetUser.getUsername());
                data.put("id", targetUser.getId());

                freemarker.render("like-page.ftl", data, resp);
            } else {
                resp.sendRedirect("/liked");
            }
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) {
        try {
            UUID currentUserId = UUID.fromString(Auth.getCookieValueForced(req));

            Optional<User> targetUserOpt = likeService.getFirstAvailableUser(currentUserId);

            if (targetUserOpt.isPresent()) {
                User targetUser = targetUserOpt.get();

                String choiceOfUser = req.getParameter("choice");

                if (choiceOfUser != null) {
                    switch (choiceOfUser) {
                        case "Like":
                            likeService.insert(new Like(UUID.randomUUID(), currentUserId, targetUser.getId(), true));
                            break;
                        case "Dislike":
                            likeService.insert(new Like(UUID.randomUUID(), currentUserId, targetUser.getId(), false));
                            break;
                        default:
                            resp.getWriter().write("Error: Invalid action parameter");
                            return;
                    }
                }
            } else {
                resp.sendRedirect("/liked");
                return;
            }

            resp.sendRedirect("/users");
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
