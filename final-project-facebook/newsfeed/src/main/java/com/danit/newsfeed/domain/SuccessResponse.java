package com.danit.newsfeed.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SuccessResponse {
    private String message;
    private Object data;
}
