package com.danit.newsfeed.service;

import com.danit.newsfeed.domain.SuccessResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@FeignClient(name = "gatewayClient", url = "${gateway.url}")
public interface GatewayClient {
    @GetMapping("/friend-requests/friends")
    ResponseEntity<SuccessResponse> getAllFriends();
}
