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
import java.util.Date;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    private LocalDate convertToLocalDate(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    public void sendEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            logger.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send email to " + to, e);
        }
    }

    // ---------------------------------------------------------------
    // 1] VARTAVERSE - WELCOME EMAIL
    // ---------------------------------------------------------------
    public void sendWelcomeEmail(String name, String email) {
        String subject = "Welcome to Vartaverse, " + name + "!";

        String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; background: linear-gradient(135deg,#a18cd1,#fbc2eb); padding: 25px;">
                <div style="max-width: 620px; margin: 0 auto; background-color: #ffffffdd; padding: 35px; border-radius: 14px;
                            box-shadow: 0 6px 14px rgba(150,120,200,0.25); backdrop-filter: blur(8px);">

                    <h2 style="background: linear-gradient(135deg,#a18cd1,#fbc2eb);
                               -webkit-background-clip: text; color: transparent; font-size: 28px;">
                        Welcome to Vartaverse, %s! 🌟
                    </h2>

                    <p style="color: #5b5676; font-size: 16px; line-height: 1.7;">
                        We're thrilled to welcome you to the most colorful and creative digital universe.
                    </p>

                    <p style="color: #5b5676; font-size: 16px; line-height: 1.7;">
                        Start exploring, creating, and connecting with others inside Vartaverse. Your journey begins now!
                    </p>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="[YOUR_APP_URL]/home"
                           style="padding: 14px 32px; background: #a18cd1; color: #fff; border-radius: 10px;
                                  font-weight: bold; text-decoration: none; font-size: 15px; 
                                  box-shadow: 0 4px 10px rgba(150,120,200,0.4);">
                            Explore Vartaverse
                        </a>
                    </div>

                    <p style="color: #8b88a1; font-size: 12px; text-align: center; margin-top: 40px;">
                        — Team Vartaverse
                    </p>
                </div>
            </body>
            </html>
            """, name);

        sendEmail(email, subject, htmlContent);
    }


     public void sendForgotPasswordEmail(String email, String name, String resetLink) {
        String subject = "Vartaverse Password Reset Request";

        String htmlContent = String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; background: linear-gradient(135deg,#a18cd1,#fbc2eb); padding: 25px;">
                <div style="max-width: 620px; margin: 0 auto; background: #ffffffee; padding: 35px;
                            border-radius: 14px; box-shadow: 0 6px 14px rgba(150,120,200,0.25); backdrop-filter: blur(8px);">

                    <h2 style="color: #a18cd1; font-size: 26px; font-weight: bold;">
                        Password Reset Request 🔐
                    </h2>

                    <p style="color: #5b5676; font-size: 16px; line-height: 1.7;">
                        Hi %s, we received a request to reset your Vartaverse password.
                        Click the button below to proceed. This link will expire soon.
                    </p>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="%s"
                           style="padding: 14px 34px; background: #a18cd1; color: #ffffff; border-radius: 10px;
                                  font-weight: bold; text-decoration: none; font-size: 15px;
                                  box-shadow: 0 4px 12px rgba(150,120,200,0.4);">
                            Reset Password
                        </a>
                    </div>

                    <p style="color: #5b5676; font-size: 15px; line-height: 1.7;">
                        If you didn’t request this, you can simply ignore this message.
                    </p>

                    <p style="color: #8b88a1; font-size: 12px; text-align: center; margin-top: 40px;">
                        — Team Vartaverse
                    </p>

                </div>
            </body>
            </html>
            """, name, resetLink);

        sendEmail(email, subject, htmlContent);
    }
}