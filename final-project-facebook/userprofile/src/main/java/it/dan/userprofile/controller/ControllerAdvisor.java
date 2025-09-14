package it.dan.userprofile.controller;

import it.dan.userprofile.exception.ExceptionBody;
import it.dan.userprofile.exception.ImageUploadException;
import it.dan.userprofile.exception.UserNotFoundException;
import it.dan.userprofile.exception.ImageNotFoundException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.time.LocalDateTime;

@ControllerAdvice
public class ControllerAdvisor {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ExceptionBody> handleConstraintViolationException(final ConstraintViolationException ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionBody> handleValidationException(final MethodArgumentNotValidException ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ExceptionBody> handleIllegalArgumentException(final IllegalArgumentException ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ImageUploadException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionBody handleImageUpload(final ImageUploadException ex) {
        return new ExceptionBody(ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ExceptionBody> handleUserNotFoundException(final UserNotFoundException ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ImageNotFoundException.class)
    public ResponseEntity<ExceptionBody> handleImageNotFoundException(final ImageNotFoundException ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ExceptionBody> handleRuntimeException(final RuntimeException ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionBody> handleOtherException(final Exception ex) {
        ExceptionBody exceptionBody = new ExceptionBody(ex.getMessage(), LocalDateTime.now());
        return new ResponseEntity<>(exceptionBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
