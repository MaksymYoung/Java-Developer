package com.danit.notifications.controller;

import com.danit.notifications.exception.ExceptionBody;
import com.danit.notifications.exception.NotificationNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotificationNotFoundException.class)
    public ResponseEntity<ExceptionBody> handleNotificationNotFoundException(NotificationNotFoundException e) {
        ExceptionBody exceptionBody = new ExceptionBody();
        exceptionBody.setMessage(e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exceptionBody);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionBody> handleGeneralException(Exception e) {
        ExceptionBody exceptionBody = new ExceptionBody();
        exceptionBody.setMessage(e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exceptionBody);
    }
}

