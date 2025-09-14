package it.dan.authService.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String email, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("facebookappdanit@gmail.com");
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Hello,\n\nWe received a request to reset your password. Click the link below to reset your password:\n\n"
                + "https://dentryko.com/login/reset-password" + "\n\n"
                + "If you did not request a password reset, please ignore this email.");
        mailSender.send(message);
    }
}