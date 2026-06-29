package com.danit.messaging.Controllers;

import com.danit.messaging.Service.SearchService;
import com.danit.messaging.dto.search.SearchResultsDto;
import com.danit.messaging.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = {"http://localhost:63342", "http://localhost:5173"})
@RequestMapping("/msg")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    // Метод для извлечения токена и получения ID пользователя
    private Integer getUserIdFromToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return jwtTokenProvider.getId(token);  // Возвращаем сразу Integer
        }
        return null;
    }

    @GetMapping("/search")
    @Operation(summary = "Search messages by content")
    public ResponseEntity<SearchResultsDto> searchMessages(@RequestParam String query, HttpServletRequest request) {
        Integer currentUserId = getUserIdFromToken(request);
        if (currentUserId != null) {
            SearchResultsDto searchResults = searchService.searchMessages(currentUserId, query);
            return ResponseEntity.ok(searchResults);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}
