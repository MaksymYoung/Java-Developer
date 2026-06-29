package it.dan.userprofile.utility;

import java.util.Map;

public class ResponseUtils {

    private static final String STATUS_KEY = "status";
    private static final String MESSAGE_KEY = "message";
    private static final String DATA_KEY = "data";

    public static Map<String, Object> createResponse(String status, String message, Object data) {
        return Map.of(STATUS_KEY, status, MESSAGE_KEY, message, DATA_KEY, data);
    }

    public static Map<String, Object> createResponse(String status, String message) {
        return Map.of(STATUS_KEY, status, MESSAGE_KEY, message);
    }

    public static Map<String, Object> createErrorResponse(String status, String message) {
        return Map.of(STATUS_KEY, status, MESSAGE_KEY, message);
    }
}
