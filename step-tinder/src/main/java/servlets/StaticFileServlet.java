package servlets;

import utils.resources.ResourceOps;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;

public class StaticFileServlet extends HttpServlet {

    private final String root;

    public StaticFileServlet(String fileName) {
        this.root = fileName;
    }

    @Override
    protected void doGet(HttpServletRequest rq, HttpServletResponse rs) throws IOException {

        String rqName = rq.getRequestURI();
        ClassLoader classLoader = this.getClass().getClassLoader();
        try (ServletOutputStream os = rs.getOutputStream();
             InputStream is = classLoader.getResourceAsStream(rqName.substring(1))
        ) {

            byte[] bytes = is.readAllBytes();
            os.write(bytes);
        } catch (NullPointerException ex) {
            rs.setStatus(404);
        }
    }
}
