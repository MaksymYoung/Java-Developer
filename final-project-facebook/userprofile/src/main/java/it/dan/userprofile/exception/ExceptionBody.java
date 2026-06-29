package it.dan.userprofile.exception;

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
    private LocalDateTime timestamp;

    public ExceptionBody(String message) {
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
