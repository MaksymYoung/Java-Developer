package filters;

import auth.Auth;

import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;

public class AuthFilter implements Filter {

    private final CheckRequest checkRequest;
    private final HandleUnauthorized handleUnauthorized;

    public AuthFilter(CheckRequest cf, HandleUnauthorized hf) {
        this.checkRequest = cf;
        this.handleUnauthorized = hf;
    }

    public AuthFilter(CheckRequest cf) {
        this(cf, rs -> rs.sendRedirect("/login"));
    }

    public AuthFilter() {
        this(rq -> Auth.getCookieValue(rq).isPresent());
    }

    @Override
    public void doFilter(ServletRequest srq, ServletResponse srs, FilterChain fc) throws IOException, ServletException {
        if (isHttp(srq, srs)) {
            var rq = (HttpServletRequest) srq;
            var rs = (HttpServletResponse) srs;
            if (checkRequest.check(rq)) fc.doFilter(rq, rs);
            else handleUnauthorized.handle(rs);
        }
    }

    private boolean isHttp(ServletRequest rq, ServletResponse rs) {
        return rq instanceof HttpServletRequest && rs instanceof HttpServletResponse;
    }

    @Override
    public void init(FilterConfig filterConfig) {
        // DO NOTHING
    }

    @Override
    public void destroy() {
        // DO NOTHING
    }


    public interface CheckRequest {
        boolean check(HttpServletRequest rq);
    }

    public interface HandleUnauthorized {
        void handle(HttpServletResponse rs) throws IOException;
    }
}
