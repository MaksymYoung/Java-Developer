package com.danit.messaging.Entity;

import lombok.Data;

@Data
public class UserStatus {
    private Integer userId;
    private String status;

    public UserStatus(Integer userId, String status) {
        this.userId = userId;
        this.status = status;
    }

}