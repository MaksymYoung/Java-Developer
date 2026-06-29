package com.danit.newsfeed.web.security;


import feign.RequestInterceptor;
import feign.RequestTemplate;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class FeignClientInterceptor implements RequestInterceptor {

    @Override
    public void apply(final RequestTemplate requestTemplate) {
        ServletRequestAttributes requestAttributes =
                (ServletRequestAttributes) RequestContextHolder
                .getRequestAttributes();
        if (requestAttributes != null) {
            HttpServletRequest request = requestAttributes.getRequest();
            String jwtToken = request.getHeader("Authorization");
            if (jwtToken != null && !jwtToken.isEmpty()) {
                requestTemplate.header("Authorization", jwtToken);
            }
        }
    }
}
