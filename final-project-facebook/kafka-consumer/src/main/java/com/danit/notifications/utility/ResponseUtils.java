package com.danit.notifications.utility;

import org.springframework.data.domain.Page;

import java.util.HashMap;
import java.util.Map;

public class ResponseUtils {

    private static final String STATUS_KEY = "status";
    private static final String MESSAGE_KEY = "message";
    private static final String DATA_KEY = "data";
    private static final String TOTAL_ELEMENTS_KEY = "totalElements";
    private static final String TOTAL_PAGES_KEY = "totalPages";
    private static final String CURRENT_PAGE_KEY = "currentPage";
    private static final String PAGE_SIZE_KEY = "pageSize";

    public static Map<String, Object> createResponse(String status, String message, Object data) {
        return Map.of(STATUS_KEY, status, MESSAGE_KEY, message, DATA_KEY, data);
    }

    public static Map<String, Object> createResponse(String status, String message) {
        return Map.of(STATUS_KEY, status, MESSAGE_KEY, message);
    }

    public static Map<String, Object> createErrorResponse(String status, String message) {
        return Map.of(STATUS_KEY, status, MESSAGE_KEY, message);
    }

    public static <T> Map<String, Object> createPagedResponse(Page<T> pageData, String status, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put(STATUS_KEY, status);
        response.put(MESSAGE_KEY, message);
        response.put(DATA_KEY, pageData.getContent());
        response.put(TOTAL_ELEMENTS_KEY, pageData.getTotalElements());
        response.put(TOTAL_PAGES_KEY, pageData.getTotalPages());
        response.put(CURRENT_PAGE_KEY, pageData.getNumber());
        response.put(PAGE_SIZE_KEY, pageData.getSize());
        return response;
    }
}
