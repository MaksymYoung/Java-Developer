package it.dan.authService.entity;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.internal.IgnoreForbiddenApisErrors;

@Getter
@Setter
public class RefreshJwtRequest {

    public String refreshToken;

}
