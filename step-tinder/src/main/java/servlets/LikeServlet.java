package servlets;

import auth.Auth;
import likes.*;
import lombok.Data;
import users.*;
import utils.FreemarkerService;

import javax.servlet.http.*;
import java.io.*;
import java.util.*;

@Data
public class LikeServlet extends HttpServlet {
    LikeService likeService;
    FreemarkerService freemarker;

    public LikeServlet() throws IOException {
        this.likeService = new LikeService(new LikeDAO());
        this.freemarker = FreemarkerService.resources();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        UUID currentUserId = UUID.fromString(Auth.getCookieValueForced(req));
        List<User> likedUsers = likeService.getLikedUsers(currentUserId);

        List<Map<String, Object>> userDataList = new ArrayList<>();

        for (User user : likedUsers) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("picture", user.getPicture());
            userData.put("fullName", user.getFullName());
            userData.put("username", user.getUsername());
            userData.put("id", user.getId());

            userDataList.add(userData);
        }

        HashMap<String, Object> data = new HashMap<>();
        data.put("users", userDataList);


        freemarker.render("people-list.ftl", data, resp);

    }
}
