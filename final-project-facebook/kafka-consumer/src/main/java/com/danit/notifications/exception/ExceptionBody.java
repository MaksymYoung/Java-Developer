package com.danit.notifications.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ExceptionBody {
    private String message;
    private LocalDateTime timestamp = LocalDateTime.now();
}
