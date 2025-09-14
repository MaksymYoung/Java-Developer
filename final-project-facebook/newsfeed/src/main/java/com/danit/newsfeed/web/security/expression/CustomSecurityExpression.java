package com.danit.newsfeed.web.security.expression;

import com.danit.newsfeed.service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Component("customSecurityExpression")
@RequiredArgsConstructor
public class CustomSecurityExpression {

    private final FeedService feedService;
    public boolean canAccessUser(
            final Long id
    ) {
        Long principal = Long.valueOf(getPrincipal());
        return principal.equals(id);
    }

    public boolean canAccessMethod(
            final Long feedId
    ) {

        Long id = Long.valueOf(getPrincipal());
        return feedService.isFeedOwner(id, feedId);
    }

    private Integer getPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext()
                .getAuthentication();
        return  (Integer) authentication.getPrincipal();
    }

}
