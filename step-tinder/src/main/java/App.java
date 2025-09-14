import filters.AuthFilter;
import filters.CharsetFilter;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import servlets.LikeServlet;
import servlets.LoginServlet;
import servlets.LogoutServlet;
import servlets.MessagesServlet;
import servlets.RegisterServlet;
import servlets.StaticFileServlet;
import servlets.UserServlet;
import utils.environment.HerokuEnv;

import javax.servlet.DispatcherType;
import java.util.EnumSet;

public class App {
    public static void main(String[] args) throws Exception {
        Server server = new Server(HerokuEnv.port());

        ServletContextHandler handler = new ServletContextHandler();
        var sfd = EnumSet.of(DispatcherType.REQUEST);

        handler.addServlet(new ServletHolder(new StaticFileServlet("static")), "/static/*");

        handler.addFilter(AuthFilter.class, "/users", sfd);
        handler.addFilter(CharsetFilter.class, "/users", sfd);
        handler.addServlet(new ServletHolder(new UserServlet()), "/users");

        handler.addFilter(AuthFilter.class, "/messages/*", sfd);
        handler.addFilter(CharsetFilter.class, "/messages/*", sfd);
        handler.addServlet(new ServletHolder(new MessagesServlet()), "/messages/*");

        handler.addFilter(AuthFilter.class, "/liked", sfd);
        handler.addFilter(CharsetFilter.class, "/liked", sfd);
        handler.addServlet(new ServletHolder(new LikeServlet()), "/liked");

        handler.addFilter(CharsetFilter.class, "/login", sfd);
        handler.addServlet(new ServletHolder(new LoginServlet()), "/login");

        handler.addFilter(CharsetFilter.class, "/register", sfd);
        handler.addServlet(new ServletHolder(new RegisterServlet()), "/register");

        handler.addServlet(new ServletHolder(new LogoutServlet()), "/logout");

        server.setHandler(handler);

        server.start();
        server.join();
    }
}
