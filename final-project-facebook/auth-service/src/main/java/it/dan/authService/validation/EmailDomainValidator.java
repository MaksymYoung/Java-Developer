package it.dan.authService.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EmailDomainValidator implements ConstraintValidator<ValidEmailDomain, String> {

    @Override
    public void initialize(ValidEmailDomain constraintAnnotation) {

    }

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null || email.isEmpty()) {
            return true;
        }

        if (!email.contains("@")) {
            return false;
        }

        int atIndex = email.indexOf("@");
        String domainPart = email.substring(atIndex + 1);
        if (!domainPart.contains(".")) {
            return false;
        }

        return true;
    }
}
