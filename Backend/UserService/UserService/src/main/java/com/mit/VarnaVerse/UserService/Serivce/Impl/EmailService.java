package com.mit.VarnaVerse.UserService.Serivce.Impl;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.mit.VarnaVerse.UserService.Entities.User;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date; // Assuming entity dates might be java.util.Date

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    /**
     * Helper method to convert a Date object to LocalDate for duration calculations.
     * Assuming getCheckInDate() / getCheckOutDate() return java.util.Date.
     * If your entities return java.time.LocalDate directly, this conversion can be simplified.
     */
    private LocalDate convertToLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
          .atZone(ZoneId.systemDefault())
          .toLocalDate();
    }

    // Method to send a generic email (existing code)
    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indicates HTML content

            javaMailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }

    // 1] Welcome message for a new user
    public void sendWelcomeEmail(String name,String email) {
        String subject = "Welcome to StayNest, " + name + "!";
        
        String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #3b82f6;">Hello %s, Welcome to StayNest!</h2>
                    <p style="color: #4b5563; line-height: 1.6;">Thank you for joining our community. We're excited to help you find your perfect getaway spot or list your property.</p>
                    <p style="color: #4b5563; line-height: 1.6;">Start exploring amazing listings today. Happy travels!</p>
                    <div style="text-align: center; margin-top: 25px;">
                        <a href="[YOUR_APP_URL]/listings" 
                           style="display: inline-block; padding: 12px 25px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Start Browsing Listings
                        </a>
                    </div>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; text-align: center;">The StayNest Team</p>
                </div>
            </body>
            </html>
            """, name);

        sendEmail(email, subject, htmlContent);
    }

    // 2] Forgot password email
    public void sendForgotPasswordEmail(String email, String name,String resetLink) {
        String subject = "StayNest Password Reset Request";
        
        String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #ef4444;">Password Reset Required</h2>
                    <p style="color: #4b5563; line-height: 1.6;">You have requested to reset your StayNest password. Please click the button below to proceed. This link is valid for a limited time.</p>
                    <div style="text-align: center; margin-top: 30px; margin-bottom: 30px;">
                        <a href="%s" 
                           style="display: inline-block; padding: 12px 25px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #4b5563; line-height: 1.6;">If you did not request a password reset, please ignore this email. Your current password will remain unchanged.</p>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 40px; text-align: center;">The StayNest Team</p>
                </div>
            </body>
            </html>
            """, resetLink);

        sendEmail(email, subject, htmlContent);
    }

   
}