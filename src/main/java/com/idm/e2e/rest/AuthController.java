package com.idm.e2e.rest;

import com.idm.e2e.models.EmailRequest;
import com.idm.e2e.resources.EmailResource;
import com.idm.e2e.resources.URLResource;
import com.idm.e2e.services.UserService;
import com.idm.e2e.entities.UserEntity;
import com.idm.e2e.models.AuthResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.security.GeneralSecurityException;

import static com.idm.e2e.configuration.AppConstants.*;

@RestController
@RequestMapping(value = URI_AUTH_BASE)
public class AuthController {

    final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_REGISTER)
    public ResponseEntity<AuthResponse> signUp(HttpServletRequest request, @RequestBody UserEntity entity) {
        AuthResponse response = new AuthResponse();
        if (!entity.isEmailValid()) {
            response.addError("Please provide valid email");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        if (userService.findByEmail(entity) != null) {
            response.addError("User already registered");
            return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
        }
        response.setUser(userService.createUser(entity));
        String serverUrl = URLResource.getBaseUrl(request);
        sendActivationEmail(serverUrl, entity);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, value = URI_ACTIVATE)
    public ResponseEntity<AuthResponse> activate(@RequestBody UserEntity entity) {
        AuthResponse response = new AuthResponse();
        UserEntity user = userService.findByCode(entity);
        if (user == null) {
            response.addError("User not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
        response.setUser(userService.activateUser(entity));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    private void sendActivationEmail(String serverUrl, UserEntity entity) {
        EmailResource emailResource = new EmailResource();
        EmailRequest emailRequest = new EmailRequest();
        String messageBody = getActivationMessageBody(serverUrl, entity.getActivationCode());
        emailRequest.setRecipient(entity.getEmail());
        emailRequest.setSubject(String.format("User activation at %s", APP_NAME));
        emailRequest.setMessage(messageBody);
        try {
            emailResource.sendGmail(emailRequest);
        } catch (MessagingException | IOException | GeneralSecurityException e) {
            e.printStackTrace();
        }
    }

    private String getActivationMessageBody(String urlBase, String activationCode) {
        String url = String.format("%s%s%s/%s", urlBase, URI_AUTH_BASE, URI_ACTIVATE, activationCode);
        return "<p>Hello,</p>" +
                String.format("<p>To activate your account, please click <a href=\"%s\">here</a></p>", url) +
                String.format("<p>If the link does not work, copy this to your browser URL: %s</p>", url) +
                "<p>Yours,<br>" +
                String.format("%s</p>", APP_NAME);
    }
}
