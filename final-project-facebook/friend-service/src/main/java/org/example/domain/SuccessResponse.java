package org.example.domain;

import lombok.Data;

@Data
public class SuccessResponse<T> {
    private String status;
    private T data;

    public SuccessResponse(String status, T data) {
        this.status = status;
        this.data = data;
    }
}
