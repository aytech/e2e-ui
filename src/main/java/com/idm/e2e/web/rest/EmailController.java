package com.idm.e2e.web.rest;

import com.idm.e2e.web.data.EmailResource;
import com.idm.e2e.web.models.EmailRequest;
import com.idm.e2e.web.models.EmailResponse;
import com.idm.e2e.web.models.GmailAuthentication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.security.GeneralSecurityException;

import static com.idm.e2e.web.configuration.AppConstants.*;

@RestController
@RequestMapping(value = URI_MAIL_BASE)
public class EmailController {
    @RequestMapping(
            method = RequestMethod.GET,
            value = URI_GMAIL_CHECK_CREDENTIALS
    )
    public HttpEntity<EmailResponse> checkGmailCredentials() {
        EmailResource emailResource = new EmailResource();
        EmailResponse response = new EmailResponse();
        try {
            Boolean isConfigured = emailResource.isCredentialStored();
            response.setConfigured(isConfigured);
            response.setAuthURL(emailResource.getAuthorizationURL());
            if (isConfigured) {
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(response, HttpStatus.PROXY_AUTHENTICATION_REQUIRED);
            }
        } catch (GeneralSecurityException | IOException e) {
            response.setConfigured(false);
            response.setError(e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(
            method = RequestMethod.POST,
            value = URI_GMAIL_STORE_CREDENTIALS
    )
    public HttpEntity<EmailResponse> storeGmailCredentials(@RequestBody GmailAuthentication body) {
        EmailResource emailResource = new EmailResource();
        EmailResponse response = new EmailResponse();
        try {
            emailResource.createAndStoreCredential(body.getAuthCode());
            response.setConfigured(emailResource.isCredentialStored());
            response.setAuthURL(emailResource.getAuthorizationURL());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IOException | GeneralSecurityException e) {
            response.setConfigured(false);
            response.setError(e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(
            method = RequestMethod.POST,
            value = URI_GMAIL_SEND
    )
    public HttpEntity<EmailResponse> sendGmailDownloadReport(HttpServletRequest request, @RequestBody EmailRequest body) {
        body.setHost(request.getRequestURL().toString());
        body.generateReportDownloadedMessage();
        EmailResource emailResource = new EmailResource();
        EmailResponse response = new EmailResponse();
        try {
            Boolean isSent = emailResource.sendGmail(body);
            response.setMessage(emailResource.getStatusMessage());
            if (isSent) {
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (MessagingException | IOException | GeneralSecurityException e) {
            e.printStackTrace();
            response.setError(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
