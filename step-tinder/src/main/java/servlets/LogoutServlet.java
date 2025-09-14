package servlets;

import auth.Auth;
import lombok.Data;
import utils.FreemarkerService;

import javax.servlet.http.*;
import java.io.IOException;

@Data
public class LogoutServlet extends HttpServlet {
    FreemarkerService freemarker;

    public LogoutServlet() throws IOException {
        this.freemarker = FreemarkerService.resources();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Auth.clearCookie(resp);
        resp.sendRedirect("/login");
    }
}
